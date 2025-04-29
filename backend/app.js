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


//ROUTES
app.get('/', (req, res) => res.send('API is running'));

if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;