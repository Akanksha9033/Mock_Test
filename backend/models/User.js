// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//     trim: true
//   },

//   email: {
//     type: String,
//     required: true,
//     unique: true,
//     lowercase: true
//   },

//   password: {
//     type: String,
//     required: true
//   },

//   role: {
//     type: String,
//     enum: ['Admin', 'Teacher', 'Student', 'Management'],
//     default: 'Student' // Student is default if not provided
//   }
// }, { timestamps: true });

// module.exports = mongoose.model('User', userSchema);




const mongoose = require('mongoose');

const socialSchema = new mongoose.Schema({
  facebook: { type: String, default: '' },
  youtube: { type: String, default: '' },
  linkedin: { type: String, default: '' },
  telegram: { type: String, default: '' },
  whatsapp: { type: String, default: '' }
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['Admin', 'Teacher', 'Student'],
    default: 'Student'
  },
  phone: {
    type: String,
    default: ''
  },
  dob: {
    type: String,  // you can also use Date type if preferred
    default: ''
  },
  location: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  social: {
    type: socialSchema,
    default: () => ({})
  },
  profilePhoto: {
    type: String,  // base64 string or data URI
    default: ''
  }
}, {
  timestamps: true  // adds createdAt and updatedAt
});

module.exports = mongoose.model('User', userSchema);
