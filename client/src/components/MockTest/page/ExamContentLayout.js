// import React from "react";
// import { Row, Col, Container, Button, Modal } from "react-bootstrap";
// import QuestionPanel from "./QuestionPanel";
// import SidebarNavigator from "./SidebarNavigator";
// import QuestionCard from "./QuestionCard";
// import Results from "./Results";

// const formatTime = (seconds) => {
//   const mins = Math.floor(seconds / 60);
//   const secs = seconds % 60;
//   return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
// };

// const ExamContentLayout = ({
//   test,
//   currentQuestionIndex,
//   currentQuestion,
//   isStudent,
//   timeLeft,
//   editingQuestionId,
//   editedQuestions,
//   setEditedQuestions,
//   answers,
//   handleAnswerSelect,
//   handleEditQuestion,
//   handleSaveEditedQuestion,
//   setEditingQuestionId,
//   viewingSolutions,
//   questionStatus,
//   markedForReview,
//   handleOptionChange,
//   handleMark,
//   handleClear,
//   setCurrentQuestionIndex,
//   handleQuestionSelect,
//   handleFinishTest,
//   user,
//   showModal,
//   handleCloseModal,
//   handleConfirmSubmit,
//   isPaused,
//   setIsPaused,
//   pauseKey,
//   timeKey
// }) => {
//   return (
//     <Container fluid style={{ backgroundColor: "#f9f9f9", minHeight: "100vh" }}>
//       <Row>
//         <Col md={isStudent ? 9 : 12}>
//           <h3 className="my-3">{test.title}</h3>

//           {isStudent && (
//             <div className="d-flex justify-content-between align-items-center mb-3">
//               <div>
//                 Question {test.questions.slice(0, currentQuestionIndex + 1).filter(q => q.question?.trim()).length} of {test.questions.filter(q => q.question?.trim()).length}
//               </div>

//               <div className="d-flex align-items-center gap-2">
//                 <strong>Time Left: {formatTime(timeLeft)}</strong>
//                 <Button
//                   variant={isPaused ? "success" : "warning"}
//                   size="sm"
//                   onClick={() => {
//                     const newPausedState = !isPaused;
//                     setIsPaused(newPausedState);
//                     localStorage.setItem(pauseKey, newPausedState.toString());
//                   }}
//                 >
//                   {isPaused ? "Resume" : "Pause"}
//                 </Button>
//               </div>
//             </div>
//           )}

//           <QuestionCard
//             currentQuestion={currentQuestion}
//             currentQuestionIndex={currentQuestionIndex}
//             isEditing={editingQuestionId === currentQuestion._id}
//             editedQuestion={editedQuestions[currentQuestion._id]}
//             editedQuestions={editedQuestions}
//             setEditedQuestions={setEditedQuestions}
//             setEditedQuestion={(data) =>
//               setEditedQuestions((prev) => ({
//                 ...prev,
//                 [currentQuestion._id]: {
//                   ...prev[currentQuestion._id],
//                   ...data,
//                 },
//               }))
//             }
//             answers={answers}
//             handleAnswerSelect={(questionId, selectedOption) =>
//               handleAnswerSelect(questionId, selectedOption)
//             }
//             handleEdit={() => handleEditQuestion(currentQuestion._id)}
//             handleSave={() => handleSaveEditedQuestion(currentQuestion._id)}
//             setEditingQuestionId={setEditingQuestionId}
//             showResults={viewingSolutions}
//           />

//           {["student", "admin", "teacher"].includes(user?.role?.toLowerCase()) && (
//             <QuestionPanel
//               test={test}
//               currentQuestion={currentQuestion}
//               currentQuestionIndex={currentQuestionIndex}
//               answers={answers}
//               markedForReview={markedForReview}
//               handleOptionChange={handleOptionChange}
//               handleMark={handleMark}
//               handleClear={handleClear}
//               setCurrentQuestionIndex={setCurrentQuestionIndex}
//               isPaused={isPaused}
//             />
//           )}
//         </Col>

//         {isStudent && (
//           <Col md={3}>
//             <SidebarNavigator
//               test={test}
//               questions={test.questions}
//               answers={answers}
//               markedForReview={markedForReview}
//               questionStatus={questionStatus}
//               onQuestionSelect={handleQuestionSelect}
//               currentIndex={currentQuestionIndex}
//               setCurrentQuestionIndex={setCurrentQuestionIndex}
//               handleFinishTest={handleFinishTest}
//             />
//           </Col>
//         )}
//       </Row>

//       <Modal show={showModal} onHide={handleCloseModal} centered>
//         <Modal.Header closeButton>
//           <Modal.Title>Submit Test</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>Are you sure you want to submit the test?</Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={handleCloseModal}>Cancel</Button>
//           <Button
//   style={{ backgroundColor: "#4748ac", borderColor: "#4748ac" }}
//   onClick={handleConfirmSubmit}
// >
//   Submit
// </Button>

//         </Modal.Footer>
//       </Modal>

//       {viewingSolutions && isStudent && <Results />}
//     </Container>
//   );
// };

// export default ExamContentLayout;




import React from "react";
import { Row, Col, Container, Button, Modal } from "react-bootstrap";
import QuestionPanel from "./QuestionPanel";
import SidebarNavigator from "./SidebarNavigator";
import QuestionCard from "./QuestionCard";
import Results from "./Results";
import confetti from "canvas-confetti"; // ✅ added
import BackButton from "./BackButton";
 
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};
 
const ExamContentLayout = ({
  test,
  currentQuestionIndex,
  currentQuestion,
  isStudent,
  timeLeft,
  editingQuestionId,
  editedQuestions,
  setEditedQuestions,
  answers,
  handleAnswerSelect,
  handleEditQuestion,
  handleSaveEditedQuestion,
  setEditingQuestionId,
  viewingSolutions,
  questionStatus,
  markedForReview,
  handleOptionChange,
  handleMark,
  handleClear,
  setCurrentQuestionIndex,
  handleQuestionSelect,
  handleFinishTest,
  user,
  showModal,
  handleCloseModal,
  handleConfirmSubmit,
  isPaused,
  setIsPaused,
  pauseKey,
  timeKey,
  visitedQuestions
}) => {
 
  // ✅ celebration wrapper
  const handleCelebrateAndSubmit = () => {
    // trigger confetti
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
    });
 
    // call original submit handler
    handleConfirmSubmit();
  };


  
 
  return (
    <>
      <BackButton/>
    <Container fluid style={{ backgroundColor: "#f9f9f9", minHeight: "100vh" }}>
      <Row>
        <Col md={isStudent ? 9 : 12}>
          <h3 className="my-3">{test.title}</h3>
 
          {isStudent && (
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>Question {currentQuestionIndex + 1} of {test.questions.length}</div>
              <div className="d-flex align-items-center gap-2">
                <strong>Time Left: {formatTime(timeLeft)}</strong>
                <Button
                  variant={isPaused ? "success" : "warning"}
                  size="sm"
                  onClick={() => {
                    const newPausedState = !isPaused;
                    setIsPaused(newPausedState);
                    localStorage.setItem(pauseKey, newPausedState.toString());
                  }}
                >
                  {isPaused ? "Resume" : "Pause"}
                </Button>
              </div>
            </div>
          )}
 

          <QuestionCard
            currentQuestion={currentQuestion}
            currentQuestionIndex={currentQuestionIndex}
            isEditing={editingQuestionId === currentQuestion._id}
            editedQuestion={editedQuestions[currentQuestion._id]}
            editedQuestions={editedQuestions}
            setEditedQuestions={setEditedQuestions}
            setEditedQuestion={(data) =>
              setEditedQuestions((prev) => ({
                ...prev,
                [currentQuestion._id]: {
                  ...prev[currentQuestion._id],
                  ...data,
                },
              }))
            }
            answers={answers}
            handleAnswerSelect={(questionId, selectedOption) =>
              handleAnswerSelect(questionId, selectedOption)
            }
            handleEdit={() => handleEditQuestion(currentQuestion._id)}
            handleSave={() => handleSaveEditedQuestion(currentQuestion._id)}
            setEditingQuestionId={setEditingQuestionId}
            showResults={viewingSolutions}
          />
 
          {["student", "admin", "teacher"].includes(user?.role?.toLowerCase()) && (
            <QuestionPanel
              test={test}
              currentQuestion={currentQuestion}
              currentQuestionIndex={currentQuestionIndex}
              answers={answers}
              markedForReview={markedForReview}
              handleOptionChange={handleOptionChange}
              handleMark={handleMark}
              handleClear={handleClear}
              setCurrentQuestionIndex={setCurrentQuestionIndex}
              isPaused={isPaused}
            />
          )}
        </Col>
 
        {isStudent && (
          <Col md={3}>
            <SidebarNavigator
              test={test}
              questions={test.questions}
              answers={answers}
              markedForReview={markedForReview}
              questionStatus={questionStatus}
              onQuestionSelect={handleQuestionSelect}
              currentIndex={currentQuestionIndex}
              setCurrentQuestionIndex={setCurrentQuestionIndex}
              handleFinishTest={handleFinishTest}
              visitedQuestions={visitedQuestions}
            />
          </Col>
        )}
      </Row>
 
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Submit Test</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to submit the test?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Cancel</Button>
 
          {/* ✅ Blast celebration on submit */}
          <Button
            style={{ backgroundColor: "#4748ac", borderColor: "#4748ac" }}
            onClick={handleCelebrateAndSubmit}
          >
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
 
      {viewingSolutions && isStudent && <Results />}
    </Container>
    </>
  );
};
 
export default ExamContentLayout;