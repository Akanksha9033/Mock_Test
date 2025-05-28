import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import axios from "axios";
import ExamContentLayout from "./ExamContentLayout";
import FullReportPage from "./FullReportPage";

// const REACT_APP_API_URL = "https://mocktest-ljru.onrender.com";
const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

const ExamContent = ({
  test,
  setTest,
  testId,
  user,
  currentQuestionIndex,
  setCurrentQuestionIndex,
  answers,
  setAnswers,
  markedForReview,
  setMarkedForReview,
  questionStatus,
  setQuestionStatus,
  timeLeft,
  setTimeLeft,
  score,
  setScore,
  showModal,
  setShowModal,
  viewingSolutions,
  setViewingSolutions,
  editedQuestions,
  setEditedQuestions,
  editingQuestionId,
  setEditingQuestionId,
  visitedQuestions,
  setVisitedQuestions,
  isPaused,
  setIsPaused,
  pauseKey,
  timeKey,
}) => {
  const navigate = useNavigate();
  const isStudent = user?.role?.toLowerCase() === "student";
  const [showSummaryBeforeSubmit, setShowSummaryBeforeSubmit] = useState(false);
  const [lastSubmittedResultId, setLastSubmittedResultId] = useState(null);
  const [showBreakModal, setShowBreakModal] = useState(false);
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [breakCountdown, setBreakCountdown] = useState(600);
  const [lastRealIndex, setLastRealIndex] = useState(-1);
  const [latestAttemptId, setLatestAttemptId] = useState(null);
  const [status, setStatus] = useState('in-progress');
  const [questionTimeSpent, setQuestionTimeSpent] = useState({});
const timeSpentRef = useRef(0);

  const realQuestions = test?.questions?.filter(q => q.questionType && q.question?.trim()) || [];
  

const location = useLocation();
const isFreshAttempt = new URLSearchParams(location.search).get('fresh') === 'true';

const autoSaveIntervalRef = useRef(null);


  // ✅ Event listener for custom modal trigger
  useEffect(() => {
    const handleTriggerModal = () => setShowModal(true);
    window.addEventListener("trigger-submit-modal", handleTriggerModal);
    return () => window.removeEventListener("trigger-submit-modal", handleTriggerModal);
  }, []);

  // ✅ Main timer (runs every second unless paused/break)
  useEffect(() => {
    if (!test || !isStudent || isPaused || isOnBreak) return;
    const timer = setInterval(() => {
      timeSpentRef.current += 1; // ✅ increment time for current question
      setTimeLeft((prev) => {
        const updated = prev - 1;
        localStorage.setItem(timeKey, updated.toString());
        
        if (updated <= 0) {
          clearInterval(timer);
          setShowSummaryBeforeSubmit(true);
          return 0;
        }
        return updated;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [test, isStudent, isPaused, isOnBreak]);

  

useEffect(() => {
  const preloadAttempt = async () => {
    try {
      const res = await axios.get(`${REACT_APP_API_URL}/api/userTestData/latest-attempt`, {
        params: { userId: user?.id || user?._id, testId }
      });

      const latest = res.data?.attempt;

      if (!latest) {
        // ✅ No in-progress attempt found, create new one
        const startRes = await axios.post(`${REACT_APP_API_URL}/api/userTestData/start-attempt`, {
          userId: user?.id || user?._id,
          testId
        });
        localStorage.removeItem(timeKey);
        localStorage.removeItem(pauseKey);
        setTimeLeft(test?.duration * 60 || 0);
        setLatestAttemptId(startRes.data?.attempt?._id || null);

      } else if (latest.status === "in-progress") {
        // ✅ Resume in-progress attempt
        setAnswers(latest.answers || {});
        setMarkedForReview(latest.markedForReviewMap || {});
        setQuestionStatus(latest.questionStatusMap || {});
        setTimeLeft(latest.timeLeft || test?.duration * 60 || 0);
        setCurrentQuestionIndex(latest.currentQuestionIndex || 0);
        setLatestAttemptId(latest._id);

        const calculatedScore = Object.entries(latest.answers || {}).reduce((sum, [qid, ans]) => {
          const q = test?.questions?.find(q =>
            q._id?.toString() === qid || q.questionNumber?.toString() === qid
          );
          const marks = q?.marks || 1;
          return ans?.isCorrect ? sum + marks : sum;
        }, 0);
        setScore(calculatedScore);

      } else if (latest.status === "completed") {
        // Completed attempt, nothing to do
        return;
      }

      console.log("⏳ Resuming timer from", latest?.timeLeft);
      console.log("📌 Resuming at question index:", latest?.currentQuestionIndex);
    } catch (err) {
      console.error("❌ Attempt preload error:", err);
    }
  };

  const checkAndPreload = async () => {
    if (user && test) {
      const isFresh = new URLSearchParams(location.search).get("fresh") === "true";

      if (!isFresh) {
        try {
          const res = await axios.get(`${REACT_APP_API_URL}/api/userTestData/latest-attempt`, {
            params: { userId: user?.id || user?._id, testId }
          });
          const latest = res.data?.attempt;

          if (latest?.status === "completed") {
            toast.info("✅ You've already submitted this test. Redirecting...");
            navigate(`/test-overview/${test._id || testId}`, { replace: true });
            return;
          }
        } catch (err) {
          console.error("❌ Check latest attempt error:", err);
        }
      }

      // Proceed with preload if not redirected
      preloadAttempt();
    }
  };

  checkAndPreload(); // 🔁 Safe async call
}, [user, test]);



  // ✅ Auto-save every second for critical fields
  useEffect(() => {
  // ✅ Only start interval once
  if (autoSaveIntervalRef.current || status === 'completed') return;

  autoSaveIntervalRef.current = setInterval(() => {
    if (!latestAttemptId || status === 'completed') {
      console.log("⏹️ Auto-save skipped. Status:", status);
      return;
    }

    const answeredCount = Object.values(answers || {}).filter(a => a !== null && a !== undefined).length;
    const totalQuestions = realQuestions.length;
    const correctAnswers = Object.values(answers || {}).filter(a => a.isCorrect).length;
    const accuracy = totalQuestions > 0 ? ((correctAnswers / totalQuestions) * 100).toFixed(2) : "0.00";

    console.log("📤 Auto-saving with status:", status);
const totalMarks = realQuestions?.reduce((sum, q) => sum + (q.marks || 1), 0);
    axios
      .post(`${REACT_APP_API_URL}/api/userTestData/auto-save`, {
        attemptId: latestAttemptId,
        answers,
        markedForReviewMap: markedForReview,
        questionStatusMap: questionStatus,
        timeLeft,
        score,
        yourAccuracy: accuracy,
        status: 'in-progress',
        completedAt: null,
        currentQuestionIndex,
        totalMarks,
        questionTimeSpent // ✅ added
      })
      .then(() => {
        console.log("✅ Auto-saved successfully at", new Date().toLocaleTimeString());
      })
      .catch((err) => {
        const error = err.response?.data?.error;
        console.error("❌ Auto-save error:", error);

        if (error === 'Attempt already submitted') {
          console.warn("⛔ Server says already submitted. Stopping auto-save.");
          setStatus('completed'); // ✅ Stop loop
          clearInterval(autoSaveIntervalRef.current);
          autoSaveIntervalRef.current = null;
        }

        console.error("Auto-save failed. Check console for details.");
      });
  }, 1000);

  return () => {
    clearInterval(autoSaveIntervalRef.current);
    autoSaveIntervalRef.current = null;
  };
}, [latestAttemptId, status, answers, markedForReview, questionStatus, timeLeft, score, realQuestions]);


  // ✅ Break countdown logic
  useEffect(() => {
    if (!isOnBreak) return;
    const countdown = setInterval(() => {
      setBreakCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          setIsOnBreak(false);
          setShowBreakModal(false);
          setIsPaused(false);
          return 600;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(countdown);
  }, [isOnBreak]);

  // ✅ Pause on browser/tab switch
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsPaused(true);
        localStorage.setItem(pauseKey, "true");
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);
  // ✅ Section break and status update logic
  useEffect(() => {
    if (!test || !isStudent || !realQuestions.length) return;

    const currentQuestion = test.questions[currentQuestionIndex];
    if (!currentQuestion?.questionType || !currentQuestion?.question?.trim()) return;

    const realIndex = realQuestions.findIndex(
      q => (q._id || q.questionNumber) === (currentQuestion._id || currentQuestion.questionNumber)
    );

    const currentQId = currentQuestion._id || currentQuestion.questionNumber;
    setVisitedQuestions((prev) => ({ ...prev, [currentQId]: true }));

    // ✅ Status update for previous question
    if (realIndex > 0 && realIndex !== lastRealIndex) {
      const prevQ = realQuestions[realIndex - 1];
      const prevQId = prevQ._id || prevQ.questionNumber;
      const ans = answers[prevQId];
      const marked = markedForReview[prevQId];

      const hasAnswer = (() => {
        if (!ans) return false;
        if (typeof ans === "object" && ans.selectedOption !== undefined) {
          if (typeof ans.selectedOption === "object") {
            return Object.keys(ans.selectedOption).length > 0;
          }
          return !!ans.selectedOption;
        }
        return false;
      })();

      const newStatus = hasAnswer && marked
        ? "answeredMarked"
        : hasAnswer
        ? "answered"
        : marked
        ? "marked"
        : "unanswered";

      setQuestionStatus((prev) => ({ ...prev, [prevQId]: newStatus }));
    }

    // ✅ Break logic after completing section
    if (realIndex !== lastRealIndex) {
      const prevQ = realQuestions[lastRealIndex];
      if (!prevQ) {
        setLastRealIndex(realIndex);
        return;
      }

       // ✅ Track time spent on the previous question
  const prevQId = prevQ._id || prevQ.questionNumber;
  setQuestionTimeSpent((prev) => ({
    ...prev,
    [prevQId]: (prev[prevQId] || 0) + timeSpentRef.current
  }));
  timeSpentRef.current = 0; // reset timer for next question

      const prevSection = prevQ.section;
      const sectionQuestions = realQuestions
        .map((q, idx) => ({ ...q, idx }))
        .filter(q => q.section === prevSection);

      const isLastInPrevSection = sectionQuestions.at(-1)?.idx === lastRealIndex;

      const allPrevSectionHandled = sectionQuestions.every(q => {
        const qId = q._id || q.questionNumber;
        return answers[qId] !== undefined || questionStatus[qId] === "unanswered";
      });

      if (
        isLastInPrevSection &&
        lastRealIndex !== realQuestions.length - 1 &&
        allPrevSectionHandled
      ) {
        setIsPaused(true);
        setShowBreakModal(true);
      }

      setLastRealIndex(realIndex);
    }
  }, [currentQuestionIndex, test, answers, markedForReview]);


  const handleOptionChange = (option) => {
    const question = realQuestions[currentQuestionIndex];
    const qId = question._id || question.questionNumber;

    let correctAnswer = Array.isArray(question.answer)
      ? question.answer
      : [question.answer];

    let isCorrect = Array.isArray(option)
      ? option.sort().join(",") === correctAnswer.sort().join(",")
      : option === correctAnswer[0];

    setAnswers((prev) => ({
      ...prev,
      [qId]: {
        selectedOption: option,
        isCorrect,
        correctAnswer,
      },
    }));

    setQuestionStatus((prev) => ({
      ...prev,
      [qId]: markedForReview[qId] ? "answeredMarked" : "answered",
    }));
  };

  const handleClear = () => {
    const qId = realQuestions[currentQuestionIndex]._id || realQuestions[currentQuestionIndex].questionNumber;
    const updatedAnswers = { ...answers };
    delete updatedAnswers[qId];
    setAnswers(updatedAnswers);
    setQuestionStatus((prev) => ({
      ...prev,
      [qId]: markedForReview[qId] ? "marked" : "unanswered",
    }));
  };

  const handleMark = () => {
    const qId = realQuestions[currentQuestionIndex]._id || realQuestions[currentQuestionIndex].questionNumber;
    const isMarked = !markedForReview[qId];
    setMarkedForReview((prev) => ({ ...prev, [qId]: isMarked }));
    setQuestionStatus((prev) => ({
      ...prev,
      [qId]: answers[qId]
        ? isMarked
          ? "answeredMarked"
          : "answered"
        : isMarked
        ? "marked"
        : "unanswered",
    }));
  };

  const handleAnswerSelect = (questionId, selectedOption) => {
    const currentQuestion = realQuestions.find(q => q._id === questionId);
    let correctAnswer = Array.isArray(currentQuestion.answer)
      ? currentQuestion.answer
      : [currentQuestion.answer];

    if (currentQuestion.questionType === "Drag and Drop") {
      correctAnswer = {};
      currentQuestion.definitions?.forEach((def) => {
        if (def.text && def.match) {
          correctAnswer[def.text.toLowerCase().trim()] = def.match.toLowerCase().trim();
        }
      });
    }

    const normalize = (obj) =>
      Object.entries(obj || {})
        .map(([k, v]) => `${k.toLowerCase().trim()}:${v.toLowerCase().trim()}`)
        .sort()
        .join("|");

    let isCorrect;
    if (currentQuestion.questionType === "Drag and Drop") {
      const givenMatches = {};
      Object.entries(selectedOption || {}).forEach(([def, term]) => {
        if (def && term) {
          givenMatches[def.toLowerCase().trim()] = term.toLowerCase().trim();
        }
      });
      isCorrect = normalize(correctAnswer) === normalize(givenMatches);
    } else {
      isCorrect = Array.isArray(selectedOption)
        ? selectedOption.sort().join(",") === correctAnswer.sort().join(",")
        : selectedOption === correctAnswer[0];
    }

    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        selectedOption,
        isCorrect,
        correctAnswer,
      },
    }));

    if (isCorrect && !answers[questionId]?.isCorrect) {
      setScore((prevScore) => prevScore + (currentQuestion.marks || 1));
    }
  };
  const handleCloseModal = () => setShowModal(false);
  const handleConfirmSubmit = () => {
    setShowModal(false);
    setShowSummaryBeforeSubmit(true);
  };

  const handleEditQuestion = (questionId) => {
    setEditingQuestionId(questionId);
    const question = realQuestions.find((q) => q._id === questionId);
    setEditedQuestions((prev) => ({ ...prev, [questionId]: question }));
  };

  const handleSaveEditedQuestion = async (questionId) => {
    try {
      const updatedQuestion = editedQuestions[questionId];
      const response = await axios.put(`${REACT_APP_API_URL}/api/mock-tests/${testId}/questions/${questionId}`, updatedQuestion);
      const updatedFromBackend = response.data.updatedQuestion;
      setTest((prev) => {
        const updatedQuestions = prev.questions.map((q) =>
          q._id === questionId ? { ...q, ...updatedFromBackend } : q
        );
        return { ...prev, questions: updatedQuestions };
      });
      setEditingQuestionId(null);
    } catch (err) {
      console.error("Failed to update question", err);
    }
  };

//   const handleFinishTest = async () => {
//   const normalizeStatus = (status) => {
//     switch (status) {
//       case "answered": return "ANSWERED";
//       case "unanswered": return "NOT ANSWERED";
//       case "marked": return "MARKED FOR REVIEW";
//       case "answeredMarked": return "ANSWERED & MARKED FOR REVIEW";
//       default: return "NOT ANSWERED";
//     }
//   };

//   try {
//     const detailedAnswers = Object.entries(answers).map(([questionId, answerObj]) => {
//       const originalQ = realQuestions.find(
//         q => (q._id?.toString() === questionId || q.questionNumber?.toString() === questionId)
//       );

//       if (!originalQ) {
//         console.warn(`⚠️ Warning: Question with ID ${questionId} not found`);
//       }

//       return {
//         questionId,
//         selectedAnswer: answerObj?.selectedOption || null,
//         correctAnswer: answerObj?.correctAnswer || null,
//         isCorrect: answerObj?.isCorrect || false,
//         explanation: originalQ?.explanation || '',
//         tags: originalQ?.tags || [],
//         difficulty: originalQ?.difficulty || 'Medium',
//         timeAllocated: originalQ?.timeAllocated || 0,
//         markedForReview: markedForReview?.[questionId] || false,
//         questionStatus: normalizeStatus(questionStatus?.[questionId]) || 'NOT ANSWERED',
//       };
//     });

//     const totalMarks = realQuestions?.reduce((sum, q) => sum + (q.marks || 1), 0);
//     const payload = {
//       userId: user?.id || user?._id,
//       testId: test?._id || testId,
//       answers,
//       score: typeof score === "number" ? score : 0,
//       totalMarks,
//       markedForReviewMap: markedForReview,
//       questionStatusMap: questionStatus,
//       detailedAnswers,
//       questionTimeSpent // ✅ added
//     };

//     console.log("📤 Submitting final payload:", payload);

//     const response = await axios.post(`${REACT_APP_API_URL}/api/userTestData/submit-test`, payload);
//     const result = response.data;

//     toast.success("Test submitted successfully!");
//     setLastSubmittedResultId(result.resultId || result._id);

//     // 🧹 Optional: clean up local storage
//     localStorage.removeItem(timeKey);
//     localStorage.removeItem(pauseKey);

//     // ✅ Mark as completed to stop auto-save
//     setStatus('completed');
//     sessionStorage.setItem("fromSolutionPage", "true");
//     navigate(`/test-overview/${test._id || testId}`, { replace: true });

//   } catch (err) {
//     const errorMsg = err.response?.data?.error || "Submission failed.";
//     console.error("❌ Submission Error:", errorMsg);
//     toast.error(errorMsg);
//   }
// };



const handleFinishTest = async () => {
  const normalizeStatus = (status) => {
    switch (status) {
      case "answered": return "ANSWERED";
      case "unanswered": return "NOT ANSWERED";
      case "marked": return "MARKED FOR REVIEW";
      case "answeredMarked": return "ANSWERED & MARKED FOR REVIEW";
      default: return "NOT ANSWERED";
    }
  };

  // ✅ Update current question's time before submission
  const currentQId = realQuestions[currentQuestionIndex]?._id || realQuestions[currentQuestionIndex]?.questionNumber;
  const updatedTimeSpent = {
    ...questionTimeSpent,
    [currentQId]: (questionTimeSpent?.[currentQId] || 0) + timeSpentRef.current,
  };
  timeSpentRef.current = 0; // reset after use

  try {
    const detailedAnswers = Object.entries(answers).map(([questionId, answerObj]) => {
      const originalQ = realQuestions.find(
        q => (q._id?.toString() === questionId || q.questionNumber?.toString() === questionId)
      );

      if (!originalQ) {
        console.warn(`⚠️ Warning: Question with ID ${questionId} not found`);
      }

      return {
        questionId,
        selectedAnswer: answerObj?.selectedOption || null,
        correctAnswer: answerObj?.correctAnswer || null,
        isCorrect: answerObj?.isCorrect || false,
        explanation: originalQ?.explanation || '',
        tags: originalQ?.tags || [],
        difficulty: originalQ?.difficulty || 'Medium',
        timeAllocated: originalQ?.timeAllocated || 0,
        markedForReview: markedForReview?.[questionId] || false,
        questionStatus: normalizeStatus(questionStatus?.[questionId]) || 'NOT ANSWERED',
      };
    });

    const totalMarks = realQuestions?.reduce((sum, q) => sum + (q.marks || 1), 0);
    const payload = {
      userId: user?.id || user?._id,
      testId: test?._id || testId,
      answers,
      score: typeof score === "number" ? score : 0,
      totalMarks,
      markedForReviewMap: markedForReview,
      questionStatusMap: questionStatus,
      detailedAnswers,
      questionTimeSpent: updatedTimeSpent, // ✅ includes latest time
    };

    console.log("📤 Submitting final payload:", payload);

    const response = await axios.post(`${REACT_APP_API_URL}/api/userTestData/submit-test`, payload);
    const result = response.data;

    toast.success("Test submitted successfully!");
    setLastSubmittedResultId(result.resultId || result._id);

    localStorage.removeItem(timeKey);
    localStorage.removeItem(pauseKey);
    setStatus('completed');
    sessionStorage.setItem("fromSolutionPage", "true");
    navigate(`/test-overview/${test._id || testId}`, { replace: true });

  } catch (err) {
    const errorMsg = err.response?.data?.error || "Submission failed.";
    console.error("❌ Submission Error:", errorMsg);
    toast.error(errorMsg);
  }
};





// useEffect(() => {
//   const handleBeforeUnload = async (e) => {
//     e.preventDefault();
//     await handleFinishTest(); // submits automatically
//   };
//   window.addEventListener("beforeunload", handleBeforeUnload);
//   return () => window.removeEventListener("beforeunload", handleBeforeUnload);
// }, [answers, questionStatus, markedForReview]);



useEffect(() => {
  const handleBeforeUnload = async (e) => {
    e.preventDefault();

    // ✅ Add time spent on current question before unload
    const currentQId = realQuestions[currentQuestionIndex]?._id || realQuestions[currentQuestionIndex]?.questionNumber;
    setQuestionTimeSpent((prev) => ({
      ...prev,
      [currentQId]: (prev[currentQId] || 0) + timeSpentRef.current
    }));

    await handleFinishTest(); // ✅ submit test
  };

  window.addEventListener("beforeunload", handleBeforeUnload);
  return () => window.removeEventListener("beforeunload", handleBeforeUnload);
}, [answers, questionStatus, markedForReview, currentQuestionIndex, realQuestions]);



  if (showBreakModal) {
    return (
      <div className="text-center p-4">
        <h3>Section Completed</h3>
        <p>Do you want to take a 10-minute break or continue?</p>
        <button className="btn btn-success m-2" onClick={() => {
          setIsOnBreak(true);
          setShowBreakModal(false);
        }}>Take Break</button>
        <button className="btn btn-primary m-2" onClick={() => {
          setShowBreakModal(false);
          setIsPaused(false);
        }}>Continue</button>
      </div>
    );
  }

  if (isOnBreak) {
    return (
      <div className="text-center p-4">
        <h4>
          Break Time Remaining: {Math.floor(breakCountdown / 60)}:
          {String(breakCountdown % 60).padStart(2, "0")}
        </h4>
        <button className="btn btn-primary m-2" onClick={() => {
          setShowBreakModal(false);
          setIsPaused(false);
          setIsOnBreak(false);
          setBreakCountdown(600);
        }}>
          Continue
        </button>
      </div>
    );
  }



   if (showSummaryBeforeSubmit && test) {
  return (
    <FullReportPage
      realQuestions={realQuestions}
      score={score}
      answers={answers}
      markedForReview={markedForReview}
      lastSubmittedResultId={lastSubmittedResultId}
      handleFinishTest={handleFinishTest}
      setShowSummaryBeforeSubmit={setShowSummaryBeforeSubmit}
      testId={testId}
      test={test}
      timeKey={timeKey}
      pauseKey={pauseKey}
    />
  );
}


  const currentQuestion = test.questions[currentQuestionIndex];

  return (
    <ExamContentLayout
      test={test}
      currentQuestionIndex={currentQuestionIndex}
      currentQuestion={currentQuestion}
      isStudent={isStudent}
      timeLeft={timeLeft}
      editingQuestionId={editingQuestionId}
      editedQuestions={editedQuestions}
      setEditedQuestions={setEditedQuestions}
      answers={answers}
      handleAnswerSelect={handleAnswerSelect}
      handleEditQuestion={handleEditQuestion}
      handleSaveEditedQuestion={handleSaveEditedQuestion}
      setEditingQuestionId={setEditingQuestionId}
      viewingSolutions={viewingSolutions}
      questionStatus={questionStatus}
      markedForReview={markedForReview}
      handleOptionChange={handleOptionChange}
      handleMark={handleMark}
      handleClear={handleClear}
      setCurrentQuestionIndex={setCurrentQuestionIndex}
      handleQuestionSelect={setCurrentQuestionIndex}
      handleFinishTest={handleFinishTest}
      user={user}
      showModal={showModal}
      handleCloseModal={handleCloseModal}
      handleConfirmSubmit={handleConfirmSubmit}
      isPaused={isPaused}
      setIsPaused={setIsPaused}
      pauseKey={pauseKey}
      timeKey={timeKey}
    />
  );
};

export default ExamContent;
