// import React from "react";
// import { Button } from "react-bootstrap";

// const QuestionPanel = ({
//   test,
//   currentQuestion,
//   currentQuestionIndex,
//   answers,
//   markedForReview,
//   handleOptionChange,
//   handleMark,
//   handleClear,
//   setCurrentQuestionIndex,
// }) => {
//   if (
//     !currentQuestion ||
//     !currentQuestion.question ||
//     !currentQuestion.options
//   ) {
//     return <div>Loading question...</div>;
//   }

//   return (
//     <>
       
//         <div className="mt-4">
//           <Button variant="secondary" onClick={handleMark} className="me-2">
//             {markedForReview[currentQuestion._id] ? "Unmark" : "Mark for Review"}
//           </Button>
//           <Button variant="warning" onClick={handleClear} className="me-2">
//             Clear Answer
//           </Button>
//           <Button
//             variant="primary"
//             className="me-2"
//             disabled={currentQuestionIndex === 0}
//             onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
//           >
//             Previous
//           </Button>
//           <Button
//             variant="success"
//             disabled={currentQuestionIndex === test.questions.length - 1}
//             onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
//           >
//             Next
//           </Button>
//         </div>
//       {/* </Card> */}
//     </>
//   );
// };

// export default QuestionPanel;




import React, { useContext } from "react";
import { Button } from "react-bootstrap";
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
  isPaused, // ✅ Add this
}) => {
  const { user } = useContext(AuthContext);
  const role = user?.role?.toLowerCase();
  const isStudent = role === "student";

  if (
    !currentQuestion ||
    !currentQuestion.question ||
    !currentQuestion.options
  ) {
    return <div>Loading question...</div>;
  }

  return (
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
        disabled={currentQuestionIndex === 0}
        onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
      >
        Previous
      </Button>

      <Button
        variant="success"
        onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
        disabled={isPaused || currentQuestionIndex >= test.questions.length - 1} // ✅ Combined here
      >
        Next
      </Button>
    </div>
  );
};

export default QuestionPanel;
