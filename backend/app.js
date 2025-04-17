require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./db/db')
const loginRoutes = require('./routes/loginRoutes');
const phishingTestRoutes = require('./routes/phishingTestRoutes');

const app = express();
app.use(cors());
app.use(express.json());
app.use(loginRoutes);
app.use(phishingTestRoutes);


const PORT = process.env.PORT || 5000;

//ROUTES
app.get('/', (req, res) => res.send('API is running'));

app.get('/api/users', async(req, res)=>{
  try{
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
  }catch (err){
    console.error(err);
    res.status(500).send('Error al obtener usuarios'); //500 = Internal Server error
  }
});

app.post('/api/users', async(req, res)=>{
  const {username, email} = req.body;
  try{
    const result = await pool.query(
      'INSERT INTO users (username, email) VALUES ($1, $2) RETURNING *',
      [username, email]
    );
  }catch (err){
    console.error(err);
    res.status(500).send('Error al crear usuario');
  }

});



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
