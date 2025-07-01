const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const StudentTestData = require('../models/StudentTestData');
const MockTest = require('../models/MockTest');
const User = require('../models/User');
const { verifyToken, verifyRole } = require('../middleware/auth');


router.get('/results/:id', verifyToken, async (req, res) => {
  try {
    const result = await StudentTestData.findById(req.params.id);
    if (!result) return res.status(404).json({ error: 'Result not found' });

    const test = await MockTest.findById(result.testId);
    const allResults = await StudentTestData.find({
      testId: result.testId,
      instituteId: result.instituteId
    });

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

    // ✅ New: Subtag Report
    const subtagMap = {};
    for (const ans of result.detailedAnswers) {
      const subtag = ans.subtag || "";
      if (!subtag) continue;
      if (!subtagMap[subtag]) subtagMap[subtag] = { subtag, total: 0, correct: 0 };
      subtagMap[subtag].total += 1;
      if (ans.isCorrect) subtagMap[subtag].correct += 1;
    }
    const subtagReport = Object.values(subtagMap);

    // ✅ New: Approach Report
    const approachMap = {};
    for (const ans of result.detailedAnswers) {
      const approach = ans.approach || "";
      if (!approach) continue;
      if (!approachMap[approach]) approachMap[approach] = { approach, total: 0, correct: 0 };
      approachMap[approach].total += 1;
      if (ans.isCorrect) approachMap[approach].correct += 1;
    }
    const approachReport = Object.values(approachMap);

    // ✅ New: Performance Domain Report
    const domainMap = {};
    for (const ans of result.detailedAnswers) {
      const domain = ans.performanceDomain || "";
      if (!domain) continue;
      if (!domainMap[domain]) domainMap[domain] = { performanceDomain: domain, total: 0, correct: 0 };
      domainMap[domain].total += 1;
      if (ans.isCorrect) domainMap[domain].correct += 1;
    }
    const performanceDomainReport = Object.values(domainMap);

    const enrichedQuestions = (test?.questions || []).map((q) => {
      const qId = q._id?.toString() || q.questionNumber?.toString();
      const attempt = result.answers?.[qId];

      return {
        ...q.toObject?.() || q,
        selectedAnswer: attempt?.selectedOption ?? null,
        correctAnswer: q.correctAnswer || q.answer || null,
        isCorrect: attempt?.isCorrect ?? false,
        explanation: q.explanation || null,
        options: q.options || [],
        definitions: q.questionType === 'Drag and Drop' ? q.definitions || [] : undefined,
        terms: q.questionType === 'Drag and Drop' ? q.terms || [] : undefined,
        answer: q.questionType === 'Drag and Drop' ? q.answer || [] : undefined,
        subtag: q.subtag || "",
        approach: q.approach || "",
        performanceDomain: q.performanceDomain || "",
      };
    });

    const yourAccuracy = totalQuestions > 0 ? ((correct / totalQuestions) * 100).toFixed(2) : "0.00";

    const totalTimeSpent = Object.entries(result.questionTimeSpent || {})
      .filter(([key]) => !["timeLeft", "currentQuestionIndex"].includes(key))
      .reduce((sum, [, seconds]) => sum + seconds, 0);

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
      subtagReport,
      approachReport,
      performanceDomainReport
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
      subtagReport,
      approachReport,
      performanceDomainReport,
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
    res.status(500).json({ error: 'Something went wrong.' });
  }
});


router.post('/userTestData/auto-save', verifyToken, async (req, res) => {
  try {
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
      questionTimeSpent,
      visitedQuestions
    } = req.body;

    if (!attemptId) {
      return res.status(400).json({ error: 'Missing attemptId' });
    }

    const attempt = await StudentTestData.findById(attemptId);
    if (!attempt) {
      return res.status(404).json({ error: 'Attempt not found' });
    }

    if (attempt.status === 'completed') {
      console.warn("⚠️ Attempt already submitted, blocking auto-save for attemptId:", attemptId);
      return res.status(400).json({ error: 'Attempt already submitted', status: 'completed' });
    }

    if (visitedQuestions && typeof visitedQuestions === 'object') {
      attempt.visitedQuestions = visitedQuestions;
    }

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
        subtag: originalQ?.subtag || "",
        approach: originalQ?.approach || "",
        performanceDomain: originalQ?.performanceDomain || "",
      });
    }

    const incorrect = attempted - correct;
    const skipped = totalQuestions - attempted;
    const calcAccuracy = totalQuestions > 0 ? ((correct / totalQuestions) * 100).toFixed(2) : "0.00";

    const topicMap = {};
    for (const ans of detailedAnswers) {
      for (const tag of ans.tags || []) {
        if (!topicMap[tag]) topicMap[tag] = { tag, total: 0, correct: 0 };
        topicMap[tag].total += 1;
        if (ans.isCorrect) topicMap[tag].correct += 1;
      }
    }
    const topicReport = Object.values(topicMap);

    const subtagMap = {};
    for (const ans of detailedAnswers) {
      const subtag = ans.subtag || "";
      if (!subtag) continue;
      if (!subtagMap[subtag]) subtagMap[subtag] = { subtag, total: 0, correct: 0 };
      subtagMap[subtag].total += 1;
      if (ans.isCorrect) subtagMap[subtag].correct += 1;
    }
    const subtagReport = Object.values(subtagMap);

    const approachMap = {};
    for (const ans of detailedAnswers) {
      const approach = ans.approach || "";
      if (!approach) continue;
      if (!approachMap[approach]) approachMap[approach] = { approach, total: 0, correct: 0 };
      approachMap[approach].total += 1;
      if (ans.isCorrect) approachMap[approach].correct += 1;
    }
    const approachReport = Object.values(approachMap);

    const domainMap = {};
    for (const ans of detailedAnswers) {
      const domain = ans.performanceDomain || "";
      if (!domain) continue;
      if (!domainMap[domain]) domainMap[domain] = { performanceDomain: domain, total: 0, correct: 0 };
      domainMap[domain].total += 1;
      if (ans.isCorrect) domainMap[domain].correct += 1;
    }
    const performanceDomainReport = Object.values(domainMap);

    const difficultyStats = { Easy: 0, Medium: 0, Intense: 0 };
    const difficultyScore = { Easy: 0, Medium: 0, Intense: 0 };
    for (const ans of detailedAnswers) {
      const level = ans.difficulty || 'Medium';
      const qid = ans.questionId?.toString();
      const marks = questionMap.get(qid)?.marks || 1;
      difficultyStats[level] += 1;
      if (ans.isCorrect) difficultyScore[level] += marks;
    }

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
    attempt.subtagReport = subtagReport;
    attempt.approachReport = approachReport;
    attempt.performanceDomainReport = performanceDomainReport;
    attempt.difficultyStats = difficultyStats;
    attempt.difficultyScore = difficultyScore;
    attempt.timeLeft = typeof timeLeft === 'number' ? timeLeft : attempt.timeLeft;
    attempt.currentQuestionIndex = typeof currentQuestionIndex === 'number' ? currentQuestionIndex : 0;
    attempt.totalMarks = typeof totalMarks === 'number'
      ? totalMarks
      : [...questionMap.values()]
        .filter(q => q.questionType && q.question?.trim())
        .reduce((sum, q) => sum + (q.marks || 1), 0);

    if (attempt.status !== 'completed') {
      attempt.status = status || 'in-progress';
      attempt.completedAt = completedAt ?? null;
    }

    attempt.updatedAt = new Date();

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
    res.status(500).json({ error: "Auto-save failed." });
  }
});




// router.post('/userTestData/submit-test',verifyToken, async (req, res) => {
//   try {
//     const {
//       userId,
//       testId,
//       answers,
//       markedForReviewMap,
//       questionStatusMap,
//       detailedAnswers,
//       questionTimeSpent
//     } = req.body;

//     console.log("📥 [Submit-Test] Incoming payload keys:", Object.keys(req.body));
//     console.log("🕒 [Submit-Test] Incoming questionTimeSpent:", questionTimeSpent);

//     if (!Array.isArray(detailedAnswers)) {
//       return res.status(400).json({ error: 'Invalid detailedAnswers' });
//     }

//     const attempt = await StudentTestData.findOne({ userId, testId, status: 'in-progress' }).sort({ createdAt: -1 });
//     if (!attempt) return res.status(404).json({ error: 'No in-progress attempt found' });

//     const test = await MockTest.findById(testId);
//     const user = await User.findById(userId).select("name instituteId createdBy");


//     const questionMap = {};
//     for (const q of test?.questions || []) {
//       const qid = (q._id || q.questionNumber)?.toString();
//       questionMap[qid] = q;
//     }

//     let score = 0;
//     let correct = 0;
//     let incorrect = 0;
//     let attempted = 0;

//     const processedIds = new Set();
//     for (const ans of detailedAnswers) {
//       const qid = ans.questionId?.toString();
//       const q = questionMap[qid];
//       if (!qid || !q) continue;

//       processedIds.add(qid);

//       const isAttempted = ans.selectedAnswer !== null && ans.selectedAnswer !== undefined;
//       if (isAttempted) {
//         attempted++;
//         if (ans.isCorrect) {
//           correct++;
//           score += q?.marks || 1;
//         } else {
//           incorrect++;
//         }
//       }
//     }

//     // ✅ Add missing skipped entries
//     for (const qid of Object.keys(questionMap)) {
//       if (!processedIds.has(qid)) {
//         const q = questionMap[qid];
//         detailedAnswers.push({
//           questionId: qid,
//           selectedAnswer: null,
//           correctAnswer: q.correctAnswer || null,
//           isCorrect: false,
//           explanation: q.explanation || '',
//           tags: q.tags || [],
//           difficulty: q.difficulty || 'Medium',
//           timeAllocated: q.timeAllocated || 0,
//           markedForReview: markedForReviewMap?.[qid] || false,
//           questionStatus: 'NOT ANSWERED',
//           subtag: q.subtag || "",
//   approach: q.approach || "",
//   performanceDomain: q.performanceDomain || "",
//         });
//       }
//     }

//     const totalQuestions = Object.keys(questionMap).length;
//     const skipped = totalQuestions - attempted;
//     const yourAccuracy = totalQuestions > 0 ? ((correct / totalQuestions) * 100).toFixed(2) : "0.00";

//     const allResults = await StudentTestData.find({ testId, instituteId: attempt.instituteId });

//     const sorted = allResults.sort((a, b) => (b.score || 0) - (a.score || 0));
//     const rank = sorted.findIndex(r => r._id.toString() === attempt._id.toString()) + 1;

//     const topicMap = {};
//     for (const ans of detailedAnswers) {
//       for (const tag of ans.tags || []) {
//         if (!topicMap[tag]) topicMap[tag] = { tag, total: 0, correct: 0 };
//         topicMap[tag].total += 1;
//         if (ans.isCorrect) topicMap[tag].correct += 1;
//       }
//     }
//     const topicReport = Object.values(topicMap);

//     // Subtag report
// const subtagMap = {};
// for (const ans of detailedAnswers) {
//   const subtag = ans.subtag || "";
//   if (!subtag) continue;
//   if (!subtagMap[subtag]) subtagMap[subtag] = { subtag, total: 0, correct: 0 };
//   subtagMap[subtag].total += 1;
//   if (ans.isCorrect) subtagMap[subtag].correct += 1;
// }
// const subtagReport = Object.values(subtagMap);

// // Approach report
// const approachMap = {};
// for (const ans of detailedAnswers) {
//   const approach = ans.approach || "";
//   if (!approach) continue;
//   if (!approachMap[approach]) approachMap[approach] = { approach, total: 0, correct: 0 };
//   approachMap[approach].total += 1;
//   if (ans.isCorrect) approachMap[approach].correct += 1;
// }
// const approachReport = Object.values(approachMap);

// // Performance Domain report
// const domainMap = {};
// for (const ans of detailedAnswers) {
//   const domain = ans.performanceDomain || "";
//   if (!domain) continue;
//   if (!domainMap[domain]) domainMap[domain] = { performanceDomain: domain, total: 0, correct: 0 };
//   domainMap[domain].total += 1;
//   if (ans.isCorrect) domainMap[domain].correct += 1;
// }
// const performanceDomainReport = Object.values(domainMap);


//     const difficultyStats = { Easy: 0, Medium: 0, Intense: 0 };
//     const difficultyScore = { Easy: 0, Medium: 0, Intense: 0 };
//     for (const ans of detailedAnswers) {
//       const level = ans.difficulty || 'Medium';
//       const qid = ans.questionId?.toString();
//       const marks = questionMap[qid]?.marks || 1;
//       difficultyStats[level] += 1;
//       if (ans.isCorrect) difficultyScore[level] += marks;
//     }

//     if (questionTimeSpent && typeof questionTimeSpent === 'object') {
//       if (!attempt.questionTimeSpent) attempt.questionTimeSpent = {};
//       Object.entries(questionTimeSpent).forEach(([qid, time]) => {
//         if (!attempt.questionTimeSpent[qid]) {
//           attempt.questionTimeSpent[qid] = 0;
//         }
//         attempt.questionTimeSpent[qid] += time;
//       });
//     }

//     const mergedTimeSpent = questionTimeSpent || attempt.questionTimeSpent || {};
//     console.log("✅ [Submit-Test] Final merged questionTimeSpent:", mergedTimeSpent);

//     const updatePayload = {
//       answers,
//       markedForReviewMap,
//       questionStatusMap,
//       detailedAnswers,
//       score,
//       status: 'completed',
//       completedAt: new Date(),
//       testTitle: test?.title || 'Mock Test',
//       studentName: user?.name || "Unknown",
//       totalMarks: test?.questions
//         ?.filter(q => q.questionType && q.question?.trim())
//         .reduce((sum, q) => sum + (q.marks || 1), 0),
//       correct,
//       incorrect,
//       skipped,
//       rank,
//       topper: sorted[0]?.score || 0,
//       average: sorted.length > 0
//         ? (sorted.reduce((acc, r) => acc + (r.score || 0), 0) / sorted.length).toFixed(2)
//         : "0.00",
//       yourAccuracy,
//       topicReport,
//       difficultyStats,
//       difficultyScore,
//       questionTimeSpent: mergedTimeSpent,
//       subtagReport,
//       approachReport,
//       performanceDomainReport,

//     };
// console.log("🚀 Answer subtag map:", questionId, originalQ?.subtag);
//     console.log("📤 [Submit-Test] Saving updatePayload for attempt:", attempt._id);
//     await StudentTestData.findByIdAndUpdate(attempt._id, updatePayload, { new: true });

//     console.log("✅ [Submit-Test] Submission complete for attempt:", attempt._id);
//     res.status(200).json({ resultId: attempt._id });

//   } catch (err) {
//     console.error("❌ Submission error:", err);
//     res.status(500).json({ error: "Submission failed" });
//   }
// });



router.post('/userTestData/submit-test', verifyToken, async (req, res) => {
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
    if (!attempt) return res.status(404).json({ error: 'No in-progress attempt found' });

    const test = await MockTest.findById(testId);
    const user = await User.findById(userId).select("name instituteId createdBy");

    // ✅ Enhanced questionMap
    const questionMap = new Map();
    for (const q of test?.questions || []) {
      const idStr = q._id?.toString();
      const numStr = q.questionNumber?.toString();
      if (idStr) questionMap.set(idStr, q);
      if (numStr) questionMap.set(numStr, q);
    }

    let score = 0;
    let correct = 0;
    let incorrect = 0;
    let attempted = 0;

    const processedIds = new Set();
    for (const ans of detailedAnswers) {
      const qid = ans.questionId?.toString();
      const q = questionMap.get(qid);
      if (!qid || !q) {
        console.warn(`⚠️ Question not found for ID: ${qid}`);
        continue;
      }

      processedIds.add(qid);

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

    // ✅ Add missing skipped entries
    for (const [qid, q] of questionMap.entries()) {
      if (processedIds.has(qid)) continue;

      const validQid = q._id?.toString(); // ✅ force valid ObjectId string

      detailedAnswers.push({
        questionId: validQid,
        selectedAnswer: null,
        correctAnswer: q.correctAnswer || null,
        isCorrect: false,
        explanation: q.explanation || '',
        tags: q.tags || [],
        difficulty: q.difficulty || 'Medium',
        timeAllocated: q.timeAllocated || 0,
        markedForReview: markedForReviewMap?.[qid] || false,
        questionStatus: 'NOT ANSWERED',
        subtag: q.subtag || "",
        approach: q.approach || "",
        performanceDomain: q.performanceDomain || "",
      });
    }

    const totalQuestions = Object.keys(test?.questions || {}).length;
    const skipped = totalQuestions - attempted;
    const yourAccuracy = totalQuestions > 0 ? ((correct / totalQuestions) * 100).toFixed(2) : "0.00";

    const allResults = await StudentTestData.find({ testId, instituteId: attempt.instituteId });
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

    // ✅ Subtag report
    const subtagMap = {};
    for (const ans of detailedAnswers) {
      const subtag = ans.subtag || "";
      if (!subtag) continue;
      if (!subtagMap[subtag]) subtagMap[subtag] = { subtag, total: 0, correct: 0 };
      subtagMap[subtag].total += 1;
      if (ans.isCorrect) subtagMap[subtag].correct += 1;
    }
    const subtagReport = Object.values(subtagMap);

    // ✅ Approach report
    const approachMap = {};
    for (const ans of detailedAnswers) {
      const approach = ans.approach || "";
      if (!approach) continue;
      if (!approachMap[approach]) approachMap[approach] = { approach, total: 0, correct: 0 };
      approachMap[approach].total += 1;
      if (ans.isCorrect) approachMap[approach].correct += 1;
    }
    const approachReport = Object.values(approachMap);

    // ✅ Performance Domain report
    const domainMap = {};
    for (const ans of detailedAnswers) {
      const domain = ans.performanceDomain || "";
      if (!domain) continue;
      if (!domainMap[domain]) domainMap[domain] = { performanceDomain: domain, total: 0, correct: 0 };
      domainMap[domain].total += 1;
      if (ans.isCorrect) domainMap[domain].correct += 1;
    }
    const performanceDomainReport = Object.values(domainMap);

    const difficultyStats = { Easy: 0, Medium: 0, Intense: 0 };
    const difficultyScore = { Easy: 0, Medium: 0, Intense: 0 };
    
    for (const ans of detailedAnswers) {
      const level = ans.difficulty || 'Medium';
      const qid = ans.questionId?.toString();
      const marks = questionMap.get(qid)?.marks || 1;
      difficultyStats[level] += 1;
      if (ans.isCorrect) difficultyScore[level] += marks;
    }

    if (questionTimeSpent && typeof questionTimeSpent === 'object') {
      if (!attempt.questionTimeSpent) attempt.questionTimeSpent = {};
      Object.entries(questionTimeSpent).forEach(([qid, time]) => {
        if (!attempt.questionTimeSpent[qid]) {
          attempt.questionTimeSpent[qid] = 0;
        }
        attempt.questionTimeSpent[qid] += time;
      });
    }

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
      questionTimeSpent: mergedTimeSpent,
      subtagReport,
      approachReport,
      performanceDomainReport,
    };

    await StudentTestData.findByIdAndUpdate(attempt._id, updatePayload, { new: true });

    console.log("✅ [Submit-Test] Submission complete for attempt:", attempt._id);
    res.status(200).json({ resultId: attempt._id });

  } catch (err) {
    console.error("❌ Submission error:", err);
    res.status(500).json({ error: "Submission failed" });
  }
});





// 🔁 Start attempt (called only if no in-progress exists)
router.post('/userTestData/start-attempt',verifyToken, async (req, res) => {
  const { userId, testId } = req.body;
  try {
    const count = await StudentTestData.countDocuments({ userId, testId, instituteId: req.user?.instituteId  });
    if (count >= 5) return res.status(403).json({ error: "Max 5 attempts allowed" });

   const test = await MockTest.findById(testId).lean(); // ✅ lean() improves read performance
const user = await User.findById(userId).select("name instituteId createdBy").lean(); // ✅ select only needed fields


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
      createdBy: user?.createdBy || null,
      instituteId: user?.instituteId || null,
      // ✅ Optional consistency fields
      subtagReport: [],
      approachReport: [],
      performanceDomainReport: [],
      totalMarks: test?.questions?.reduce((sum, q) => sum + (q.marks || 1), 0) || 0

    });

    const saved = await newAttempt.save();
    res.status(200).json({ attempt: saved });
  } catch (err) {
    console.error("❌ Error starting attempt:", err);
    res.status(500).json({ error: "Start failed" });
  }
});

// 🔁 Resume if in-progress
router.get('/userTestData/latest-attempt',verifyToken, async (req, res) => {
  const { userId, testId } = req.query;
  try {
    const latest = await StudentTestData.findOne({ userId, testId, status: 'in-progress' }).sort({ createdAt: -1 }).lean();
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
        currentQuestionIndex: latest.currentQuestionIndex || 0,
        visitedQuestions: latest.visitedQuestions || {}, // ✅ ADD THIS LINE
         questionTimeSpent: latest.questionTimeSpent || {},           // ⬅️ Optional
        testTitle: latest.testTitle || '',                           // ⬅️ Optional
        totalMarks: latest.totalMarks || 0,                          // ⬅️ Optional
        detailedAnswers: latest.detailedAnswers || [],
          }
    });
  } catch (err) {
    console.error("❌ Resume error:", err);
    res.status(500).json({ error: "Resume failed" });
  }
});



// dashboard ui
// router.get('/user/dashboard/:userId', verifyToken, async (req, res) => {
//   const { userId } = req.params;

//   try {
//     const attempts = await StudentTestData.find({
//       userId,
//       instituteId: req.user.instituteId
//     })
//       .sort({ createdAt: -1 })
//       .select(
//         'testTitle attemptNumber completedAt createdAt status score totalMarks correct incorrect skipped rank topper average yourAccuracy topperAccuracy averageAccuracy detailedAnswers subtagReport approachReport performanceDomainReport'
//       );

//     if (!Array.isArray(attempts) || attempts.length === 0) {
//       return res.json({ attempts: [] });
//     }

//     const processedAttempts = attempts.map((attempt) => {
//       const tagMap = {};

//       (attempt.detailedAnswers || []).forEach((ans) => {
//         const tags = Array.isArray(ans.tags)
//           ? ans.tags
//           : (typeof ans.tags === 'string'
//               ? ans.tags.split(',').map(t => t.trim())
//               : []);

//         if (tags.length < 1) return;

//         const mainTag = tags[0];
//         const subtag = (ans.subtag && ans.subtag.trim() !== "") 
//   ? ans.subtag 
//   : 'Unknown';


//         const approach = ans.approach || 'Unknown';
//         const domain = ans.performanceDomain || 'Unknown';
//         const diff = ans.difficulty || 'Unknown';

//         if (!tagMap[mainTag]) {
//           tagMap[mainTag] = {
//             tag: mainTag,
//             correct: 0,
//             total: 0,
//             subtopics: {}
//           };
//         }

//         tagMap[mainTag].total += 1;
//         if (ans.isCorrect) tagMap[mainTag].correct += 1;

//         if (!tagMap[mainTag].subtopics[subtag]) tagMap[mainTag].subtopics[subtag] = {};
//         if (!tagMap[mainTag].subtopics[subtag][approach]) tagMap[mainTag].subtopics[subtag][approach] = {};
//         if (!tagMap[mainTag].subtopics[subtag][approach][domain]) tagMap[mainTag].subtopics[subtag][approach][domain] = {};
//         if (!tagMap[mainTag].subtopics[subtag][approach][domain][diff]) {
//           tagMap[mainTag].subtopics[subtag][approach][domain][diff] = { correct: 0, total: 0 };
//         }

//         tagMap[mainTag].subtopics[subtag][approach][domain][diff].total += 1;
//         if (ans.isCorrect) {
//           tagMap[mainTag].subtopics[subtag][approach][domain][diff].correct += 1;
//         }
//       });

//       const topicReport = Object.values(tagMap).map(tagObj => {
//         const subtopics = [];

//         Object.entries(tagObj.subtopics).forEach(([subtag, approaches]) => {
//           Object.entries(approaches).forEach(([approach, domains]) => {
//             Object.entries(domains).forEach(([domain, diffs]) => {
//               Object.entries(diffs).forEach(([diff, stats]) => {
//                 subtopics.push({
//                   subtag,
//                   approach,
//                   performanceDomain: domain,
//                   difficulty: diff,
//                   correct: stats.correct,
//                   total: stats.total
//                 });
//               });
//             });
//           });
//         });

//         return {
//           tag: tagObj.tag,
//           correct: tagObj.correct,
//           total: tagObj.total,
//           subtopics
//         };
//       });

//       return {
//         examName: attempt.testTitle,
//         topicReport
//       };
//     });

//     // Merge raw + processed
//     const finalAttempts = attempts.map((raw, i) => ({
//       ...raw.toObject(),
//       ...processedAttempts[i]
//     }));

//     res.json({ attempts: finalAttempts });

//   } catch (err) {
//     console.error('Dashboard fetch error:', err);
//     res.status(500).json({ error: 'Failed to load dashboard data' });
//   }
// });


router.get('/user/dashboard/:userId', verifyToken, async (req, res) => {
  const { userId } = req.params;

  try {
    const attempts = await StudentTestData.find({
      userId,
      instituteId: req.user.instituteId
    })
      .sort({ createdAt: -1 })
      .select(
        'testTitle attemptNumber completedAt createdAt status score totalMarks correct incorrect skipped rank topper average yourAccuracy topperAccuracy averageAccuracy detailedAnswers subtagReport approachReport performanceDomainReport'
      );

    if (!Array.isArray(attempts) || attempts.length === 0) {
      return res.json({ attempts: [] });
    }

    const processedAttempts = attempts.map((attempt) => {
      const tagMap = {};

      (attempt.detailedAnswers || []).forEach((ans) => {
        const tags = Array.isArray(ans.tags)
          ? ans.tags
          : (typeof ans.tags === 'string'
              ? ans.tags.split(',').map(t => t.trim())
              : []);

        // Ensure mainTag is defined or default to 'Unknown'
        const mainTag = (tags && tags.length > 0 && tags[0].trim() !== '')
          ? tags[0]
          : 'Unknown';

        // Ensure all metadata fields are at least 'Unknown'
        const subtag = (ans.subtag && ans.subtag.trim() !== "")
  ? ans.subtag
  : null;

if (!subtag) return; // Skip this answer if subtag is empty

        const approach = (ans.approach && ans.approach.trim() !== "")
          ? ans.approach
          : 'Unknown';
        const domain = (ans.performanceDomain && ans.performanceDomain.trim() !== "")
          ? ans.performanceDomain
          : 'Unknown';
        const diff = (ans.difficulty && ans.difficulty.trim() !== "")
          ? ans.difficulty
          : 'Unknown';

        // ✅ Skip fully unknown entries: all metadata is 'Unknown'
        if (
          mainTag === 'Unknown' &&
          subtag === 'Unknown' &&
          approach === 'Unknown' &&
          domain === 'Unknown' &&
          diff === 'Unknown'
        ) {
          return;
        }

        if (!tagMap[mainTag]) {
          tagMap[mainTag] = {
            tag: mainTag,
            correct: 0,
            total: 0,
            subtopics: {}
          };
        }

        tagMap[mainTag].total += 1;
        if (ans.isCorrect) tagMap[mainTag].correct += 1;

        if (!tagMap[mainTag].subtopics[subtag]) {
          tagMap[mainTag].subtopics[subtag] = {};
        }
        if (!tagMap[mainTag].subtopics[subtag][approach]) {
          tagMap[mainTag].subtopics[subtag][approach] = {};
        }
        if (!tagMap[mainTag].subtopics[subtag][approach][domain]) {
          tagMap[mainTag].subtopics[subtag][approach][domain] = {};
        }
        if (!tagMap[mainTag].subtopics[subtag][approach][domain][diff]) {
          tagMap[mainTag].subtopics[subtag][approach][domain][diff] = { correct: 0, total: 0 };
        }

        tagMap[mainTag].subtopics[subtag][approach][domain][diff].total += 1;
        if (ans.isCorrect) {
          tagMap[mainTag].subtopics[subtag][approach][domain][diff].correct += 1;
        }
      });

      const topicReport = Object.values(tagMap).map(tagObj => {
        const subtopics = [];

        Object.entries(tagObj.subtopics).forEach(([subtag, approaches]) => {
          Object.entries(approaches).forEach(([approach, domains]) => {
            Object.entries(domains).forEach(([domain, diffs]) => {
              Object.entries(diffs).forEach(([diff, stats]) => {
                subtopics.push({
                  subtag,
                  approach,
                  performanceDomain: domain,
                  difficulty: diff,
                  correct: stats.correct,
                  total: stats.total
                });
              });
            });
          });
        });

        return {
          tag: tagObj.tag,
          correct: tagObj.correct,
          total: tagObj.total,
          subtopics
        };
      });

      return {
        examName: attempt.testTitle,
        topicReport
      };
    });

    const finalAttempts = attempts.map((raw, i) => ({
      ...raw.toObject(),
      ...processedAttempts[i]
    }));

    res.json({ attempts: finalAttempts });

  } catch (err) {
    console.error('Dashboard fetch error:', err);
    res.status(500).json({ error: 'Failed to load dashboard data' });
  }
});






// ✅ IN-PROGRESS RESUME ENDPOINT
router.get('/userTestData/in-progress/:userId/:testId', verifyToken, async (req, res) => {
  try {
    const { userId, testId } = req.params;

    const inProgress = await StudentTestData.findOne({
      userId,
      testId,
      status: 'in-progress',
      instituteId: req.user.instituteId
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
        attemptNumber: inProgress.attemptNumber || 1,
        currentQuestionIndex: inProgress.currentQuestionIndex || 0, // ✅ Resume to same question
        visitedQuestions: inProgress.visitedQuestions || {} // ✅ Retain visited status
      }
    });

  } catch (error) {
    console.error('❌ Error fetching in-progress attempt:', error);
    res.status(500).json({ error: 'Failed to fetch in-progress attempt' });
  }
});


// 🗑️ Clear all attempts for a user and testId
router.delete('/userTestData/clear-attempts',verifyToken, async (req, res) => {
  try {
    const { userId, testId } = req.body;
    if (!userId || !testId) {
      return res.status(400).json({ error: "userId and testId are required" });
    }

    const deleted = await StudentTestData.deleteMany({ userId, testId, instituteId: req.user.instituteId });
    console.log(`🧹 Cleared ${deleted.deletedCount} attempts for user ${userId} on test ${testId}`);
    res.status(200).json({ message: 'Attempts cleared successfully' });
  } catch (err) {
    console.error("❌ Error clearing attempts:", err);
    res.status(500).json({ error: "Failed to clear attempts" });
  }
});




// ✅ SEARCH RESULTS BY NAME
// router.get("/name/search",verifyToken, async (req, res) => {
//     try {
//       const name = req.query.name;
//       if (!name) return res.status(400).json({ error: "Name is required" });
  
  
//       // ✅ New: Directly search in StudentTestData by studentName
//       const results = await StudentTestData.find({
//   studentName: { $regex: new RegExp(name, "i") },
//   createdBy: req.user?.id, // ✅ Filter to current admin's data
//   instituteId: req.user?.instituteId 
// });

  
//       res.json(results);
//     } catch (err) {
//       console.error("Search error:", err);
//       res.status(500).json({ error: "Server error" });
//     }
//   });
  

router.get("/name/search", verifyToken, async (req, res) => {
  try {
    const name = req.query.name;
    if (!name) return res.status(400).json({ error: "Name is required" });

    const results = await StudentTestData.find({
      studentName: { $regex: new RegExp(name, "i") },
      instituteId: req.user?.instituteId
    }).sort({ createdAt: -1 });

    // Process results (your existing topic map logic)
    const processed = results.map(attempt => {
      const topicMap = {};
      (attempt.detailedAnswers || []).forEach(ans => {
        (ans.tags || []).forEach(tag => {
          if (!topicMap[tag]) {
            topicMap[tag] = { tag, correct: 0, total: 0, subtopics: [] };
          }
          topicMap[tag].total++;
          if (ans.isCorrect) topicMap[tag].correct++;

          let sub = topicMap[tag].subtopics.find(s =>
            s.subtag === ans.subtag &&
            s.approach === ans.approach &&
            s.performanceDomain === ans.performanceDomain &&
            s.difficulty === ans.difficulty
          );

          if (!sub) {
            sub = {
              subtag: ans.subtag || "Unknown",
              approach: ans.approach || "Unknown",
              performanceDomain: ans.performanceDomain || "Unknown",
              difficulty: ans.difficulty || "Unknown",
              correct: 0,
              total: 0
            };
            topicMap[tag].subtopics.push(sub);
          }

          sub.total++;
          if (ans.isCorrect) sub.correct++;
        });
      });

      return {
        testTitle: attempt.testTitle,
        completedAt: attempt.completedAt,
        score: attempt.score || 0,
        yourAccuracy: attempt.yourAccuracy || "0.00",
        topicReport: Object.values(topicMap)
      };
    });

    res.json(processed);

  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: "Server error" });
  }
});


router.get("/students-with-attempts", verifyToken, async (req, res) => {
  try {
    const results = await StudentTestData.aggregate([
      { $match: { instituteId: req.user.instituteId } },
      {
        $group: {
          _id: "$userId",
          studentName: { $first: "$studentName" },
          totalAttempts: { $sum: 1 },
          lastAttemptDate: { $max: "$completedAt" },
          avgScore: { $avg: "$score" },
          avgAccuracy: { $avg: { $toDouble: "$yourAccuracy" } }
        }
      },
      { $sort: { studentName: 1 } }
    ]);
    res.json(results);
  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).json({ error: "Failed to fetch student list" });
  }
});



// ✅ NEW ROUTE: Get students of teacher's institute with summary stats
router.get("/students/institute", verifyToken, async (req, res) => {
  try {
    const students = await StudentTestData.aggregate([
      { $match: { instituteId: req.user.instituteId } },
      {
        $group: {
          _id: "$userId",
          studentName: { $first: "$studentName" },
          totalAttempts: { $sum: 1 },
          avgScore: { $avg: "$score" },
          avgAccuracy: { $avg: { $toDouble: "$yourAccuracy" } },
          lastAttemptDate: { $max: "$completedAt" }
        }
      },
      { $sort: { studentName: 1 } }
    ]);

    if (!students || students.length === 0) {
      return res.status(404).json({ error: "No students found in your institute." });
    }

    res.json({ students });
  } catch (err) {
    console.error("❌ Error fetching students in institute:", err);
    res.status(500).json({ error: "Server error fetching students." });
  }
});

router.get("/teacher/student-report", verifyToken, verifyRole(["Teacher"]), async (req, res) => {
  const { name } = req.query;
  if (!name) return res.status(400).json({ error: "Name is required" });

  try {
    const attempts = await StudentTestData.find({
      studentName: { $regex: new RegExp(name, "i") },
      instituteId: req.user.instituteId
    });

    if (!attempts.length) {
      return res.status(404).json({ error: "No reports found for this student" });
    }

    res.json({ attempts });
  } catch (err) {
    console.error("Error fetching student report:", err);
    res.status(500).json({ error: "Server error" });
  }
});



module.exports = router;
