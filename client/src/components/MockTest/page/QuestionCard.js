

import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import QuestionOptions from "./QuestionOptions";
import EditQuestion from "./EditQuestion";

const QuestionCard = ({
  currentQuestion = {},
  currentQuestionIndex = 0,
  isEditing = false,
  editedQuestion,
  editedQuestions = {},
  setEditedQuestions = () => {},
  setEditedQuestion = () => {},
  answers = {},
  handleAnswerSelect = () => {},
  handleEdit = () => {},
  handleSave = () => {},
  setEditingQuestionId = () => {},
  showResults = false,
}) => {
  const { user } = useContext(AuthContext);
  const [showExplanation, setShowExplanation] = useState(false);

  return (
    <div className="card border-primary">
      <div className="card-body">
        <p>
          <strong>Question Type:</strong>{" "}
          {currentQuestion.questionType || "Single-Select"}
        </p>

        {["admin", "teacher", "management"].includes(user?.role?.toLowerCase()) && (
          <>
            <p>
              <strong>Tags:</strong>{" "}
              {currentQuestion.tags?.length
                ? currentQuestion.tags.join(", ")
                : "No Tags"}
            </p>
            <p>
              <strong>Difficulty Level:</strong>{" "}
              {currentQuestion.level || "Medium"}
            </p>
          </>
        )}

        {/* <p>
          <strong>Marks:</strong> {currentQuestion.marks || 0}
        </p>
        <p>
          <strong>Time:</strong> {currentQuestion.time || 0} minutes
        </p> */}

        {isEditing && editedQuestion ? (
          <EditQuestion
            editedQuestion={editedQuestion}
            setEditedQuestion={setEditedQuestion}
            handleSave={handleSave}
            setEditingQuestion={setEditingQuestionId}
          />
        ) : (
          <>
            <p>
              {currentQuestionIndex + 1}. {currentQuestion.question}
            </p>

            <QuestionOptions
              currentQuestion={currentQuestion}
              answers={answers}
              handleAnswerSelect={handleAnswerSelect}
              isEditing={isEditing}
              editedQuestion={editedQuestions[currentQuestion._id]}
              setEditedQuestion={(updatedData) =>
                setEditedQuestions((prev) => ({
                  ...prev,
                  [currentQuestion._id]: {
                    ...prev[currentQuestion._id],
                    ...updatedData,
                  },
                }))
              }
            />

            {showResults && (
              <div className="mt-3">
                <button
                  className="btn btn-info btn-sm"
                  onClick={() => setShowExplanation(!showExplanation)}
                >
                  {showExplanation ? "Hide" : "Show"} Explanation
                </button>
                {showExplanation && (
                  <div className="alert alert-secondary mt-2">
                    <strong>Explanation:</strong>{" "}
                    {currentQuestion.explanation || "No explanation provided."}
                  </div>
                )}
              </div>
            )}

            {["admin", "teacher"].includes(user?.role?.toLowerCase()) && (
              <button
                className="btn btn-warning mt-3"
                onClick={() => {
                  console.log("🔧 Edit button clicked");
                  handleEdit();
                }}
              >
                Edit
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default QuestionCard;
