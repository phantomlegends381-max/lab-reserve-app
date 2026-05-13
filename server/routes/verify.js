const express = require('express');
const router = express.Router();
const { verifyCircuit } = require('../logic/schemaChecker');

router.post('/', (req, res) => {
  const components = req.body.components || [];
  const result = verifyCircuit(components);

  if (!result.success) {
    return res.status(400).json(result);
  }

  return res.status(200).json(result);
});

module.exports = router;
