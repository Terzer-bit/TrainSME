require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./db/db')
const loginRoutes = require('./routes/loginRoutes');
const phishingTestRoutes = require('./routes/phishingTestRoutes');
const passwordManagerRoutes = require('./routes/passwordManagerRoutes');
const metricsRoutes = require('./routes/metricsRoutes');

const app = express();
app.use(cors());
app.use(express.json());
app.use(loginRoutes);
app.use(phishingTestRoutes);
app.use(passwordManagerRoutes);
app.use(metricsRoutes);


const PORT = process.env.PORT || 5000;

//ROUTES
app.get('/', (req, res) => res.send('API is running'));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
