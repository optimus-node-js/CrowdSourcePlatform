const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const asyncHandler = require('express-async-handler');

const registerUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, dob, gender } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    dob,
    gender,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      dob: user.dob,
      gender: user.gender,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      dob: user.dob,
      gender: user.gender,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      dob: user.dob,
      gender: user.gender,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

module.exports = { registerUser, loginUser, getUserProfile };
