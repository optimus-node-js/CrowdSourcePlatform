const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

function readToken(req) {
  const header = req.headers.authorization || '';
  return header.startsWith('Bearer ') ? header.slice(7) : null;
}

const protect = asyncHandler(async (req, res, next) => {
  const token = readToken(req);
  if (!token) {
    res.status(401);
    throw new Error('Please sign in to continue');
  }
  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(id);
  } catch {
    req.user = null;
  }
  if (!req.user) {
    res.status(401);
    throw new Error('Your session has expired, please sign in again');
  }
  next();
});

// Attaches req.user when a valid token is sent, but never blocks the request.
const optionalAuth = asyncHandler(async (req, res, next) => {
  const token = readToken(req);
  if (token) {
    try {
      const { id } = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(id);
    } catch {
      req.user = null;
    }
  }
  next();
});

function signToken(user) {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
}

module.exports = { protect, optionalAuth, signToken };
