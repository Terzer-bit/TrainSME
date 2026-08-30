const crypto = require('crypto');

function generateSalt() {
  return crypto.randomBytes(16).toString('hex');
}

function keyDerivate(master_password, salt, iter = 100000, length = 32) {
  return crypto.pbkdf2Sync(master_password, Buffer.from(salt, 'hex'), iter, length, 'sha256');
}

function generateRandomSubkey(length = 16) {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_-+=<>?';

  let subkey = '';
  subkey += lowercase[crypto.randomInt(0, lowercase.length)];
  subkey += uppercase[crypto.randomInt(0, uppercase.length)];
  subkey += numbers[crypto.randomInt(0, numbers.length)];
  subkey += symbols[crypto.randomInt(0, symbols.length)];

  const charset = lowercase + uppercase + numbers + symbols;
  for (let i = subkey.length; i < length; i++) {
    subkey += charset[crypto.randomInt(0, charset.length)];
  }

  // Shuffle seguro
  const arr = subkey.split('');
  for (let i = arr.length - 1; i > 0; i--) {
    const j = crypto.randomInt(0, i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.join('');
}

// Cifrado con AES-256-GCM
function cipherSubkeyGCM(master_password, plaintextSubkey) {
  const salt = generateSalt();
  const derivedKey = keyDerivate(master_password, salt);
  const iv = crypto.randomBytes(12); // 96-bit IV para GCM

  const cipher = crypto.createCipheriv('aes-256-gcm', derivedKey, iv);
  let cipheredSubkey = cipher.update(plaintextSubkey, 'utf8', 'hex');
  cipheredSubkey += cipher.final('hex');

  const authTag = cipher.getAuthTag().toString('hex');

  return {
    cipheredSubkey,
    iv: iv.toString('hex'),
    salt,
    authTag
  };
}

// Descifrado con AES-256-GCM y verificación de authTag
function decipherSubkeyGCM(master_password, salt, iv, authTag, cipheredSubkey) {
  const derivedKey = keyDerivate(master_password, salt);
  const decipher = crypto.createDecipheriv('aes-256-gcm', derivedKey, Buffer.from(iv, 'hex'));
  decipher.setAuthTag(Buffer.from(authTag, 'hex'));

  let decrypted = decipher.update(cipheredSubkey, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

module.exports = {
  generateRandomSubkey,
  cipherSubkeyGCM,
  decipherSubkeyGCM
};