import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import LoadingAnimation from "../../LoadingAnimation";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

// const REACT_APP_API_URL = "https://mocktest-ljru.onrender.com";
const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

const FullReportPage = ({
  realQuestions = [],
  score = 0,
  answers = {},
  markedForReview = {},
  lastSubmittedResultId,
  handleFinishTest,
  setShowSummaryBeforeSubmit,
  testId,
  test,
  timeKey,
  pauseKey,
}) => {
  const navigate = useNavigate();
  const { resultId } = useParams();
  const [report, setReport] = useState(null);

  const answered = Object.values(answers).filter((a) => a != null).length;
  const marked = Object.values(markedForReview).filter(Boolean).length;
  const skippedBeforeSubmit = realQuestions?.length
    ? realQuestions.length - answered
    : 0;

  useEffect(() => {
    const fetchReport = async () => {
      const idToUse = lastSubmittedResultId || resultId;
      if (!idToUse) return;

      try {
        const res = await axios.get(
          `${REACT_APP_API_URL}/api/results/${idToUse}`
        );
        setReport(res.data);
      } catch (err) {
        console.error("❌ Failed to load full report:", err);
      }
    };

    fetchReport();
  }, [lastSubmittedResultId, resultId]);

  if ((lastSubmittedResultId || resultId) && !report) {
    return <div className="text-center mt-5"><LoadingAnimation /></div>;
  }

  if ((lastSubmittedResultId || resultId) && report) {
    const {
      score,
      totalMarks,
      correct,
      incorrect,
      yourAccuracy,
      percentage,
      testTitle,
    } = report;

    const skipped = totalMarks - correct - incorrect;

    const formatTime = (seconds) => {
      const m = Math.floor(seconds / 60);
      const s = seconds % 60;
      return `${m}m ${s}s`;
    };

    const totalTimeSpent = Object.entries(report?.questionTimeSpent || {})
      .filter(([key]) => !["timeLeft", "currentQuestionIndex"].includes(key))
      .reduce((sum, [, sec]) => sum + sec, 0);

    return (
      <div className="container my-5">
        <h2 className="fw-bold text-center text-primary mb-4">{testTitle}</h2>

        <div className="row g-4">
          {/* Score Summary Card */}
          <div className="col-md-4">
            <div className="card shadow border-0 bg-light">
              <div className="card-header bg-primary text-white text-center fw-semibold rounded-top">
                Score Summary
              </div>
              <div className="card-body text-center">
                <h2 className="fw-bold display-5 text-success">
                  {score}
                  <small className="text-muted fs-6"> / {totalMarks}</small>
                </h2>
                <hr />
                <ul className="list-unstyled mb-3 small">
                  <li>
                    <strong>Accuracy:</strong>{" "}
                    <span className="text-dark">{yourAccuracy || 0}%</span>
                  </li>
                  <li>
                    <strong>Percentage:</strong>{" "}
                    <span className="text-dark">{percentage || 0}%</span>
                  </li>
                  <li>
                    <strong>Percentile:</strong>{" "}
                    <span className="text-muted">N/A</span>
                  </li>
                </ul>
                <button
                  className="btn btn-outline-primary w-100 mt-2"
                  onClick={() =>
                    navigate(`/solution/${lastSubmittedResultId || resultId}`)
                  }
                >
                  View Solution
                </button>
              </div>
            </div>
          </div>

          {/* Score Cards Summary */}
          <div className="col-md-8">
            <div className="row text-center g-3">
              <div className="col-6 col-md-3">
                <div className="bg-white shadow rounded py-4 border border-success">
                  <h5 className="text-success fw-bold">{correct}</h5>
                  <div className="small text-muted">Correct</div>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="bg-white shadow rounded py-4 border border-danger">
                  <h5 className="text-danger fw-bold">-{incorrect}</h5>
                  <div className="small text-muted">Incorrect</div>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="bg-white shadow rounded py-4 border border-primary">
                  <h5 className="text-primary fw-bold">0</h5>
                  <div className="small text-muted">Negative</div>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="bg-white shadow rounded py-4 border border-secondary">
                  <h5 className="text-muted fw-bold">-{skipped}</h5>
                  <div className="small text-muted">Skipped</div>
                </div>
              </div>
            </div>
            <div className="alert alert-light mt-4 text-center">
              You scored <strong>{correct}</strong> marks from correct answers,
              lost <strong>{incorrect}</strong> on wrong answers,
              <strong> 0</strong> from negative marking, and
              <strong> {skipped}</strong> by skipping.
            </div>
          </div>
        </div>

        {/* Detailed Report Section */}
        <div className="mt-5 p-4 bg-white border rounded shadow-sm">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold">Detailed Report</h5>
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() =>
                navigate(`/report/${lastSubmittedResultId || resultId}`)
              }
            >
              View Report →
            </button>
          </div>
          <div className="row text-center">
            <div className="col-6 col-md-2 mb-2">
              <h6>{report?.totalMarks || realQuestions.length}</h6>
              <div className="text-muted small">Questions</div>
            </div>
            <div className="col-6 col-md-2 mb-2">
              <h6 className="text-success">{report?.correct}</h6>
              <div className="text-muted small">Correct</div>
            </div>
            <div className="col-6 col-md-2 mb-2">
              <h6 className="text-danger">{report?.incorrect}</h6>
              <div className="text-muted small">Incorrect</div>
            </div>
            <div className="col-6 col-md-2 mb-2">
              <h6>{report?.skipped || skipped}</h6>
              <div className="text-muted small">Skipped</div>
            </div>
            <div className="col-6 col-md-2 mb-2">
              <h6>{report?.score}</h6>
              <div className="text-muted small">Score</div>
            </div>
            <div className="col-6 col-md-2 mb-2">
              <h6>{formatTime(totalTimeSpent)}</h6>
              <div className="text-muted small">Time Taken</div>
            </div>
          </div>
        </div>

        {/* Time & Score Analysis */}
        <div className="row mt-5 g-4">
          {/* Time Analysis */}
          <div className="col-md-4">
            <div className="card border-0 shadow-sm h-100 text-center">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h5 className="fw-bold mb-0">Time Analysis</h5>
                </div>

                <div style={{ height: 260, width: 160, margin: "0 auto" }}>
                  <Pie
                    data={{
                      labels: ["Correct", "Incorrect", "Skipped"],
                      datasets: [
                        {
                          data: [correct, incorrect, skipped],
                          backgroundColor: ["#28a745", "#dc3545", "#6c757d"],
                          borderWidth: 1,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { display: false },
                        tooltip: {
                          callbacks: {
                            label: (ctx) => `${ctx.label}: ${ctx.raw}`,
                          },
                        },
                      },
                    }}
                  />
                </div>

                <p className="mt-3 mb-1 fw-semibold">
                  {formatTime(totalTimeSpent)}
                </p>
                <p className="text-muted small">Total Time Spent</p>

                <ul
                  className="list-unstyled small text-start mx-auto"
                  style={{ maxWidth: "180px" }}
                >
                  <li>
                    <span className="text-success">On Correct Answers:</span>{" "}
                    {Math.round((correct / totalMarks) * 100)}%
                  </li>
                  <li>
                    <span className="text-danger">On Incorrect Answers:</span>{" "}
                    {Math.round((incorrect / totalMarks) * 100)}%
                  </li>
                  <li>
                    <span className="text-secondary">On Skipped:</span>{" "}
                    {Math.round((skipped / totalMarks) * 100)}%
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Score Analysis */}
          <div className="col-md-8">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                {/* Header Row with Title and Button */}
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h5 className="fw-bold mb-0">Score Analysis</h5>
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() =>
                      navigate(
                        `/report/${
                          lastSubmittedResultId || resultId
                        }/score-time`
                      )
                    }
                  >
                    View Report →
                  </button>
                </div>

                {/* Legend and Stats */}
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div className="small">
                    <span className="me-3 text-success">
                      🟩 Correct {correct}
                    </span>
                    <span className="me-3 text-danger">
                      🟥 Incorrect {incorrect}
                    </span>
                    <span className="text-muted">⬜ Skipped {skipped}</span>
                  </div>
                  <div className="text-muted small">
                    Total Questions <strong>{totalMarks}</strong>
                  </div>
                </div>

                {/* Bar Chart */}
                <Bar
                  data={{
                    labels: ["Correct", "Incorrect", "Skipped"],
                    datasets: [
                      {
                        label: "Attempts",
                        data: [correct, incorrect, skipped],
                        backgroundColor: ["#28a745", "#dc3545", "#6c757d"],
                        barThickness: 20,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    indexAxis: "y",
                    plugins: {
                      legend: { display: false },
                    },
                    scales: {
                      x: {
                        beginAtZero: true,
                        ticks: { stepSize: 1 },
                      },
                    },
                  }}
                />

                {/* Summary */}
                <p className="mt-4 text-muted small text-center">
                  You have scored <strong>{correct} marks</strong> for correct
                  answers, missed <strong>{incorrect} marks</strong> on
                  incorrect answers, lost <strong>0 marks</strong> due to
                  negative marking and <strong>{skipped} marks</strong> by
                  skipping questions.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Rank Board Section */}
        {/* 🏆 Leaderboard Section */}
        <div className="mt-5">
          <h4 className="fw-bold mb-4 text-primary px-3 d-flex justify-content-between align-items-center">
            Where Do You Stand?
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() =>
                navigate(
                  `/report/${lastSubmittedResultId || resultId}/leaderboard`
                )
              }
            >
              Full Leaderboard →
            </button>
          </h4>

          {/* Top 3 Cards */}
          <div className="row g-3 mb-4 text-center px-3">
            <div className="col-md-4">
              <div className="border rounded p-3 bg-light shadow-sm h-100">
                <div className="fw-bold text-secondary">1st</div>
                <div className="fs-5 text-capitalize">
                  {report.topperName || "Topper Name"}
                </div>
                <div className="text-muted small">
                  Score - {report.topperScore || "--"}
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="border rounded p-3 bg-light shadow-sm h-100">
                <div className="fw-bold text-secondary">2nd</div>
                <div className="fs-5 text-capitalize">
                  {report.secondName || "Second Name"}
                </div>
                <div className="text-muted small">
                  Score - {report.secondScore || "--"}
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="border rounded p-3 bg-light shadow-sm h-100">
                <div className="fw-bold text-secondary">3rd</div>
                <div className="fs-5 text-capitalize">
                  {report.thirdName || "Third Name"}
                </div>
                <div className="text-muted small">
                  Score - {report.thirdScore || "--"}
                </div>
              </div>
            </div>
          </div>

          {/* Full Rank Table */}
          <div className="table-responsive px-3 mt-4">
            <table className="table table-bordered bg-white shadow-sm rounded">
              <thead className="bg-light">
                <tr>
                  <th>#</th>
                  <th>Learner Name</th>
                  <th className="text-end">Score</th>
                </tr>
              </thead>
              <tbody>
                {(report.rankBoard || []).slice(0, 10).map((student, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td className="text-capitalize">{student.name}</td>
                    <td className="text-end">{student.score}</td>
                  </tr>
                ))}
                <tr className="table-active">
                  <td>{report.rank}</td>
                  <td className="text-danger fw-bold">You</td>
                  <td className="text-end fw-bold">{report.score}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 📈 Accuracy Chart */}
        <div className="container mt-5 px-0">
          <h6 className="fw-semibold mb-3 px-3">
            Accuracy - You Vs Topper Vs Average
          </h6>
          <div style={{ height: "700px", width: "100%" }}>
            <Bar
              data={{
                labels: ["Topper", "Average", "You"],
                datasets: [
                  {
                    label: "Accuracy (%)",
                    data: [
                      parseFloat(report.topperAccuracy || 0),
                      parseFloat(report.averageAccuracy || 0),
                      parseFloat(report.yourAccuracy || 0),
                    ],
                    backgroundColor: ["#28a745", "#ffc107", "#007bff"],
                    barThickness: 25,
                  },
                ],
              }}
              options={{
                responsive: true,
                indexAxis: "y",
                plugins: {
                  legend: { display: false },
                },
                scales: {
                  x: {
                    min: 0,
                    max: 100,
                    title: { display: true, text: "Accuracy (%)" },
                  },
                },
              }}
            />
          </div>
          <div
            className="text-muted small  text-center"
            style={{ "margin-top": "-103px", "margin-bottom": "103px" }}
          >
            <span className="me-3 text-success">
              Topper: <strong>{report.topperAccuracy || 0}%</strong>
            </span>
            <span className="me-3 text-warning">
              Average: <strong>{report.averageAccuracy || 0}%</strong>
            </span>
            <span className="text-primary">
              You: <strong>{report.yourAccuracy || 0}%</strong>
            </span>
          </div>
        </div>

        {/* 🎯 Difficulty Level Breakdown */}
        <div className="container-fluid mt-5 px-0">
          {/* Header Row with Title and Button */}
          <div className="d-flex justify-content-between align-items-center px-3 mb-4">
            <h4 className="fw-bold text-primary mb-0">
              Difficulty Level Analysis
            </h4>
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() =>
                navigate(
                  `/report/${
                    lastSubmittedResultId || resultId
                  }/difficulty-analysis`
                )
              }
            >
              View Report →
            </button>
          </div>

          <div className="row g-3 px-3">
            {/* Pie Chart Section */}
            <div className="col-md-4">
              <div className="bg-white shadow-sm p-4 rounded text-center h-100">
                <h6 className="fw-semibold mb-3">Question Distribution</h6>
                <div style={{ height: 200, width: 200, margin: "0 auto" }}>
                  <Pie
                    data={{
                      labels: ["Easy", "Medium", "Intense"],
                      datasets: [
                        {
                          data: [
                            report.difficultyStats?.Easy || 0,
                            report.difficultyStats?.Medium || 0,
                            report.difficultyStats?.Intense || 0,
                          ],
                          backgroundColor: ["#28a745", "#ffc107", "#dc3545"],
                          borderWidth: 1,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: { legend: { display: false } },
                    }}
                  />
                </div>

                <p className="mt-3 fw-semibold">{formatTime(totalTimeSpent)}</p>
                <p className="text-muted small mb-1">Total Time Spent</p>
                <ul
                  className="list-unstyled small text-start mx-auto"
                  style={{ maxWidth: "180px" }}
                >
                  <li>
                    <span className="text-success">On Easy Questions:</span>{" "}
                    {Math.round(
                      ((report.difficultyStats?.Easy || 0) / totalMarks) * 100
                    )}
                    %
                  </li>
                  <li>
                    <span className="text-warning">On Medium Questions:</span>{" "}
                    {Math.round(
                      ((report.difficultyStats?.Medium || 0) / totalMarks) * 100
                    )}
                    %
                  </li>
                  <li>
                    <span className="text-danger">On Intense Questions:</span>{" "}
                    {Math.round(
                      ((report.difficultyStats?.Intense || 0) / totalMarks) *
                        100
                    )}
                    %
                  </li>
                </ul>
              </div>
            </div>

            {/* Bar Chart Section */}
            <div className="col-md-8">
              <div className="bg-white shadow-sm p-4 rounded h-100">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h6 className="fw-semibold mb-0">
                    Score In Difficulty Levels
                  </h6>
                  <div className="d-flex align-items-center gap-3">
                    <div className="small text-muted">
                      Total Marks <strong>{report.totalMarks}</strong>
                    </div>
                  </div>
                </div>

                <div style={{ height: "350px", width: "100%" }}>
                  <Bar
                    data={{
                      labels: ["Easy", "Medium", "Intense"],
                      datasets: [
                        {
                          label: "Marks Scored",
                          data: [
                            report.difficultyScore?.Easy || 0,
                            report.difficultyScore?.Medium || 0,
                            report.difficultyScore?.Intense || 0,
                          ],
                          backgroundColor: ["#28a745", "#ffc107", "#dc3545"],
                          barThickness: 25,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      indexAxis: "y",
                      plugins: { legend: { display: false } },
                      scales: {
                        x: {
                          beginAtZero: true,
                          max: totalMarks,
                          title: { display: true, text: "Questions" },
                        },
                      },
                    }}
                  />
                </div>

                <div className="d-flex justify-content-center gap-4 text-muted small mt-3">
                  <span className="text-success">
                    🟩 Easy {report.difficultyScore?.Easy || 0}
                  </span>
                  <span className="text-warning">
                    🟨 Medium {report.difficultyScore?.Medium || 0}
                  </span>
                  <span className="text-danger">
                    🟥 Intense {report.difficultyScore?.Intense || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Summary */}
          <p className="text-muted mt-4 text-center small">
            You have scored{" "}
            <strong>{report.difficultyScore?.Easy || 0} marks</strong> with easy
            level questions, scored{" "}
            <strong>{report.difficultyScore?.Medium || 0} marks</strong> with
            medium level questions, and scored{" "}
            <strong>{report.difficultyScore?.Intense || 0} marks</strong> with
            intense questions.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center p-4">
      <h2 className="mb-3">Submit Quiz</h2>
      <div className="mb-2">
        <strong>Total Questions:</strong> {realQuestions?.length || 0}
      </div>
      <div className="mb-2">
        <strong>Score:</strong> {score}
      </div>
      <div className="mb-2">
        <strong>Answered:</strong> {answered}
      </div>
      <div className="mb-2">
        <strong>Skipped:</strong> {skippedBeforeSubmit}
      </div>
      <div className="mb-3">
        <strong>Marked for Review:</strong> {marked}
      </div>

      <button onClick={handleFinishTest} className="btn btn-success me-2">
        ✅ Confirm Submit
      </button>
      <button
        onClick={() => {
          setShowSummaryBeforeSubmit(false);
          navigate(`/test-overview/${test?._id || testId}`);
        }}
        className="btn btn-outline-secondary"
      >
        Cancel
      </button>
    </div>
  );
};

export default FullReportPage;
