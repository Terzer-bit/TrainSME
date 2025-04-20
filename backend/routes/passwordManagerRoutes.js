const express = require('express');
const crypto = require('crypto');
const pool = require('../db/db');
const router = express.Router();

function generateSalt() {
    const salt = crypto.randomBytes(16); // Generate a random 16 byte salt (128 bits)
    const saltHex = salt.toString('hex'); //Convert it to hex to store it safely
    return saltHex;
}

function keyDerivate(master_password, salt, iter = 100000, length = 32) {
    const derivedKey = crypto.pbkdf2Sync(master_password, Buffer.from(salt, 'hex'), iter, length, 'sha256'); // Use PBKDF2 to derive the key with the master password and salt
    const keyHex = derivedKey.toString('hex');
    return keyHex;
}

function generateRandomSubkey(length = 16) {

    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_-+=<>?';

    // Guarantee it has at least one character of each
    let subkey = '';
    subkey += lowercase[Math.floor(Math.random() * lowercase.length)];
    subkey += uppercase[Math.floor(Math.random() * uppercase.length)];
    subkey += numbers[Math.floor(Math.random() * numbers.length)];
    subkey += symbols[Math.floor(Math.random() * symbols.length)];

    // Complete the password
    const charset = lowercase + uppercase + numbers + symbols;
    for (let i = subkey.length; i < length; i++) {
        subkey += charset[Math.floor(Math.random() * charset.length)];
    }

    // Convert to array and mix so the characters are truly random
    subkey = subkey.split('').sort(() => Math.random() - 0.5).join('');

    return subkey;
}


function cipherSubkey(master_password) {

    const salt = generateSalt(); // Create a salt 
    const derivedKey = keyDerivate(master_password, salt); // Generate a derived key from the master password and the salt
    const iv = crypto.randomBytes(16); // Generate a random initialization vector (iv) of 16 bytes
    const subkey = generateRandomSubkey(); // Generate a random password for the service

    const derivedKeyBuffer = Buffer.from(derivedKey, 'hex'); // Convert derivedKey to Buffer (not a string)

    // Create cipher with AES-CBC
    const cipher = crypto.createCipheriv('aes-256-cbc', derivedKeyBuffer, iv); // 'aes-256-cbc' requires a 32-byte key (256 bits)

    let cipheredSubkey = cipher.update(subkey, 'utf8', 'hex');
    cipheredSubkey += cipher.final('hex');

    return {
        cipheredSubkey,
        iv: iv.toString('hex'),
        salt
    };
}



function decipherSubkey(master_password, salt, iv, cipheredSubkey) {

    const derivedKeyHex = keyDerivate(master_password, salt);
    const derivedKey = Buffer.from(derivedKeyHex, 'hex'); // This is what createDecipheriv expects

    const ivBuffer = Buffer.from(iv, 'hex'); // Convert the iv from hex to Buffer

    const decipher = crypto.createDecipheriv('aes-256-cbc', derivedKey, ivBuffer); // Create the decipher with AES-CBC

    let decryptedSubkey = decipher.update(cipheredSubkey, 'hex', 'utf8'); // Decrypt the subkey
    decryptedSubkey += decipher.final('utf8');

    return decryptedSubkey;
}



router.post('/api/password-manager/add', async (req, res) => {
    const { service, user_id, password } = req.body;

    if (!service || user_id == null) {
        return res.status(400).json({ error: 'Missing user_id or service name' });
    }

    let cipheredSubkey, iv, salt; // Declare variables outside the try block

    try {
        const result = cipherSubkey(password); // Call cipherSubkey and get the result object
        cipheredSubkey = result.cipheredSubkey; // Assign values to the variables
        iv = result.iv;
        salt = result.salt;
    } catch (err) {
        res.status(500).json({ error: 'Failed in cipher' });
    }
    try {
        const insertQuery = `
          INSERT INTO services (service_name, user_id, salt, iv, subkey)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING *;
        `;
        const values = [service, user_id, salt, iv, cipheredSubkey];
        const result = await pool.query(insertQuery, values);

        res.status(201).json({ message: 'Service saved', test: result.rows[0] });

    } catch (err) {
        console.error('Error saving service:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.post('/api/password-manager/see', async (req, res) => {
    const { service, user_id, password } = req.body;

    if (!service || user_id == null) {
        return res.status(400).json({ error: 'Missing user_id or service name' });
    }

    try {

        // Retrieve the stored salt, iv, and ciphered subkey from the database
        const selectQuery = `
            SELECT salt, iv, subkey 
            FROM services 
            WHERE service_name = $1 AND user_id = $2
            LIMIT 1;
        `;
        const values = [service, user_id];
        const result = await pool.query(selectQuery, values);

        console.log("Database Query Result:", result);


        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Service not found for this user' });
        }
        const { salt, iv, subkey: cipheredSubkey } = result.rows[0];

        const decryptedSubkey = decipherSubkey(password, salt, iv, cipheredSubkey);

        res.status(200).json({ subkey: decryptedSubkey });

    } catch (err) {
        console.error('Error retrieving service password:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.delete('/api/password-manager/delete', async (req, res) => {
    const { service, user_id } = req.body;

    if (!service || user_id == null) {
        return res.status(400).json({ error: 'Missing user_id or service name' });
    }

    try {
        const deleteQuery = `
            DELETE FROM services WHERE service_name = $1 AND user_id = $2 RETURNING *;
        `;
        const values = [service, user_id];
        const result = await pool.query(deleteQuery, values);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Service not found or already deleted' });
        }

        res.status(200).json({ message: 'Service deleted', deleted: result.rows[0] });

    } catch (err) {
        console.error('Error deleting service:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.get('/api/password-manager/exists', async (req, res) => {
    const { user_id, service } = req.query;

    if (!user_id || !service) {
        return res.status(400).json({ error: 'Missing user_id or service' });
    }

    try {
        const checkQuery = `
            SELECT 1 FROM services
            WHERE user_id = $1 AND service_name = $2
            LIMIT 1;
        `;
        const values = [user_id, service];
        const result = await pool.query(checkQuery, values);

        const exists = result.rows.length > 0;
        return res.status(200).json({ exists });
    } catch (err) {
        console.error('Error checking if service exists:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
});



router.post('/api/password-manager/services', async (req, res) => {
    const { user_id } = req.body;
  
    if (!user_id) {
      return res.status(400).json({ error: 'Missing user_id' });
    }
  
    try {
      const result = await pool.query(
        `SELECT service_id, service_name, salt, iv, subkey
         FROM services
         WHERE user_id = $1`,
        [user_id]
      );
  
      return res.json({ services: result.rows });
    } catch (error) {
      console.error('Error fetching services:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });


  module.exports = router;