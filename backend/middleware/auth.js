const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'Access Denied: No Token Provided' });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || 'ammachu2002');
    req.user = verified; // { customerId, type, email }
    next();
  } catch (err) {
    return res.status(400).json({ message: 'Invalid Token' });
  }
}

module.exports = verifyToken;
