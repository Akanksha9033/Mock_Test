import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import LoadingAnimation from "../../LoadingAnimation";

// const REACT_APP_API_URL = "https://mocktest-ljru.onrender.com";
const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

// ✅ Updated format: 0m 23s
const formatTime = (seconds = 0) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}m ${secs}s`;
};

const QuestionReportPage = () => {
  const { resultId } = useParams();
  const [report, setReport] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await axios.get(
          `${REACT_APP_API_URL}/api/results/${resultId}`
        );
        setReport(res.data);
      } catch (error) {
        console.error("Error fetching report:", error);
      }
    };

    fetchReport();
  }, [resultId]);

  if (!report)
    return (
      <div className="text-center mt-5">
        <LoadingAnimation />
      </div>
    );

  const {
    testTitle,
    detailedAnswers = [],
    questionTimeSpent = {},
    questions = [],
    correct,
    incorrect,
    skipped,
    score,
    totalMarks,
  } = report;

  const totalTime = Object.values(questionTimeSpent).reduce(
    (sum, sec) => sum + sec,
    0
  );

  return (
    <div className="container mt-4">
      <div className="text-center mb-4">
        <h2 className="fw-bold text-primary">{testTitle}</h2>
      </div>

      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body d-flex flex-wrap justify-content-between text-center">
          <div>
            <strong>{totalMarks}</strong> Questions
          </div>
          <div>
            <span className="badge bg-success">{correct} Correct</span>
          </div>
          <div>
            <span className="badge bg-danger">{incorrect} Incorrect</span>
          </div>
          <div>
            <span className="badge bg-secondary">{skipped} Skipped</span>
          </div>
          <div>
            <strong>Score:</strong> {score}
          </div>
          <div>
            <strong>Time:</strong> {formatTime(totalTime)}
          </div>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle">
          <thead className="table-light text-center">
            <tr>
              <th>#</th>
              <th>Question</th>
              <th>Your Answer</th>
              <th>Correct Answer</th>
              <th>Marks</th>
              <th>Time Taken</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((q, idx) => {
              const ans = detailedAnswers.find((a) => a.questionId === q._id);
              const isSkipped =
                !ans ||
                ans.selectedAnswer === null ||
                ans.selectedAnswer === undefined;
              const isCorrect = ans?.isCorrect;
              const yourAnswer = ans?.selectedAnswer;
              const correctAnswer = ans?.correctAnswer ?? q.correctAnswer; // ✅ FIXED HERE

              return (
                <tr key={q._id}>
                  <td className="text-center">{idx + 1}</td>
                  <td>
                    <div
                      dangerouslySetInnerHTML={{
                        __html:
                          typeof q.question === "string"
                            ? q.question
                            : JSON.stringify(q.question || "N/A"),
                      }}
                    />
                  </td>
                  <td>
                    {isSkipped
                      ? "N/A"
                      : Array.isArray(yourAnswer)
                      ? yourAnswer.join(", ")
                      : typeof yourAnswer === "object" && yourAnswer !== null
                      ? JSON.stringify(yourAnswer)
                      : yourAnswer}
                  </td>
                  <td>
                    {Array.isArray(correctAnswer)
                      ? correctAnswer.join(", ")
                      : typeof correctAnswer === "object" &&
                        correctAnswer !== null
                      ? JSON.stringify(correctAnswer)
                      : correctAnswer || "N/A"}
                  </td>
                  <td
                    className="text-center"
                    style={{
                      color: isCorrect ? "green" : isSkipped ? "gray" : "red",
                    }}
                  >
                    {isCorrect ? q.marks || 1 : 0}
                  </td>
                  <td className="text-center">
                    {isSkipped
                      ? "N/A"
                      : formatTime(questionTimeSpent[q._id] || 0)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QuestionReportPage;
