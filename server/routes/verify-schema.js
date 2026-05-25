const express = require('express');
const asyncHandler = require('../middleware/asyncHandler');
const {
  verifySchema,
  getSchemaExample,
} = require('../controllers/verifySchemaController');

const router = express.Router();

router.post('/', asyncHandler(verifySchema));
router.get('/example', asyncHandler(getSchemaExample));

module.exports = router;
