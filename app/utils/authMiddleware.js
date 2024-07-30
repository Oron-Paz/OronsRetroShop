const jwt = require('jsonwebtoken');


const SECRET_KEY = 'your-secret-key'; // In a real app, use an environment variable

function generateToken(username, rememberMe) {
  const expiresIn = rememberMe ? '10d' : '30m';
  return jwt.sign({ username }, SECRET_KEY, { expiresIn });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    return null;
  }
}

function authMiddleware(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    res.clearCookie('token');
    return res.status(401).json({ message: 'Invalid or expired token' });
  }

  req.user = decoded;
  next();
}



module.exports = { generateToken, verifyToken, authMiddleware };