const router = require('express').Router();
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const { protect, signToken } = require('../middleware/auth');

router.post(
  '/register',
  asyncHandler(async (req, res) => {
    const { firstName, lastName, email, password, city } = req.body;
    if (!firstName || !email || !password) {
      res.status(400);
      throw new Error('First name, email and password are required');
    }
    if (await User.exists({ email: String(email).toLowerCase() })) {
      res.status(400);
      throw new Error('That email is already registered');
    }
    const user = await User.create({ firstName, lastName, email, password, city });
    res.status(201).json({ user: user.toPublic(), token: signToken(user) });
  })
);

router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email: String(email || '').toLowerCase() }).select('+password');
    if (!user || !(await user.matchPassword(password || ''))) {
      res.status(401);
      throw new Error('Invalid email or password');
    }
    res.json({ user: user.toPublic(), token: signToken(user) });
  })
);

router.get('/me', protect, (req, res) => res.json({ user: req.user.toPublic() }));

router.patch(
  '/me',
  protect,
  asyncHandler(async (req, res) => {
    const { firstName, lastName, city } = req.body;
    if (firstName !== undefined) req.user.firstName = firstName;
    if (lastName !== undefined) req.user.lastName = lastName;
    if (city !== undefined) req.user.city = city;
    await req.user.save();
    res.json({ user: req.user.toPublic() });
  })
);

module.exports = router;
