const mongoose = require('mongoose');

const DetailedAnswerSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId, required: true },
  selectedAnswer: mongoose.Schema.Types.Mixed,
  correctAnswer: mongoose.Schema.Types.Mixed,
  isCorrect: { type: Boolean },
  explanation: { type: String },
  tags: [String],
  difficulty: { type: String },
  timeAllocated: { type: Number },
  markedForReview: { type: Boolean },
  questionStatus: { type: String, enum: ['ANSWERED', 'NOT ANSWERED', 'MARKED FOR REVIEW', 'ANSWERED & MARKED FOR REVIEW'] }
}, { _id: false });




const StudentTestDataSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  studentName: { type: String }, // ✅ add this field
  
  testId: { type: String, required: true },
  attemptNumber: { type: Number, required: true },
  answers: { type: Object, required: true },
  detailedAnswers: [DetailedAnswerSchema],
  score: { type: Number, required: true },
  status: { type: String, enum: ['in-progress', 'completed'], default: 'in-progress' },
  completedAt: { type: Date },
  questionTimeSpent: {
  type: Map,
  of: Number, // in seconds
  default: {},
},


  // Rich reporting fields
  timeLeft: { type: Number, default: null }, // ⏱️ Add this to track remaining time
currentQuestionIndex: { type: Number, default: 0 },

  testTitle: String,
  totalMarks: Number,
  correct: Number,
  incorrect: Number,
  skipped: Number,
  rank: Number,
  topper: Number,
  average: Number,
  yourAccuracy: String,
  topperAccuracy: String,
  averageAccuracy: String,
  topicReport: { type: Array, default: [] },
  difficultyStats: { type: Object, default: {} },
  difficultyScore: { type: Object, default: {} }

}, { timestamps: true });



module.exports = mongoose.model('StudentTestData', StudentTestDataSchema);
    