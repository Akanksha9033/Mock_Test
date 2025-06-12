// const express = require("express");
// const multer = require("multer");
// const xlsx = require("xlsx");
// const mongoose = require("mongoose");
// const router = express.Router();
// const StudentTestData = require('../models/StudentTestData');
 
// const MockTest = require("../models/MockTest");
 
// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });
 
// const validQuestionTypes = [
//   "Single-Select",
//   "Multi-Select",
//   "Fill in the Blanks",
//   "True/False",
//   "Drag and Drop",
// ];
 
// function normalizeQuestionType(type) {
//   const cleaned = (type || "").trim().toLowerCase();
//   if (cleaned === "drag and drop") return "Drag and Drop";
//   if (cleaned === "single-select") return "Single-Select";
//   if (cleaned === "multi-select") return "Multi-Select";
//   if (cleaned === "fill in the blanks") return "Fill in the Blanks";
//   if (cleaned === "true/false" || cleaned === "true-false") return "True/False";
//   return "Single-Select";
// }
 
// function shuffleArray(array) {
//   for (let i = array.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [array[i], array[j]] = [array[j], array[i]];
//   }
//   return array;
// }
 
// function formatQuestions(sheetData) {
//   const answerLetters = ["A", "B", "C", "D", "E"];
 
//   return sheetData.map((row, index) => {
//     const rawType = row["Question Type"] || "Single-Select";
//     const questionType = normalizeQuestionType(rawType);
 
//     if (questionType === "Drag and Drop") {
//       const terms = [row["Term1"], row["Term2"], row["Term3"], row["Term4"]]
//         .filter((term) => term?.trim());
 
//       let definitions = ["Definition1", "Definition2", "Definition3", "Definition4"]
//         .map((key, idx) => {
//           if (row[key]?.trim()) {
//             return {
//               text: row[key].trim(),
//               match: row[`Match${idx + 1}`]?.trim() || "No Match",
//             };
//           }
//           return null;
//         })
//         .filter(Boolean);
 
//       definitions = shuffleArray(definitions);
 
//       return {
//         questionNumber: row["Question Number"] || index + 1,
//         question: row["Question"]?.trim() || "Match the following",
//         questionType,
//         terms,
//         definitions,
//         answer: definitions.map((d) => d.match),
//         explanation: row["Explanation"]?.trim() || "No explanation provided",
//         tags: row["Tags"]
//           ? row["Tags"].split(",").map((tag) => tag.trim())
//           : [],
//         difficulty: row["Difficulty"]?.trim() || "Medium",
//         marks: Number(row["Marks"]) || 1,
//         time: Number(row["Time (minutes)"]) || 30,
//       };
//     }
 
//     const options = answerLetters
//       .map((letter) => {
//         const optionText = row[`Option ${letter}`];
//         return optionText ? { label: letter, text: optionText.trim() } : null;
//       })
//       .filter(Boolean);
 
//     return {
//       questionNumber: row["Question Number"] || index + 1,
//       question: row["Question"] || "",
//       questionType,
//       options,
//       answer: row["Correct Answer"] || "",
//       explanation: row["Explanation"] || "No explanation provided",
//       tags: row["Tags"] ? row["Tags"].split(",").map((tag) => tag.trim()) : [],
//       difficulty: row["Difficulty"] || "Medium",
//       marks: Number(row["Marks"]) || 1,
//       time: Number(row["Time (minutes)"]) || 30,
//     };
//   });
// }
 
// // ✅ Create new mock test
// router.post("/mock-tests", async (req, res) => {
//   try {
//     const { title, price, isFree, excelFile, wallpaper, duration  } = req.body;
 
//     if (!title || !excelFile || !duration) {
//       return res.status(400).json({ message: "Title, duration, and Excel file are required" });
//     }
 
//     const base64Data = excelFile.split(",")[1];
//     const binaryData = Buffer.from(base64Data, "base64");
 
//     const workbook = xlsx.read(binaryData, { type: "buffer" });
//     const sheetName = workbook.SheetNames[0];
//     const sheet = workbook.Sheets[sheetName];
//     const rawData = xlsx.utils.sheet_to_json(sheet);
 
//     const questions = formatQuestions(rawData);
 
//     const mockTest = new MockTest({
//       title,
//       price,
//       isFree,
//       duration, // ✅ Save duration
//       questions,
//       wallpaper: wallpaper || null,  // ✅ Save wallpaper if provided
//       status: "inactive" // default
//     });
 
//     await mockTest.save();
 
//     res.status(201).json({ message: "Mock test created successfully", mockTest });
//   } catch (error) {
//     console.error("❌ Error creating mock test:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });
 
// // ✅ Upload + format Excel data (without saving)
// router.post("/upload", upload.single("file"), (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ error: "No file uploaded" });
//     }
 
//     const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
//     const sheetName = workbook.SheetNames[0];
//     const sheet = workbook.Sheets[sheetName];
//     const rawData = xlsx.utils.sheet_to_json(sheet);
//     const formattedQuestions = formatQuestions(rawData);
 
//     res.json({ message: "File processed successfully", data: formattedQuestions });
//   } catch (error) {
//     console.error("Error processing file:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });
 
// // ✅ Get all mock tests
// router.get("/mock-tests", async (req, res) => {
//   try {
//     const mockTests = await MockTest.find();
//     res.json(mockTests);
//   } catch (err) {
//     console.error("Error fetching mock tests:", err);
//     res.status(500).json({ message: "Server Error" });
//   }
// });
 
// // ✅ Get one mock test by ID
// router.get("/mock-tests/:testId", async (req, res) => {
//   const { testId } = req.params;
//   try {
//     const mockTest = await MockTest.findById(testId);
//     if (!mockTest) {
//       return res.status(404).json({ message: "Mock test not found" });
//     }
//     res.json(mockTest);
//   } catch (error) {
//     console.error("Error fetching mock test:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });
 
// // ✅ Update a single question in a mock test
// router.put("/api/mock-tests/:testId/questions/:questionId", async (req, res) => {
//   try {
//     const { testId, questionId } = req.params;
//     const updatedData = req.body;
 
//     // Fetch the mock test by ID
//     const mockTest = await MockTest.findById(testId);
//     if (!mockTest) {
//       return res.status(404).json({ message: "Mock test not found" });
//     }
 
//     // Find the question by its ID within the mock test
//     const question = mockTest.questions.id(questionId);
//     if (!question) {
//       return res.status(404).json({ message: "Question not found" });
//     }
 
//     // Update fields explicitly
//     for (let key in updatedData) {
//       if (key === "options") {
//         // Clear existing options and add the new ones
//         question.options = [];
//         updatedData.options.forEach(opt => question.options.push(opt));
//         question.markModified("options");
//       } else if (key === "definitions") {
//         // Clear existing definitions and add the new ones
//         question.definitions = [];
//         updatedData.definitions.forEach(def => question.definitions.push(def));
//         question.markModified("definitions");
//       } else {
//         // Shallow update for other fields
//         question[key] = updatedData[key];
//       }
//     }
 
//     // Save the mock test with updated question
//     await mockTest.save();
 
//     // Send back a plain JS object version of the updated question
//     res.json({
//       message: "Question updated",
//       updatedQuestion: question.toObject({ depopulate: true }),
//     });
//   } catch (error) {
//     console.error("Error updating question:", error);
//     res.status(500).json({ message: "Server error", error });
//   }
// });
 
// // DELETE a mock test by ID
// router.delete("/mock-tests/:testId", async (req, res) => {
//   const { testId } = req.params;
 
//   try {
//     const deletedTest = await MockTest.findByIdAndDelete(testId);
 
//     if (!deletedTest) {
//       return res.status(404).json({ message: "Mock test not found" });
//     }
 
//     res.status(200).json({
//       message: "Mock test deleted successfully",
//       deletedTest,
//     });
//   } catch (error) {
//     console.error("Error deleting mock test:", error);
//     res.status(500).json({ message: "Server error", error });
//   }
// });
 
 
// // ✅ Toggle mock test status (active/inactive)
// router.patch("/mock-tests/:id/status", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { status } = req.body;
 
//     if (!["active", "inactive"].includes(status)) {
//       return res.status(400).json({ message: "Invalid status" });
//     }
 
//     const updated = await MockTest.findByIdAndUpdate(
//       id,
//       { status },
//       { new: true }
//     );
 
//     if (!updated) {
//       return res.status(404).json({ message: "Mock test not found" });
//     }
 
//     res.status(200).json({ message: "Mock test status updated", updated });
//   } catch (error) {
//     console.error("Error updating test status:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });
 
 
// // POST: Submit or Update Test Data
// router.post('/api/studentTestData/submit-test', async (req, res) => {
//   const { userId, testId, answers, score } = req.body;
 
//   try {
//     // Count total attempts for this user + test
//     const attempts = await StudentTestData.countDocuments({ userId, testId });
 
//     if (attempts >= 20) {
//       return res.status(400).json({ error: 'Maximum 3 attempts reached.' });
//     }
 
//     // Try to find an in-progress attempt
//     let testAttempt = await StudentTestData.findOne({ userId, testId, status: 'in-progress' });
 
//     if (testAttempt) {
//       // Update existing in-progress attempt
//       testAttempt.answers = answers;
//       testAttempt.score = score;
//       testAttempt.status = 'completed';
//       testAttempt.completedAt = new Date();
//       await testAttempt.save();
//       return res.status(200).json({ message: 'Test attempt updated.', attempt: testAttempt });
//     }
 
//     // Else, create new attempt
//     const newAttempt = new StudentTestData({
//       userId,
//       testId,
//       answers,
//       score,
//       attemptNumber: attempts + 1,
//       status: 'completed',
//       completedAt: new Date()
//     });
 
//     await newAttempt.save();
//     return res.status(201).json({ message: 'New test attempt saved.', attempt: newAttempt });
//   } catch (err) {
//     console.error('Error:', err.message);
//     return res.status(500).json({ error: 'Internal server error.' });
//   }
// });
 
// // GET: All attempts for a student (admin/teacher/management)
// router.get('/api/studentTestData/:studentId', async (req, res) => {
//   try {
//     const studentId = req.params.studentId;
//     const data = await StudentTestData.find({ userId: studentId }).sort({ createdAt: -1 });
//     res.status(200).json(data);
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to fetch student test data.' });
//   }
// });
 
 
 
// module.exports = router;






const express = require("express");
const multer = require("multer");
const xlsx = require("xlsx");
const mongoose = require("mongoose");
const router = express.Router();
const StudentTestData = require('../models/StudentTestData');
const { verifyToken, verifyRole } = require("../middleware/auth");
const nodemailer = require("nodemailer");
const MockTest = require("../models/MockTest");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const validQuestionTypes = [
  "Single-Select",
  "Multi-Select",
  "Fill in the Blanks",
  "True/False",
  "Drag and Drop",
];

function normalizeQuestionType(type) {
  const cleaned = (type || "").trim().toLowerCase();
  if (cleaned === "drag and drop") return "Drag and Drop";
  if (cleaned === "single-select") return "Single-Select";
  if (cleaned === "multi-select") return "Multi-Select";
  if (cleaned === "fill in the blanks") return "Fill in the Blanks";
  if (cleaned === "true/false" || cleaned === "true-false") return "True/False";
  return "Single-Select";
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function formatQuestions(sheetData) {
  const answerLetters = ["A", "B", "C", "D", "E"];
  let currentSection = "General";

  return sheetData
    .map((row, index) => {
      const isSectionRow =
        row["Question"] &&
        !row["Question Type"] &&
        !row["Option A"] &&
        !row["Correct Answer"];

      if (isSectionRow) {
        currentSection = row["Question"].trim();
        return null;
      }

      if (!row["Question Type"] || !row["Question"]) return null;

      const rawType = row["Question Type"];
      const questionType = normalizeQuestionType(rawType);

      const isDragDrop = questionType === "Drag and Drop";
      const hasAnswer = row["Correct Answer"] || isDragDrop;
      if (!hasAnswer) return null;

      const baseQuestion = {
        questionNumber: row["Question Number"] || index + 1,
        question: row["Question"].trim(),
        questionType,
        explanation: row["Explanation"] || "No explanation provided",
        tags: row["Tags"]
          ? row["Tags"].split(",").map((tag) => tag.trim())
          : [],
        difficulty: row["Difficulty"] || "Medium",
        marks: Number(row["Marks"]) || 1,
        time: Number(row["Time (minutes)"]) || 30,
        section: currentSection,
      };

      if (questionType === "Drag and Drop") {
        const terms = [row["Term1"], row["Term2"], row["Term3"], row["Term4"]].filter(Boolean);
        const definitions = ["Definition1", "Definition2", "Definition3", "Definition4"]
          .map((key, i) => {
            return row[key]
              ? {
                  text: row[key].trim(),
                  match: row[`Match${i + 1}`]?.trim() || "",
                }
              : null;
          })
          .filter(Boolean);

        return {
          ...baseQuestion,
          terms,
          definitions,
          answer: definitions.map((d) => d.match),
        };
      }

      const options = answerLetters
        .map((letter) => {
          const opt = row[`Option ${letter}`];
          return opt ? { label: letter, text: opt.trim() } : null;
        })
        .filter(Boolean);

      return {
        ...baseQuestion,
        options,
        answer: row["Correct Answer"] || "",
      };
    })
    .filter(Boolean);
}

// ✅ Create new mock test
router.post("/mock-tests", verifyToken, verifyRole(["admin", "superAdmin", "teacher"]), async (req, res) => {

  try {
    const { title, price, isFree, excelFile, wallpaper, duration } = req.body;

    if (!title || !excelFile || !duration) {
      return res.status(400).json({ message: "Title, duration, and Excel file are required" });
    }

    const base64Data = excelFile.split(",")[1];
    const binaryData = Buffer.from(base64Data, "base64");

    const workbook = xlsx.read(binaryData, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rawData = xlsx.utils.sheet_to_json(sheet);

    const questions = formatQuestions(rawData);

    const mockTest = new MockTest({
      title,
      price,
      isFree,
      duration,
      questions,
      wallpaper: wallpaper || null,
      status: "inactive",
      createdBy: req.user.id, // ✅ NEW: Track which admin created the test
    });

    await mockTest.save();

    try {
      const students = await mongoose.model("User").find({ role: "Student" }).select("name email");
      const emails = students.map((s) => s.email);

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: `"Edzest Education" <${process.env.EMAIL_USER}>`,
        to: emails,
        subject: "New Mock Test Available!",
        html: `
          <p>Dear Student,</p>
          <p>A new mock test titled <strong>${title}</strong> has been added to the Edzest platform.</p>
          <p>🕒 Duration: ${duration} minutes</p>
          <p>Please log in and start preparing now.</p>
          <br />
          <a href="http://localhost:3000/student-dashboard" target="_blank">
            Go to Dashboard
          </a>
          <br/><br/>
          <p>Best of luck!</p>
          <p>— Edzest Team</p>
        `,
      };

      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      console.error("❌ Failed to send test notification email:", emailError);
    }

    res.status(201).json({ message: "Mock test created successfully", mockTest });
  } catch (error) {
    console.error("❌ Error creating mock test:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Upload + format Excel data (without saving)
router.post("/upload", upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rawData = xlsx.utils.sheet_to_json(sheet);
    const formattedQuestions = formatQuestions(rawData);

    res.json({ message: "File processed successfully", data: formattedQuestions });
  } catch (error) {
    console.error("Error processing file:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Get all mock tests for current user (admin/superAdmin)
router.get("/mock-tests", verifyToken, verifyRole(["admin", "superAdmin", "teacher"]), async (req, res) => {

  try {
    const filter = req.user.role === "superAdmin" ? {} : { createdBy: req.user.id };
    const mockTests = await MockTest.find(filter).populate("createdBy", "name email");
    res.json(mockTests);
  } catch (err) {
    console.error("Error fetching mock tests:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// ✅ Get one mock test by ID
router.get("/mock-tests/:testId", async (req, res) => {
  const { testId } = req.params;
  try {
    const mockTest = await MockTest.findById(testId);
    if (!mockTest) {
      return res.status(404).json({ message: "Mock test not found" });
    }
    res.json(mockTest);
  } catch (error) {
    console.error("Error fetching mock test:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Update a single question in a mock test
router.put("/api/mock-tests/:testId/questions/:questionId", async (req, res) => {
  try {
    const { testId, questionId } = req.params;
    const updatedData = req.body;

    const mockTest = await MockTest.findById(testId);
    if (!mockTest) {
      return res.status(404).json({ message: "Mock test not found" });
    }

    const question = mockTest.questions.id(questionId);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    for (let key in updatedData) {
      if (key === "options") {
        question.options = [];
        updatedData.options.forEach(opt => question.options.push(opt));
        question.markModified("options");
      } else if (key === "definitions") {
        question.definitions = [];
        updatedData.definitions.forEach(def => question.definitions.push(def));
        question.markModified("definitions");
      } else {
        question[key] = updatedData[key];
      }
    }

    await mockTest.save();
    res.json({
      message: "Question updated",
      updatedQuestion: question.toObject({ depopulate: true }),
    });
  } catch (error) {
    console.error("Error updating question:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// DELETE a mock test by ID
router.delete("/mock-tests/:testId", async (req, res) => {
  const { testId } = req.params;

  try {
    const deletedTest = await MockTest.findByIdAndDelete(testId);

    if (!deletedTest) {
      return res.status(404).json({ message: "Mock test not found" });
    }

    res.status(200).json({
      message: "Mock test deleted successfully",
      deletedTest,
    });
  } catch (error) {
    console.error("Error deleting mock test:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ Toggle mock test status (active/inactive)
router.patch("/mock-tests/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["active", "inactive"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const updated = await MockTest.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Mock test not found" });
    }

    res.status(200).json({ message: "Mock test status updated", updated });
  } catch (error) {
    console.error("Error updating test status:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// POST: Submit or Update Test Data
router.post('/api/studentTestData/submit-test', verifyToken, async (req, res) => {

  const { userId, testId, answers, score } = req.body;

  try {
    const attempts = await StudentTestData.countDocuments({ userId, testId });

    if (attempts >= 20) {
      return res.status(400).json({ error: 'Maximum 3 attempts reached.' });
    }

    let testAttempt = await StudentTestData.findOne({ userId, testId, status: 'in-progress' });

    if (testAttempt) {
      testAttempt.answers = answers;
      testAttempt.score = score;
      testAttempt.status = 'completed';
      testAttempt.completedAt = new Date();
      await testAttempt.save();
      return res.status(200).json({ message: 'Test attempt updated.', attempt: testAttempt });
    }

    const newAttempt = new StudentTestData({
      userId,
      testId,
      answers,
      score,
      attemptNumber: attempts + 1,
      status: 'completed',
      completedAt: new Date()
    });

    await newAttempt.save();
    return res.status(201).json({ message: 'New test attempt saved.', attempt: newAttempt });
  } catch (err) {
    console.error('Error:', err.message);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

// GET: All attempts for a student (admin/teacher/management)
router.get('/api/studentTestData/:studentId', async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const data = await StudentTestData.find({ userId: studentId }).sort({ createdAt: -1 });
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch student test data.' });
  }
});

// ✅ GET: Dashboard Overview (Admin + SuperAdmin)
// ✅ GET: Dashboard Overview (Admin + SuperAdmin)
router.get("/overview", verifyToken, verifyRole(["Admin", "SuperAdmin", "superAdmin"]), async (req, res) => {
  try {
    let userFilter = {};
    let testFilter = {};
    let attemptFilter = {};

    if (req.user.role === "Admin") {
      userFilter = { createdBy: req.user.id };
      testFilter = { createdBy: req.user.id };
      attemptFilter = { createdBy: req.user.id }; // Only their students’ test attempts
    }

    const userCount = await mongoose.model("User").countDocuments(userFilter);
    const testCount = await mongoose.model("MockTest").countDocuments(testFilter);
    const attemptCount = await mongoose.model("StudentTestData").countDocuments(attemptFilter);

    res.json({
      users: userCount,
      mockTests: testCount,
      testAttempts: attemptCount,
    });
  } catch (error) {
    console.error("Dashboard overview error:", error.message);
    res.status(500).json({ message: "Failed to fetch dashboard data" });
  }
});

// ✅ Student should see only mock tests created by their own admin
// ✅ STUDENT route — keep as is
// router.get("/student-visible-tests", verifyToken, verifyRole(["Student"]), async (req, res) => {
//   try {
//     const student = await mongoose.model("User").findById(req.user.id).select("createdBy");
//     if (!student?.createdBy) {
//       return res.status(404).json({ message: "Student has no assigned admin" });
//     }

//  const teachers = await mongoose.model("User").find({ role: "Teacher", createdBy: student.createdBy });
// const teacherIds = teachers.map(t => t._id);

// const tests = await mongoose.model("MockTest").find({
//   createdBy: { $in: [student.createdBy, ...teacherIds] },
//   status: "active"
// });

//     res.status(200).json(tests);
//   } catch (error) {
//     console.error("❌ Error in student-visible-tests:", error.message);
//     res.status(500).json({ message: "Server error" });
//   }
// });

router.get("/student-visible-tests", verifyToken, verifyRole(["Student"]), async (req, res) => {
  try {
    const student = await mongoose.model("User").findById(req.user.id).select("createdBy");

    if (!student?.createdBy) {
      // ✅ Random/unassigned students see all active tests
      const allTests = await mongoose.model("MockTest").find({ status: "active" });
      return res.status(200).json(allTests);
    }

    // ✅ Assigned student: only see tests from their admin + teachers
    const teachers = await mongoose.model("User").find({ role: "Teacher", createdBy: student.createdBy });
    const teacherIds = teachers.map(t => t._id);

    const tests = await mongoose.model("MockTest").find({
      createdBy: { $in: [student.createdBy, ...teacherIds] },
      status: "active"
    });

    res.status(200).json(tests);
  } catch (error) {
    console.error("❌ Error in student-visible-tests:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});


// ✅ TEACHER route — make sure this is OUTSIDE of any other route
router.get("/teacher-visible-tests", verifyToken, verifyRole(["teacher"]), async (req, res) => {
  try {
    const teacher = await mongoose.model("User").findById(req.user.id);
    if (!teacher || !teacher.createdBy) {
      return res.status(400).json({ error: "Teacher not assigned to an admin." });
    }

    const tests = await mongoose.model("MockTest").find({
  $or: [
    { createdBy: teacher._id },          // ✅ Teacher’s own tests
    { createdBy: teacher.createdBy }     // ✅ Admin who created the teacher
  ]
});

    res.status(200).json(tests);
  } catch (err) {
    console.error("❌ Error in teacher-visible-tests:", err.message);
    res.status(500).json({ error: "Failed to fetch tests." });
  }
});

module.exports = router;
