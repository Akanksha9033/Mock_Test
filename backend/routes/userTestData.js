const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const StudentTestData = require('../models/StudentTestData');
const MockTest = require('../models/MockTest');
const User = require('../models/User');

router.get('/results/:id', async (req, res) => {
  try {
    const result = await StudentTestData.findById(req.params.id);
    if (!result) return res.status(404).json({ error: 'Result not found' });

    const test = await MockTest.findById(result.testId);
    const allResults = await StudentTestData.find({ testId: result.testId });

    const totalQuestions = result.detailedAnswers.length;
    const correct = result.detailedAnswers.filter(a => a.isCorrect).length;
    const incorrect = result.detailedAnswers.filter(a => a.selectedAnswer && !a.isCorrect).length;
    const skipped = result.detailedAnswers.filter(a => a.selectedAnswer === null).length;
    const score = result.score || 0;

    const sorted = allResults.sort((a, b) => (b.score || 0) - (a.score || 0));
    const rank = sorted.findIndex(r => r._id.toString() === result._id.toString()) + 1;
    const topper = sorted[0]?.score || 0;
    const average = sorted.length > 0
      ? (sorted.reduce((acc, r) => acc + (r.score || 0), 0) / sorted.length).toFixed(2)
      : "0.00";

    const topperCorrectCount = sorted[0]?.detailedAnswers?.filter(a => a.isCorrect).length || 0;
    const topperAccuracy = totalQuestions > 0
      ? ((topperCorrectCount / totalQuestions) * 100).toFixed(2)
      : "0.00";

    const averageCorrectCount = sorted.reduce((acc, r) => {
      if (!r.detailedAnswers) return acc;
      return acc + r.detailedAnswers.filter(a => a.isCorrect).length;
    }, 0);
    const averageAccuracy = (sorted.length > 0 && totalQuestions > 0)
      ? ((averageCorrectCount / (sorted.length * totalQuestions)) * 100).toFixed(2)
      : "0.00";

    const topicMap = {};
    for (const ans of result.detailedAnswers) {
      for (const tag of ans.tags || []) {
        if (!topicMap[tag]) topicMap[tag] = { tag, total: 0, correct: 0 };
        topicMap[tag].total += 1;
        if (ans.isCorrect) topicMap[tag].correct += 1;
      }
    }
    const topicReport = Object.values(topicMap);

    const difficultyStats = { Easy: 0, Medium: 0, Intense: 0 };
    const difficultyScore = { Easy: 0, Medium: 0, Intense: 0 };
    for (const ans of result.detailedAnswers) {
      const level = ans.difficulty || 'Medium';
      difficultyStats[level] += 1;
      if (ans.isCorrect) difficultyScore[level] += (ans.marks || 1);
    }

    const enrichedQuestions = (test?.questions || []).map((q) => {
      const qId = q._id?.toString() || q.questionNumber?.toString();
      const attempt = result.answers?.[qId];

      return {
        ...q.toObject?.() || q,
        selectedAnswer: attempt?.selectedOption ?? null,
        correctAnswer: q.correctAnswer || null,
        isCorrect: attempt?.isCorrect ?? null,
        explanation: q.explanation || null,
        options: q.options || [],
        definitions: q.questionType === 'Drag and Drop' ? q.definitions || [] : undefined,
        terms: q.questionType === 'Drag and Drop' ? q.terms || [] : undefined,
        answer: q.questionType === 'Drag and Drop' ? q.answer || [] : undefined,
      };
    });

    const yourAccuracy = totalQuestions > 0 ? ((correct / totalQuestions) * 100).toFixed(2) : "0.00";

    // ✅ Safely calculate totalTimeSpent (exclude non-question keys)
    const totalTimeSpent = Object.entries(result.questionTimeSpent || {})
      .filter(([key]) => !["timeLeft", "currentQuestionIndex"].includes(key))
      .reduce((sum, [, seconds]) => sum + seconds, 0);

    // ✅ Add top 3 names and scores
    const topperName = sorted[0]?.studentName || "Topper";
    const secondName = sorted[1]?.studentName || "Second";
    const thirdName = sorted[2]?.studentName || "Third";

    const secondScore = sorted[1]?.score || 0;
    const thirdScore = sorted[2]?.score || 0;

    await StudentTestData.findByIdAndUpdate(req.params.id, {
      testTitle: test?.title || 'Mock Test',
      totalMarks: test?.questions?.length || 0,
      correct,
      incorrect,
      skipped,
      rank,
      topper,
      average,
      yourAccuracy,
      topperAccuracy,
      averageAccuracy,
      topicReport,
      difficultyStats,
      difficultyScore,
    });

    res.json({
      _id: result._id,
      testTitle: test?.title || 'Mock Test',
      totalMarks: test?.questions?.length || 0,
      score,
      correct,
      incorrect,
      skipped,
      rank,
      topper,
      average,
      yourAccuracy,
      topperAccuracy,
      averageAccuracy,
      topicReport,
      difficultyStats,
      difficultyScore,
      questions: enrichedQuestions,
      answers: result?.answers || {},
      detailedAnswers: result?.detailedAnswers || [],
      questionTimeSpent: result?.questionTimeSpent || {},
      totalTimeSpent,
      topperName,
      secondName,
      thirdName,
      topperScore: topper,
      secondScore,
      thirdScore,
      averageScore: average
    });

  } catch (err) {
    console.error('❌ Error in GET /api/results/:id', err);
    res.status(500).json({ error: 'Something went wrong.' });
  }
});


router.post('/userTestData/auto-save', async (req, res) => {
  try {
    console.log("📥 Incoming auto-save payload:", req.body);
    const {
      attemptId,
      answers,
      markedForReviewMap,
      questionStatusMap,
      timeLeft,
      score,
      yourAccuracy,
      status,
      completedAt,
      currentQuestionIndex,
      totalMarks,
      questionTimeSpent // ✅ include this from request
    } = req.body;

    if (!attemptId){ 
      console.error("❌ Missing attemptId");
      return res.status(400).json({ error: 'Missing attemptId' })
    };

    const attempt = await StudentTestData.findById(attemptId);
    if (!attempt) {
      console.error("❌ Attempt not found for ID:", attemptId);
      return res.status(404).json({ error: 'Attempt not found' })};
   if (attempt.status === 'completed') {
      console.warn("⚠️ Attempt already submitted:", attemptId);
      return res.status(400).json({ error: 'Attempt already submitted', status: attempt.status });
    }

    console.log("✅ Attempt found and valid, proceeding...");

    const test = await MockTest.findById(attempt.testId);
    const questionMap = new Map((test?.questions || []).map(q => [q._id.toString(), q]));

    const totalQuestions = [...questionMap.values()].filter(q => q.questionType && q.question?.trim()).length;

    let localScore = 0;
    let correct = 0;
    let attempted = 0;

    const detailedAnswers = [];

    const normalizeStatus = (status) => {
      switch (status) {
        case 'answered': return 'ANSWERED';
        case 'unanswered': return 'NOT ANSWERED';
        case 'marked': return 'MARKED FOR REVIEW';
        case 'answeredMarked': return 'ANSWERED & MARKED FOR REVIEW';
        default: return 'NOT ANSWERED';
      }
    };

    for (const [questionId, answer] of Object.entries(answers || {})) {
      const originalQ = questionMap.get(questionId);
      if (!originalQ) continue;

      const selected = answer.selectedOption;
      const isCorrect = !!answer.isCorrect;
      const marks = originalQ?.marks || 1;

      if (selected !== undefined && selected !== null) attempted++;
      if (isCorrect) {
        correct++;
        localScore += marks;
      }

      detailedAnswers.push({
        questionId,
        selectedAnswer: selected,
        correctAnswer: answer.correctAnswer || [],
        isCorrect,
        explanation: originalQ?.explanation || '',
        tags: originalQ?.tags || [],
        difficulty: originalQ?.difficulty || 'Medium',
        timeAllocated: originalQ?.timeAllocated || 0,
        markedForReview: markedForReviewMap?.[questionId] || false,
        questionStatus: normalizeStatus(questionStatusMap?.[questionId]),
      });
    }

    const incorrect = attempted - correct;
    const skipped = totalQuestions - attempted;
    const calcAccuracy = totalQuestions > 0 ? ((correct / totalQuestions) * 100).toFixed(2) : "0.00";

    // Topic report
    const topicMap = {};
    for (const ans of detailedAnswers) {
      for (const tag of ans.tags || []) {
        if (!topicMap[tag]) topicMap[tag] = { tag, total: 0, correct: 0 };
        topicMap[tag].total += 1;
        if (ans.isCorrect) topicMap[tag].correct += 1;
      }
    }
    const topicReport = Object.values(topicMap);

    // Difficulty breakdown
    const difficultyStats = { Easy: 0, Medium: 0, Intense: 0 };
    const difficultyScore = { Easy: 0, Medium: 0, Intense: 0 };
    for (const ans of detailedAnswers) {
      const level = ans.difficulty || 'Medium';
      const qid = ans.questionId?.toString();
      const marks = questionMap.get(qid)?.marks || 1;
      difficultyStats[level] += 1;
      if (ans.isCorrect) difficultyScore[level] += marks;
    }

    // ✅ Store all fields
    attempt.answers = answers || {};
    attempt.markedForReviewMap = markedForReviewMap || {};
    attempt.questionStatusMap = questionStatusMap || {};
    attempt.detailedAnswers = detailedAnswers;
    attempt.score = typeof score === 'number' ? score : localScore;
    attempt.correct = correct;
    attempt.incorrect = incorrect;
    attempt.skipped = skipped;
    attempt.yourAccuracy = yourAccuracy || calcAccuracy;
    attempt.topicReport = topicReport;
    attempt.difficultyStats = difficultyStats;
    attempt.difficultyScore = difficultyScore;
    attempt.timeLeft = typeof timeLeft === 'number' ? timeLeft : attempt.timeLeft;
    attempt.currentQuestionIndex = typeof currentQuestionIndex === 'number' ? currentQuestionIndex : 0;
    attempt.totalMarks = typeof totalMarks === 'number'
      ? totalMarks
      : [...questionMap.values()]
        .filter(q => q.questionType && q.question?.trim())
        .reduce((sum, q) => sum + (q.marks || 1), 0);

    // ✅ Only update status if not already completed
    if (attempt.status !== 'completed') {
      attempt.status = status || 'in-progress';
      attempt.completedAt = completedAt ?? null;
    }

    attempt.updatedAt = new Date();

    // ✅ Merge per-question time tracking
    if (questionTimeSpent && typeof questionTimeSpent === 'object') {
      if (!attempt.questionTimeSpent) attempt.questionTimeSpent = {};
      Object.entries(questionTimeSpent).forEach(([qid, time]) => {
        if (!attempt.questionTimeSpent[qid]) {
          attempt.questionTimeSpent[qid] = 0;
        }
        attempt.questionTimeSpent[qid] += time;
      });
    }

    await attempt.save({ optimisticConcurrency: false });

    res.status(200).json({ message: 'Auto-save successful' });

  } catch (err) {
    console.error("❌ Auto-save error:", err);
    res.status(500).json({ error: "Auto-save failed." });
  }
});


// 🧠 Final Submit (manual or auto-on-exit)
router.post('/userTestData/submit-test', async (req, res) => {
  try {
    const {
      userId,
      testId,
      answers,
      markedForReviewMap,
      questionStatusMap,
      detailedAnswers,
      questionTimeSpent
    } = req.body;

    console.log("📥 [Submit-Test] Incoming payload keys:", Object.keys(req.body));
    console.log("🕒 [Submit-Test] Incoming questionTimeSpent:", questionTimeSpent);

    if (!Array.isArray(detailedAnswers)) {
      return res.status(400).json({ error: 'Invalid detailedAnswers' });
    }

    const attempt = await StudentTestData.findOne({ userId, testId, status: 'in-progress' }).sort({ createdAt: -1 });
    if (!attempt) {
      console.error("❌ No in-progress attempt found for", userId, testId);
      return res.status(404).json({ error: 'No in-progress attempt found' });
    }

    const test = await MockTest.findById(testId);
    const user = await User.findById(userId);

    const questionMap = {};
    for (const q of test?.questions || []) {
      const qid = (q._id || q.questionNumber)?.toString();
      questionMap[qid] = q;
    }

    let score = 0;
    let correct = 0;
    let incorrect = 0;
    let attempted = 0;

    for (const ans of detailedAnswers) {
      const qid = ans.questionId?.toString();
      const q = questionMap[qid];

      const isAttempted = ans.selectedAnswer !== null && ans.selectedAnswer !== undefined;
      if (isAttempted) {
        attempted++;
        if (ans.isCorrect) {
          correct++;
          score += q?.marks || 1;
        } else {
          incorrect++;
        }
      }
    }

    const totalQuestions = Object.keys(questionMap).length;
    const skipped = totalQuestions - attempted;
    const yourAccuracy = totalQuestions > 0 ? ((correct / totalQuestions) * 100).toFixed(2) : "0.00";

    const allResults = await StudentTestData.find({ testId });
    const sorted = allResults.sort((a, b) => (b.score || 0) - (a.score || 0));
    const rank = sorted.findIndex(r => r._id.toString() === attempt._id.toString()) + 1;

    const topicMap = {};
    for (const ans of detailedAnswers) {
      for (const tag of ans.tags || []) {
        if (!topicMap[tag]) topicMap[tag] = { tag, total: 0, correct: 0 };
        topicMap[tag].total += 1;
        if (ans.isCorrect) topicMap[tag].correct += 1;
      }
    }
    const topicReport = Object.values(topicMap);

    const difficultyStats = { Easy: 0, Medium: 0, Intense: 0 };
    const difficultyScore = { Easy: 0, Medium: 0, Intense: 0 };
    for (const ans of detailedAnswers) {
      const level = ans.difficulty || 'Medium';
      const qid = ans.questionId?.toString();
      const marks = questionMap[qid]?.marks || 1;
      difficultyStats[level] += 1;
      if (ans.isCorrect) difficultyScore[level] += marks;
    }

    // ✅ Merge time tracking
    if (questionTimeSpent && typeof questionTimeSpent === 'object') {
      if (!attempt.questionTimeSpent) attempt.questionTimeSpent = {};
      Object.entries(questionTimeSpent).forEach(([qid, time]) => {
        if (!attempt.questionTimeSpent[qid]) {
          attempt.questionTimeSpent[qid] = 0;
        }
        attempt.questionTimeSpent[qid] += time;
      });
    }

    // ✅ Force correct time map into updatePayload
    const mergedTimeSpent = questionTimeSpent || attempt.questionTimeSpent || {};
    console.log("✅ [Submit-Test] Final merged questionTimeSpent:", mergedTimeSpent);

    const updatePayload = {
      answers,
      markedForReviewMap,
      questionStatusMap,
      detailedAnswers,
      score,
      status: 'completed',
      completedAt: new Date(),
      testTitle: test?.title || 'Mock Test',
      studentName: user?.name || "Unknown",
      totalMarks: test?.questions
        ?.filter(q => q.questionType && q.question?.trim())
        .reduce((sum, q) => sum + (q.marks || 1), 0),
      correct,
      incorrect,
      skipped,
      rank,
      topper: sorted[0]?.score || 0,
      average: sorted.length > 0
        ? (sorted.reduce((acc, r) => acc + (r.score || 0), 0) / sorted.length).toFixed(2)
        : "0.00",
      yourAccuracy,
      topicReport,
      difficultyStats,
      difficultyScore,
      questionTimeSpent: mergedTimeSpent // ✅ final merged value injected
    };

    console.log("📤 [Submit-Test] Saving updatePayload for attempt:", attempt._id);
    await StudentTestData.findByIdAndUpdate(attempt._id, updatePayload, { new: true });

    console.log("✅ [Submit-Test] Submission complete for attempt:", attempt._id);
    res.status(200).json({ resultId: attempt._id });

  } catch (err) {
    console.error("❌ Submission error:", err);
    res.status(500).json({ error: "Submission failed" });
  }
});



// 🔁 Start attempt (called only if no in-progress exists)
router.post('/userTestData/start-attempt', async (req, res) => {
  const { userId, testId } = req.body;
  try {
    const count = await StudentTestData.countDocuments({ userId, testId });
    if (count >= 5) return res.status(403).json({ error: "Max 5 attempts allowed" });

    const test = await MockTest.findById(testId);
    const user = await User.findById(userId);

    const newAttempt = new StudentTestData({
      userId,
      testId,
      attemptNumber: count + 1,
      answers: {},
      score: 0,
      detailedAnswers: [],
      status: 'in-progress',
      testTitle: test?.title || 'Mock Test',
      studentName: user?.name || "Unknown",
      markedForReviewMap: {},
      questionStatusMap: {},
      timeLeft: test?.duration * 60 || 0,
    });

    const saved = await newAttempt.save();
    res.status(200).json({ attempt: saved });
  } catch (err) {
    console.error("❌ Error starting attempt:", err);
    res.status(500).json({ error: "Start failed" });
  }
});

// 🔁 Resume if in-progress
router.get('/userTestData/latest-attempt', async (req, res) => {
  const { userId, testId } = req.query;
  try {
    const latest = await StudentTestData.findOne({ userId, testId, status: 'in-progress' }).sort({ createdAt: -1 });
    if (!latest) return res.json({ attempt: null });

    res.json({
      attempt: {
        _id: latest._id,
        status: latest.status,
        answers: latest.answers || {},
        markedForReviewMap: latest.markedForReviewMap || {},
        questionStatusMap: latest.questionStatusMap || {},
        timeLeft: latest.timeLeft,
        attemptNumber: latest.attemptNumber,
        currentQuestionIndex: latest.currentQuestionIndex || 0
      }
    });
  } catch (err) {
    console.error("❌ Resume error:", err);
    res.status(500).json({ error: "Resume failed" });
  }
});



// ✅ GET STUDENT DASHBOARD DATA
router.get('/user/dashboard/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const attempts = await StudentTestData.find({ userId })
      .sort({ createdAt: -1 })
      .select(
        'testTitle attemptNumber completedAt status score totalMarks correct incorrect skipped rank topper average yourAccuracy topperAccuracy averageAccuracy topicReport difficultyStats difficultyScore'
      );

    // ✅ Always return consistent JSON shape
    if (!Array.isArray(attempts) || attempts.length === 0) {
      return res.json({ attempts: [], summary: {} });
    }

    let totalAccuracy = 0;
    let totalAverage = 0;
    let totalRank = 0;
    let accuracyCount = 0;
    let averageCount = 0;
    let rankCount = 0;
    let totalMarks = 0;
    let totalScore = 0;

    attempts.forEach((attempt) => {
      if (!isNaN(attempt.yourAccuracy)) {
        totalAccuracy += attempt.yourAccuracy;
        accuracyCount++;
      }
      if (!isNaN(attempt.average)) {
        totalAverage += attempt.average;
        averageCount++;
      }
      if (!isNaN(attempt.rank)) {
        totalRank += attempt.rank;
        rankCount++;
      }
      if (!isNaN(attempt.totalMarks)) totalMarks += attempt.totalMarks;
      if (!isNaN(attempt.score)) totalScore += attempt.score;
    });

    const avgAccuracy = accuracyCount > 0 ? totalAccuracy / accuracyCount : 0;
    const avgScore = averageCount > 0 ? totalAverage / averageCount : 0;
    const avgRank = rankCount > 0 ? (totalRank / rankCount).toFixed(0) : '-';

    res.json({
      attempts,
      summary: {
        avgAccuracy: Number(avgAccuracy.toFixed(2)),
        avgScore: Number(avgScore.toFixed(2)),
        avgRank,
        totalCombinedMarks: totalMarks,
        totalCombinedScore: totalScore
      }
    });

  } catch (err) {
    console.error('Dashboard fetch error:', err);
    res.status(500).json({ error: 'Failed to load dashboard data' });
  }
});



// ✅ IN-PROGRESS RESUME ENDPOINT
router.get('/userTestData/in-progress/:userId/:testId', async (req, res) => {
  try {
    const { userId, testId } = req.params;

    const inProgress = await StudentTestData.findOne({
      userId,
      testId,
      status: 'in-progress',
    }).sort({ createdAt: -1 });

    if (!inProgress) {
      console.warn("🕳 No in-progress attempt found for", userId, testId);
      return res.status(404).json({ message: 'No in-progress attempt found.' });
    }

    console.log("📥 Resume in-progress attempt:", inProgress._id);

    res.json({
      attempt: {
        _id: inProgress._id,
        status: inProgress.status,
        answers: inProgress.answers || {},
        markedForReviewMap: inProgress.markedForReviewMap || {},
        questionStatusMap: inProgress.questionStatusMap || {},
        timeLeft: inProgress.timeLeft || null,
        attemptNumber: inProgress.attemptNumber || 1
      }
    });

  } catch (error) {
    console.error('❌ Error fetching in-progress attempt:', error);
    res.status(500).json({ error: 'Failed to fetch in-progress attempt' });
  }
});


// 🗑️ Clear all attempts for a user and testId
router.delete('/userTestData/clear-attempts', async (req, res) => {
  try {
    const { userId, testId } = req.body;
    if (!userId || !testId) {
      return res.status(400).json({ error: "userId and testId are required" });
    }

    const deleted = await StudentTestData.deleteMany({ userId, testId });
    console.log(`🧹 Cleared ${deleted.deletedCount} attempts for user ${userId} on test ${testId}`);
    res.status(200).json({ message: 'Attempts cleared successfully' });
  } catch (err) {
    console.error("❌ Error clearing attempts:", err);
    res.status(500).json({ error: "Failed to clear attempts" });
  }
});




// ✅ SEARCH RESULTS BY NAME
router.get("/name/search", async (req, res) => {
    try {
      const name = req.query.name;
      if (!name) return res.status(400).json({ error: "Name is required" });
  
  
      // ✅ New: Directly search in StudentTestData by studentName
      const results = await StudentTestData.find({
        studentName: { $regex: new RegExp(name, "i") }, 
      });
  
      res.json(results);
    } catch (err) {
      console.error("Search error:", err);
      res.status(500).json({ error: "Server error" });
    }
  });
  

module.exports = router;
