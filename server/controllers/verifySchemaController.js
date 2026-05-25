const { validateCircuitSchema } = require('../logic/hardwareValidator');

function verifySchema(req, res) {
  const report = validateCircuitSchema(req.body);
  const statusCode = report.success ? 200 : 400;

  return res.status(statusCode).json(report);
}

function getSchemaExample(req, res) {
  return res.json({
    format: 'Lab-Reserve BOM JSON',
    example: {
      projectName: 'ESP32 relay distance demo',
      components: [
        {
          id: 'host-1',
          partNumber: 'MCU-ESP32-WROOM32',
          quantity: 1,
        },
        {
          id: 'distance-1',
          partNumber: 'SNS-HCSR04-5V',
          quantity: 1,
          suppliedBy: 'host-1',
        },
        {
          id: 'relay-1',
          partNumber: 'ACT-RELAY-5V-1CH',
          quantity: 1,
          powerSource: 'external',
          externalPower: true,
        },
        {
          id: 'level-1',
          partNumber: 'PWR-TXS0108E-LEVEL',
          quantity: 1,
          suppliedBy: 'host-1',
        },
      ],
      connections: [
        {
          from: 'host-1',
          to: 'distance-1',
          purpose: 'signal',
          via: 'level-1',
        },
        {
          from: 'host-1',
          to: 'level-1',
          purpose: 'power',
        },
      ],
    },
    responseShape: {
      success: 'boolean',
      circuitSafetyScore: 'number 0-100',
      warnings: 'array of concrete diagnostics and mitigations',
      diagnostics: 'component and topology summary',
    },
  });
}

module.exports = {
  verifySchema,
  getSchemaExample,
};
