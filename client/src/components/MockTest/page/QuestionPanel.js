import React, { useContext, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";

const QuestionPanel = ({
  test,
  currentQuestion,
  currentQuestionIndex,
  answers,
  markedForReview,
  handleOptionChange,
  handleMark,
  handleClear,
  setCurrentQuestionIndex,
  isPaused,
}) => {
  const { user } = useContext(AuthContext);
  const role = user?.role?.toLowerCase();
  const isStudent = role === "student";

  const [showFinishedModal, setShowFinishedModal] = useState(false);

  if (
    !currentQuestion ||
    !currentQuestion.question ||
    !currentQuestion.options
  ) {
    return <div>Loading question...</div>;
  }

  return (
    <>
      <div className="mt-4">
        {isStudent && (
          <>
            <Button variant="secondary" onClick={handleMark} className="me-2">
              {markedForReview[currentQuestion._id] ? "Unmark" : "Mark for Review"}
            </Button>
            <Button variant="warning" onClick={handleClear} className="me-2">
              Clear Answer
            </Button>
          </>
        )}

        <Button
          variant="primary"
          className="me-2"
          disabled={currentQuestionIndex === 0 || isPaused}
          onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
        >
          Previous
        </Button>

        <Button
          variant="success"
          onClick={() => {
            if (currentQuestionIndex >= test.questions.length - 1) {
              setShowFinishedModal(true); // show modal if at end
            } else {
              setCurrentQuestionIndex((prev) => prev + 1);
            }
          }}
          disabled={isPaused}
        >
          Next
        </Button>
      </div>

      {/* ✅ Modal for finished questions */}
      <Modal show={showFinishedModal} onHide={() => setShowFinishedModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>All Questions Completed</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          You have reached the end of the test. There are no more questions to attempt.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowFinishedModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default QuestionPanel;
