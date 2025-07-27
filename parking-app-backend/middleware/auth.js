const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { User } = require('../models');

// Load environment variables
dotenv.config();

// Middleware to verify JWT token.  Adds `req.userId` when valid.
const verifyToken = async (req, res, next) => {
  let token = req.headers['authorization'];
  if (!token) {
    return res.status(403).json({ message: 'No token provided!' });
  }
  // Accept tokens prefixed with "Bearer "
  if (token.startsWith('Bearer ')) {
    token = token.slice(7, token.length);
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized!' });
  }
};

// Middleware to ensure the authenticated user is a manager
const isManager = async (req, res, next) => {
  const user = await User.findByPk(req.userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  if (user.role !== 'manager') {
    return res.status(403).json({ message: 'Require manager role!' });
  }
  next();
};

module.exports = {
  verifyToken,
  isManager,
};