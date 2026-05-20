const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bookingRoutes = require('./routes/booking');
const checkoutRoutes = require('./routes/checkout');
const verifyRoutes = require('./routes/verify');
const verifySchemaRoutes = require('./routes/verify-schema');

const app = express();
app.use(cors());
app.use(express.json());

// 1. Connect to MongoDB without blocking the server export
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/lab-reserve';
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected.'))
  .catch((error) => console.error('MongoDB connection error:', error));

// 2. Base Route
app.get('/', (req, res) => {
  res.json({ message: 'Lab-Reserve backend is running.' });
});

// 3. API Routes
app.use('/api/booking', bookingRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/verify', verifyRoutes);
app.use('/api', verifySchemaRoutes);

// 4. Localhost fallback (Only runs locally, Vercel ignores this part)
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

// 5. CRITICAL FOR VERCEL: Export the app instance
module.exports = app;