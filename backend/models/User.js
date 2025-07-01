const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");

const socialSchema = new mongoose.Schema({
  facebook: { type: String, default: '' },
  youtube: { type: String, default: '' },
  linkedin: { type: String, default: '' },
  telegram: { type: String, default: '' },
  whatsapp: { type: String, default: '' }
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['SuperAdmin', 'Admin', 'Teacher', 'Student'], default: 'Student' },
  phone: { type: String, default: '' },
  dob: { type: String, default: '' },
  location: { type: String, default: '' },
  description: { type: String, default: '' },
  social: { type: socialSchema, default: () => ({}) },
  profilePhoto: { type: String, default: '' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  // ✅ Now optional
  instituteName: {
    type: String,
    trim: true,
    lowercase: true,
    required: false,
  },

  // ✅ Now optional
  instituteId: {
    type: String,
    minlength: 8,
    maxlength: 8,
    unique: true,
    required: false,
  }

}, { timestamps: true });

// ✅ Only hash password if modified
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
