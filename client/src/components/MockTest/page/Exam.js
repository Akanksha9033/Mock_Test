


// import React, { useState, useEffect, useContext } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { AuthContext } from "../context/AuthContext";
// import ExamContent from "./ExamContent";

// // const REACT_APP_API_URL = "https://mocktest-ljru.onrender.com";
// const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

// const Exam = () => {
//   const { testId } = useParams();
//   const navigate = useNavigate();
//   const { user } = useContext(AuthContext);

//   const [test, setTest] = useState(null);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [answers, setAnswers] = useState({});
//   const [markedForReview, setMarkedForReview] = useState({});
//   const [questionStatus, setQuestionStatus] = useState({});
//   const [timeLeft, setTimeLeft] = useState(0);
//   const [score, setScore] = useState(0);
//   const [showModal, setShowModal] = useState(false);
//   const [viewingSolutions, setViewingSolutions] = useState(false);
//   const [editedQuestions, setEditedQuestions] = useState({});
//   const [editingQuestionId, setEditingQuestionId] = useState(null);
//   const [visitedQuestions, setVisitedQuestions] = useState({});
//   const [isPaused, setIsPaused] = useState(false);
//   const pauseKey = `pausedTime_${testId}`;
//   const timeKey = `timeLeft_${testId}`;

//   const isStudent = user?.role?.toLowerCase() === "student";
//   const isPrivileged = ["admin", "teacher"].includes(user?.role?.toLowerCase());

//   // 🚫 Unauthorized redirect
//   useEffect(() => {
//     if (user?.role?.toLowerCase() === null) return;
//     if (!isStudent && !isPrivileged) navigate("/");
//   }, [user, navigate]);

//   // 🧠 Fetch test
//   useEffect(() => {
//     const fetchTest = async () => {
//       try {
//         const response = await axios.get(`${REACT_APP_API_URL}/api/admin/mock-tests/${testId}`);
//         if (response?.data) {
//           setTest({
//             ...response.data,
//             questions: response.data.questions || [],
//           });
//           setTimeLeft(response.data.duration ? response.data.duration * 60 : 0);
//         } else {
//           navigate("/");
//         }
//       } catch (error) {
//         console.error("Error fetching test:", error);
//         navigate("/");
//       }
//     };

//     fetchTest();
//   }, [testId, navigate]);

//   // ⏱ Load stored time and pause state
//   useEffect(() => {
//     if (!test) return;
  
//     const storedTime = localStorage.getItem(timeKey);
//     const storedPaused = localStorage.getItem(pauseKey);
  
//     if (storedTime !== null && !isNaN(Number(storedTime))) {
//       setTimeLeft(Number(storedTime));
//     } else {
//       setTimeLeft(test.duration ? test.duration * 60 : 0);
//     }
  
//     setIsPaused(storedPaused === "true");
//   }, [test]);
  

//   // ⏳ Countdown logic
//   useEffect(() => {
//     if (!test || !isStudent || isPaused) return;
//     const timer = setInterval(() => {
//       setTimeLeft((prev) => {
//         const updated = prev - 1;
//         localStorage.setItem(timeKey, updated.toString());
//         if (updated <= 0) {
//           clearInterval(timer);
//           handleFinishTest();
//           return 0;
//         }
//         return updated;
//       });
//     }, 1000);
//     return () => clearInterval(timer);
//   }, [test, isStudent, isPaused]);

//   // 👀 Auto pause on tab close
//   useEffect(() => {
//     const handleVisibilityChange = () => {
//       if (document.hidden) {
//         setIsPaused(true);
//         localStorage.setItem(pauseKey, "true");
//       }
//     };
//     document.addEventListener("visibilitychange", handleVisibilityChange);
//     return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
//   }, []);

//   // ✅ Track visited & status
//   useEffect(() => {
//     if (!test || !test.questions.length) return;
//     const currentQuestion = test.questions[currentQuestionIndex];
//     const qId = currentQuestion._id || currentQuestion.questionNumber;

//     // Mark current as visited
//     setVisitedQuestions((prev) => ({
//       ...prev,
//       [qId]: true,
//     }));

//     // Update status of previous
//     if (currentQuestionIndex > 0) {
//       const prevQuestion = test.questions[currentQuestionIndex - 1];
//       const prevQId = prevQuestion._id || prevQuestion.questionNumber;
//       setQuestionStatus((prev) => {
//         const currentStatus = prev[prevQId];
//         const hasAnswer = answers[prevQId] !== undefined && answers[prevQId] !== null;
//         const isMarked = markedForReview[prevQId];
//         const newStatus = hasAnswer && isMarked
//           ? "answeredMarked"
//           : isMarked
//           ? "marked"
//           : hasAnswer
//           ? "answered"
//           : visitedQuestions[prevQId]
//           ? "unanswered"
//           : currentStatus || "notVisited";
//         if (currentStatus !== newStatus) {
//           return {
//             ...prev,
//             [prevQId]: newStatus,
//           };
//         }
//         return prev;
//       });
//     }
//   }, [currentQuestionIndex, test, answers, markedForReview]);

//   // 📤 Submit modal open
//   const handleFinishTest = () => setShowModal(true);
//   const handleCloseModal = () => setShowModal(false);
//   const handleConfirmSubmit = () => {
//     setShowModal(false);
//     setViewingSolutions(true);
//   };

//   return test ? (
//     <ExamContent
//       test={test}
//       testId={testId}
//       user={user}
//       currentQuestionIndex={currentQuestionIndex}
//       setCurrentQuestionIndex={setCurrentQuestionIndex}
//       answers={answers}
//       setAnswers={setAnswers}
//       markedForReview={markedForReview}
//       setMarkedForReview={setMarkedForReview}
//       questionStatus={questionStatus}
//       setQuestionStatus={setQuestionStatus}
//       timeLeft={timeLeft}
//       setTimeLeft={setTimeLeft}
//       score={score}
//       setScore={setScore}
//       showModal={showModal}
//       setShowModal={setShowModal}
//       viewingSolutions={viewingSolutions}
//       setViewingSolutions={setViewingSolutions}
//       editedQuestions={editedQuestions}
//       setEditedQuestions={setEditedQuestions}
//       editingQuestionId={editingQuestionId}
//       setEditingQuestionId={setEditingQuestionId}
//       visitedQuestions={visitedQuestions}
//       setVisitedQuestions={setVisitedQuestions}
//       isPaused={isPaused}
//       setIsPaused={setIsPaused}
//       pauseKey={pauseKey}
//       timeKey={timeKey}
//     />
//   ) : (
//     <div>Loading test...</div>
//   );
// };

// export default Exam;

import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import ExamContent from "./ExamContent";

// const REACT_APP_API_URL = "https://mocktest-ljru.onrender.com";
const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

const Exam = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [test, setTest] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [markedForReview, setMarkedForReview] = useState({});
  const [questionStatus, setQuestionStatus] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [score, setScore] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [viewingSolutions, setViewingSolutions] = useState(false);
  const [editedQuestions, setEditedQuestions] = useState({});
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [visitedQuestions, setVisitedQuestions] = useState({});
  const [isPaused, setIsPaused] = useState(false);
  const pauseKey = `pausedTime_${testId}`;
  const timeKey = `timeLeft_${testId}`;

  const isStudent = user?.role?.toLowerCase() === "student";
  const isPrivileged = ["admin", "teacher"].includes(user?.role?.toLowerCase());

  // 🚫 Unauthorized redirect
  useEffect(() => {
    if (user?.role?.toLowerCase() === null) return;
    if (!isStudent && !isPrivileged) navigate("/");
  }, [user, navigate]);

  // 🧠 Fetch test
  useEffect(() => {
    const fetchTest = async () => {
      try {
        const response = await axios.get(`${REACT_APP_API_URL}/api/admin/mock-tests/${testId}`);
        if (response?.data) {
          setTest({
            ...response.data,
            questions: response.data.questions || [],
          });
          setTimeLeft(response.data.duration ? response.data.duration * 60 : 0);
        } else {
          navigate("/");
        }
      } catch (error) {
        console.error("Error fetching test:", error);
        navigate("/");
      }
    };

    fetchTest();
  }, [testId, navigate]);

  // ⏱ Load stored time and pause state
  useEffect(() => {
    if (!test) return;
  
    const storedTime = localStorage.getItem(timeKey);
    const storedPaused = localStorage.getItem(pauseKey);
  
    if (storedTime !== null && !isNaN(Number(storedTime))) {
      setTimeLeft(Number(storedTime));
    } else {
      setTimeLeft(test.duration ? test.duration * 60 : 0);
    }
  
    setIsPaused(storedPaused === "true");
  }, [test]);
  

  // ⏳ Countdown logic
  useEffect(() => {
    if (!test || !isStudent || isPaused) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const updated = prev - 1;
        localStorage.setItem(timeKey, updated.toString());
        if (updated <= 0) {
          clearInterval(timer);
          handleFinishTest();
          return 0;
        }
        return updated;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [test, isStudent, isPaused]);

  // 👀 Auto pause on tab close
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

  // ✅ Track visited & status
  useEffect(() => {
    if (!test || !test.questions.length) return;
    const currentQuestion = test.questions[currentQuestionIndex];
    const qId = currentQuestion._id || currentQuestion.questionNumber;

    // Mark current as visited
    setVisitedQuestions((prev) => ({
      ...prev,
      [qId]: true,
    }));

    // Update status of previous
    if (currentQuestionIndex > 0) {
      const prevQuestion = test.questions[currentQuestionIndex - 1];
      const prevQId = prevQuestion._id || prevQuestion.questionNumber;
      setQuestionStatus((prev) => {
        const currentStatus = prev[prevQId];
        const hasAnswer = answers[prevQId] !== undefined && answers[prevQId] !== null;
        const isMarked = markedForReview[prevQId];
        const newStatus = hasAnswer && isMarked
          ? "answeredMarked"
          : isMarked
          ? "marked"
          : hasAnswer
          ? "answered"
          : visitedQuestions[prevQId]
          ? "unanswered"
          : currentStatus || "notVisited";
        if (currentStatus !== newStatus) {
          return {
            ...prev,
            [prevQId]: newStatus,
          };
        }
        return prev;
      });
    }
  }, [currentQuestionIndex, test, answers, markedForReview]);

  // 📤 Submit modal open
  const handleFinishTest = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const handleConfirmSubmit = () => {
    setShowModal(false);
    setViewingSolutions(true);
  };

  return test ? (
    <ExamContent
      test={test}
      testId={testId}
      user={user}
      currentQuestionIndex={currentQuestionIndex}
      setCurrentQuestionIndex={setCurrentQuestionIndex}
      answers={answers}
      setAnswers={setAnswers}
      markedForReview={markedForReview}
      setMarkedForReview={setMarkedForReview}
      questionStatus={questionStatus}
      setQuestionStatus={setQuestionStatus}
      timeLeft={timeLeft}
      setTimeLeft={setTimeLeft}
      score={score}
      setScore={setScore}
      showModal={showModal}
      setShowModal={setShowModal}
      viewingSolutions={viewingSolutions}
      setViewingSolutions={setViewingSolutions}
      editedQuestions={editedQuestions}
      setEditedQuestions={setEditedQuestions}
      editingQuestionId={editingQuestionId}
      setEditingQuestionId={setEditingQuestionId}
      visitedQuestions={visitedQuestions}
      setVisitedQuestions={setVisitedQuestions}
      isPaused={isPaused}
      setIsPaused={setIsPaused}
      pauseKey={pauseKey}
      timeKey={timeKey}
    />
  ) : (
    <div>Loading test...</div>
  );
};

export default Exam;

