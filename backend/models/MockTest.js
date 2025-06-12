// const mongoose = require("mongoose");

// // Define the question schema
// const questionSchema = new mongoose.Schema(
//   {
//     questionNumber: { type: Number, required: true },
//     question: { type: String, required: true },
//     questionType: {
//       type: String,
//       required: true,
//       enum: [
//         "Single-Select",
//         "Multi-Select",
//         "Fill in the Blanks",
//         "True/False",
//         "Drag and Drop",
//       ],
//       default: "Single-Select",
//     },
//     options: [
//       {
//         label: { type: String, required: true },  
//         text: { type: String, required: true },
//       },
//     ],
//     terms: [String],
//     definitions: [
//       {
//         text: { type: String },
//         match: { type: String },
//       },
//     ],
//     answer: { type: mongoose.Schema.Types.Mixed, required: true },
//     explanation: {
//       type: String,
//       required: true,
//       default: "No explanation provided",
//     },
//     tags: { type: [String], default: [] },
//     difficulty: {
//       type: String,
//       enum: ["Easy", "Medium", "Difficult"],
//       default: "Medium",
//     },
//     section: { type: String, default: "" },
//     marks: { type: Number, default: 1 },
//     time: { type: Number, default: 30 },
//   },
//   { _id: true }
// );

// // Define the mock test schema
// const mockTestSchema = new mongoose.Schema(
//   {
//     title: { type: String, required: true },
//     price: { type: Number, default: 0 },
//     isFree: { type: Boolean, required: true },
//     duration: { type: Number, required: true }, // ✅ Added duration field (in minutes)
//      // ✅ new field for storing wallpaper (base64 string or image URL)
//      wallpaper: { type: String, default: null },
//     questions: [questionSchema],
 
//     // ✅ Add this field to support activate/deactivate functionality
//     status: {
//       type: String,
//       enum: ["active", "inactive"],
//       default: "inactive",
//     },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("MockTest", mockTestSchema);


const mongoose = require("mongoose");

// Define the question schema
const questionSchema = new mongoose.Schema(
  {
    questionNumber: { type: Number, required: true },
    question: { type: String, required: true },
    questionType: {
      type: String,
      required: true,
      enum: [
        "Single-Select",
        "Multi-Select",
        "Fill in the Blanks",
        "True/False",
        "Drag and Drop",
      ],
      default: "Single-Select",
    },
    options: [
      {
        label: { type: String, required: true },
        text: { type: String, required: true },
      },
    ],
    terms: [String],
    definitions: [
      {
        text: { type: String },
        match: { type: String },
      },
    ],
    answer: { type: mongoose.Schema.Types.Mixed, required: true },
    explanation: {
      type: String,
      required: true,
      default: "No explanation provided",
    },
    tags: { type: [String], default: [] },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Difficult"],
      default: "Medium",
    },
    section: { type: String, default: "" },
    marks: { type: Number, default: 1 },
    time: { type: Number, default: 30 },
  },
  { _id: true }
);

// Define the mock test schema
const mockTestSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, default: 0 },
    isFree: { type: Boolean, required: true },
    duration: { type: Number, required: true }, // ✅ duration in minutes
    wallpaper: { type: String, default: null }, // ✅ base64 string or image URL
    questions: [questionSchema],

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },

    // ✅ NEW FIELD: To track which admin created the test
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MockTest", mockTestSchema);
