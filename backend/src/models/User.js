const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    department: {
      type: String,
      required: true,
    },
    year: {
      type: String,
      default: 'Not specified',
    },
    role: {
      type: String,
      enum: ['student', 'alumni', 'admin'],
      default: 'student',
    },
    graduationYear: {
      type: String,
    },
    // Optional profile fields for mentors
    skills: [
      {
        type: String,
        trim: true,
      },
    ],
    currentCompany: {
      type: String,
      trim: true,
    },
    designation: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    bio: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// Hide password hash in JSON outputs
UserSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.passwordHash;
  return obj;
};

const User = mongoose.model('User', UserSchema);

module.exports = User;

