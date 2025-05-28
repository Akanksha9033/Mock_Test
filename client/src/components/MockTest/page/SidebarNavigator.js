

import React from "react";
import { Button } from "react-bootstrap";

const getStatusColor = (status) => {
  switch (status) {
    case "answered":
      return "#8BC34A"; // green
    case "unanswered":
      return "#E53935"; // red
    case "marked":
      return "#673AB7"; // purple
    case "notVisited":
      return "#E0E0E0"; // light gray
    case "answeredMarked":
      return "linear-gradient(#673AB7 50%, #8BC34A 50%)"; // purple + green
    default:
      return "#E0E0E0";
  }
};

const generateQuestionStatus = (questions, answers, markedForReview) => {
  const statusMap = {};

  questions.forEach((q, idx) => {
    const id = q._id || idx;
    const hasAnswer = answers[id] !== undefined && answers[id] !== null;
    const isMarked = markedForReview[id];

    if (hasAnswer && isMarked) {
      statusMap[id] = "answeredMarked";
    } else if (isMarked) {
      statusMap[id] = "marked";
    } else if (hasAnswer) {
      statusMap[id] = "answered";
    } else {
      statusMap[id] = "unanswered";
    }
  });

  return statusMap;
};

const SidebarNavigator = ({
  test,
  questions,
  answers,
  markedForReview,
  questionStatus,
  onQuestionSelect,
  currentIndex,
  setCurrentQuestionIndex,
}) => {
  const allQuestions = questions || (test && test.questions) || [];

  if (!allQuestions.length) {
    return <div>Loading questions...</div>;
  }

  const finalStatus =
    questionStatus ||
    generateQuestionStatus(allQuestions, answers, markedForReview);

  const handleClick = (idx) => {
    if (onQuestionSelect) {
      onQuestionSelect(idx);
    } else if (setCurrentQuestionIndex) {
      setCurrentQuestionIndex(idx);
    }
  };

  return (
    <div
      className="p-3 bg-white rounded shadow-sm"
      style={{ maxHeight: "100vh", overflowY: "auto" }}
    >
      <h6 className="fw-bold mb-3">Question Navigator</h6>

      <div
        className="d-flex flex-wrap gap-2 mb-3"
        style={{ maxHeight: 300, overflowY: "auto" }}
      >
        {allQuestions.map((q, idx) => {
          const id = q._id || idx;
          const status = finalStatus?.[id] || "notVisited";
          const bg = getStatusColor(status);
          const isGradient = bg.includes("linear");

          return (
            <div
              key={id}
              onClick={() => handleClick(idx)}
              className="d-flex justify-content-center align-items-center"
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                backgroundColor: isGradient ? undefined : bg,
                backgroundImage: isGradient ? bg : undefined,
                color: bg === "#E0E0E0" ? "#000" : "#fff",
                border: "1px solid #ccc",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              {idx + 1}
            </div>
          );
        })}
      </div>

      <div className="mb-3">
        <h6 className="fw-bold">Status Legend</h6>
        <div className="d-flex flex-column gap-1">
          {[
            ["#8BC34A", "ANSWERED"],
            ["#E53935", "NOT ANSWERED"],
            ["#673AB7", "MARKED FOR REVIEW"],
            [
              "linear-gradient(#673AB7 50%, #8BC34A 50%)",
              "ANSWERED & MARKED FOR REVIEW",
            ],
          ].map(([color, label], idx) => {
            const isGradient = color.includes("linear");

            return (
              <div key={idx} className="d-flex align-items-center">
                <div
                  style={{
                    width: 15,
                    height: 15,
                    borderRadius: "50%",
                    backgroundColor: isGradient ? undefined : color,
                    backgroundImage: isGradient ? color : undefined,
                    marginRight: 8,
                  }}
                />
                <span style={{ fontSize: "0.9rem" }}>{label}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="text-center mt-3">
        <Button
          style={{
            backgroundColor: "#4CAF50",
            border: "none",
            fontWeight: "bold",
            width: "100%",
          }}
          onClick={() =>
            window.dispatchEvent(new CustomEvent("trigger-submit-modal"))
          }
        >
          SUBMIT
        </Button>
      </div>
    </div>
  );
};

export default SidebarNavigator;


