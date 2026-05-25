function jsonFileUpload(req, res, next) {
  if (req.body && Object.keys(req.body).length > 0) {
    return next();
  }

  if (!req.is('text/json') && !req.is('application/octet-stream')) {
    return next();
  }

  let body = '';
  req.setEncoding('utf8');

  req.on('data', (chunk) => {
    body += chunk;
    if (body.length > 1024 * 1024) {
      const error = new Error('Uploaded schema exceeds 1MB limit.');
      error.statusCode = 413;
      req.destroy(error);
    }
  });

  req.on('end', () => {
    if (!body.trim()) {
      req.body = {};
      return next();
    }

    try {
      req.body = JSON.parse(body);
      return next();
    } catch (error) {
      error.statusCode = 400;
      error.message = 'Uploaded schema must be valid JSON.';
      return next(error);
    }
  });

  req.on('error', next);
}

module.exports = jsonFileUpload;
