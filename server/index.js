const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { connectDatabase } = require('./config/database');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const jsonFileUpload = require('./middleware/jsonFileUpload');
const bookingRoutes = require('./routes/booking');
const checkoutRoutes = require('./routes/checkout');
const verifyRoutes = require('./routes/verify');
const verifySchemaRoutes = require('./routes/verify-schema');

const app = express();

app.disable('x-powered-by');
app.use(cors({
  origin: process.env.CORS_ORIGIN || true,
}));
app.use(express.json({ limit: '1mb' }));

connectDatabase().catch((error) => {
  console.error('Initial MongoDB connection failed; requests will retry when needed:', error.message);
});

app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Lab-Reserve backend',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/booking', bookingRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/verify', verifyRoutes);
app.use('/api/verify-schema', jsonFileUpload, verifySchemaRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

module.exports = app;
