require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const phishingRoutes = require('./routes/phishingRoutes');
const passwordManagerRoutes = require('./routes/passwordManagerRoutes');
const metricsRoutes = require('./routes/metricsRoutes');
const enterpriseRoutes = require('./routes/enterpriseRoutes');

const app = express();

// Configuración de middlewares
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

// Registro de rutas
app.use(authRoutes);
app.use(phishingRoutes);
app.use(passwordManagerRoutes);
app.use(metricsRoutes);
app.use(enterpriseRoutes);

// Endpoint de verificación de estado
app.get('/health', (req, res) => res.status(200).json({ status: 'ok', timestamp: new Date() }));
app.get('/', (req, res) => res.json({ status: 'TrainSME Security API is running' }));

// Manejador global de errores
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Inicio del servidor garantizado en todas las interfaces de red (0.0.0.0)
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`[TrainSME Backend] Server running securely on http://0.0.0.0:${PORT}`);
});

module.exports = app;