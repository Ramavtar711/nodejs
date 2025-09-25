const jwt = require('jsonwebtoken');
const SECRET_KEY = 'your_secret_key';

function verifyToken(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) return res.status(403).json({ message: 'Token required' });

  jwt.verify(token, SECRET_KEY, function(err, decoded) {
    if (err) return res.status(401).json({ message: 'Invalid Token' });
    req.user = decoded;
    next();
  });
}

module.exports = verifyToken;