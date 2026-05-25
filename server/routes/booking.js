const express = require('express');
const router = express.Router();
const asyncHandler = require('../middleware/asyncHandler');
const { bookEquipment } = require('../controllers/bookingController');

router.post('/book', asyncHandler(bookEquipment));

module.exports = router;
