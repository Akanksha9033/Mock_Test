import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const ExamLifecycleHooks = ({
  test,
  isStudent,
  isPaused,
  setIsPaused,
  isOnBreak,
  timeLeft,
  setTimeLeft,
  timeKey,
  pauseKey,
  setShowSummaryBeforeSubmit,
  setIsOnBreak,
  breakCountdown,
  setBreakCountdown,
  setShowBreakModal,
  user,
  testId,
  setAnswers,
  setMarkedForReview,
  setQuestionStatus,
  setCurrentQuestionIndex,
  setLatestAttemptId,  
  realQuestions,
  lastRealIndex,
  setLastRealIndex,
  setVisitedQuestions,
  answers,
  markedForReview,
  questionStatus,
  latestAttemptId,
  currentQuestionIndex,
  navigate,
  handleFinishTest
}) => {
    const [score, setScore] = useState(0); // ✅ define this in your component

  // ✅ Trigger Submit Modal
  useEffect(() => {
    const handleTriggerModal = () => setShowSummaryBeforeSubmit(true);
    window.addEventListener("trigger-submit-modal", handleTriggerModal);
    return () => window.removeEventListener("trigger-submit-modal", handleTriggerModal);
  }, []);

  // ✅ Timer Countdown
  useEffect(() => {
    if (!test || !isStudent || isPaused || isOnBreak) return;
    const timer = setInterval(() => {
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

  // ✅ Attempt Preload or Resume
  useEffect(() => {
    const preloadAttempt = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/userTestData/latest-attempt`, {
          params: { userId: user?.id || user?._id, testId }
        });

        const latest = res.data?.attempt;
        if (!latest) {
          const startRes = await axios.post(`${process.env.REACT_APP_API_URL}/api/userTestData/start-attempt`, {
            userId: user?.id || user?._id,
            testId
          });
          localStorage.removeItem(timeKey);
          localStorage.removeItem(pauseKey);
          setTimeLeft(test?.duration * 60 || 0);
          setLatestAttemptId(startRes.data?.attempt?._id || null);
        } else if (latest.status === "in-progress") {
          setAnswers(latest.answers || {});
          setMarkedForReview(latest.markedForReviewMap || {});
          setQuestionStatus(latest.questionStatusMap || {});
          setTimeLeft(latest.timeLeft || test?.duration * 60 || 0);
          setCurrentQuestionIndex(latest.currentQuestionIndex || 0);
          setLatestAttemptId(latest._id);

          const calculatedScore = Object.entries(latest.answers || {}).reduce((sum, [qid, ans]) => {
            const q = test?.questions?.find(q => q._id?.toString() === qid || q.questionNumber?.toString() === qid);
            const marks = q?.marks || 1;
            return ans?.isCorrect ? sum + marks : sum;
          }, 0);
          setScore(calculatedScore);
        } else {
          const startRes = await axios.post(`${process.env.REACT_APP_API_URL}/api/userTestData/start-attempt`, {
            userId: user?.id || user?._id,
            testId
          });
          localStorage.removeItem(timeKey);
          localStorage.removeItem(pauseKey);
          setTimeLeft(test?.duration * 60 || 0);
          setLatestAttemptId(startRes.data?.attempt?._id || null);
        }
      } catch (err) {
        console.error("❌ Attempt preload error:", err);
      }
    };

    if (user && test) {
      const cameFromSolution = sessionStorage.getItem("fromSolutionPage");
      if (cameFromSolution) {
        toast.info("✅ You've already submitted this test. Redirecting...");
        sessionStorage.removeItem("fromSolutionPage");
        navigate(`/test-overview/${test._id || testId}`, { replace: true });
        return;
      }
      preloadAttempt();
    }
  }, [user, test]);

  // ✅ Auto Save Logic
  useEffect(() => {
    const autoSave = setInterval(() => {
      if (!latestAttemptId) return;
      const totalQuestions = realQuestions.length;
      const correctAnswers = Object.values(answers || {}).filter(a => a.isCorrect).length;
      const accuracy = totalQuestions > 0 ? ((correctAnswers / totalQuestions) * 100).toFixed(2) : "0.00";

      axios.post(`${process.env.REACT_APP_API_URL}/api/userTestData/auto-save`, {
        attemptId: latestAttemptId,
        answers,
        markedForReviewMap: markedForReview,
        questionStatusMap: questionStatus,
        timeLeft,
        score,
        yourAccuracy: accuracy,
        status: "in-progress",
        completedAt: null,
        currentQuestionIndex
      }).then(() => {
        console.log("✅ Auto-saved at", new Date().toLocaleTimeString());
      }).catch((err) => {
        console.error("❌ Auto-save error:", err);
        toast.error("Auto-save failed.");
      });
    }, 1000);

    return () => clearInterval(autoSave);
  }, [answers, markedForReview, questionStatus, timeLeft, latestAttemptId, score, realQuestions]);

  // ✅ Pause if user switches tab
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

  // ✅ Break Countdown
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

  // ✅ Section Break Logic
  useEffect(() => {
    if (!test || !isStudent || !realQuestions.length) return;

    const currentQuestion = test.questions[currentQuestionIndex];
    if (!currentQuestion?.questionType || !currentQuestion?.question?.trim()) return;

    const realIndex = realQuestions.findIndex(
      q => (q._id || q.questionNumber) === (currentQuestion._id || currentQuestion.questionNumber)
    );

    const currentQId = currentQuestion._id || currentQuestion.questionNumber;
    setVisitedQuestions((prev) => ({ ...prev, [currentQId]: true }));

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

    if (realIndex !== lastRealIndex) {
      const prevQ = realQuestions[lastRealIndex];
      if (!prevQ) {
        setLastRealIndex(realIndex);
        return;
      }

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

  // ✅ Submit test on page close
  useEffect(() => {
    const handleBeforeUnload = async (e) => {
      e.preventDefault();
      await handleFinishTest();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [answers, questionStatus, markedForReview, handleFinishTest]);
};

export default ExamLifecycleHooks;
