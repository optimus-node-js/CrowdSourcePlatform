const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: [true, 'First name is required'], trim: true, maxlength: 50 },
    lastName: { type: String, trim: true, maxlength: 50, default: '' },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    password: { type: String, required: true, minlength: [6, 'Password must be at least 6 characters'], select: false },
    city: { type: String, trim: true, maxlength: 60, default: '' },
    role: { type: String, enum: ['citizen', 'moderator'], default: 'citizen' },
    reputation: { type: Number, default: 0 },
    // Legacy fields from v1, kept optional so existing accounts still load.
    dob: Date,
    gender: String,
  },
  { timestamps: true }
);

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.matchPassword = function matchPassword(plain) {
  return bcrypt.compare(plain, this.password);
};

userSchema.virtual('name').get(function name() {
  return [this.firstName, this.lastName].filter(Boolean).join(' ');
});

userSchema.methods.toPublic = function toPublic() {
  return {
    _id: this._id,
    name: this.name,
    firstName: this.firstName,
    lastName: this.lastName,
    email: this.email,
    city: this.city,
    role: this.role,
    reputation: this.reputation,
    createdAt: this.createdAt,
  };
};

userSchema.statics.award = function award(userId, points) {
  return this.updateOne({ _id: userId }, { $inc: { reputation: points } });
};

module.exports = mongoose.model('User', userSchema);
