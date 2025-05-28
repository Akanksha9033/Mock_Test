// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import { Bar } from "react-chartjs-2";
// import { useNavigate } from "react-router-dom";
// import {
//   Chart as ChartJS,
//   BarElement,
//   CategoryScale,
//   LinearScale,
//   Tooltip,
//   Legend,
// } from "chart.js";

// const navigate = useNavigate();
// ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

// const REACT_APP_API_URL = "https://mocktest-ljru.onrender.com";

// const ScoreTimeReportPage = () => {
//   const { resultId } = useParams();
//   const [report, setReport] = useState(null);

//   useEffect(() => {
//     const fetchReport = async () => {
//       try {
//         const res = await axios.get(`${REACT_APP_API_URL}/api/results/${resultId}`);
//         setReport(res.data);
//       } catch (err) {
//         console.error("Error loading report:", err);
//       }
//     };
//     fetchReport();
//   }, [resultId]);

//   if (!report) return <div className="text-center mt-5">Loading Report...</div>;

//   const { totalMarks, correct, incorrect, skipped, detailedAnswers = [], questionTimeSpent = {} } = report;

//   const questions = detailedAnswers.map((ans, idx) => `Q${idx + 1}`);
//   const barData = detailedAnswers.map((ans) => {
//     const qid = ans.questionId;
//     const time = questionTimeSpent[qid] || 0;
//     return {
//       time: time / 60, // convert to minutes
//       status: ans.isCorrect ? "Correct" : (ans.selectedAnswer ? "Incorrect" : "Skipped")
//     };
//   });

//   const data = {
//     labels: questions,
//     datasets: [{
//       label: "Time Taken",
//       data: barData.map((d) => d.time),
//       backgroundColor: barData.map((d) =>
//         d.status === "Correct" ? "#28a745" : d.status === "Incorrect" ? "#dc3545" : "#adb5bd"
//       ),
//       barThickness: 10,
//     }]
//   };

//   const options = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: { display: false }
//     },
//     scales: {
//       x: {
//         title: { display: true, text: "Questions" },
//         ticks: { autoSkip: false },
//       },
//       y: {
//         title: { display: true, text: "Time (Minutes)" },
//         beginAtZero: true,
//       }
//     }
//   };

//   const totalTime = Object.values(questionTimeSpent || {}).reduce((sum, sec) => sum + sec, 0);

//   return (
//     <div className="container mt-5">
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <h3 className="fw-bold text-primary">Score & Time Analysis</h3>
//         <button className="btn btn-primary" onClick={() => navigate(`/solution/${resultId}`, "_blank")}>
//           VIEW SOLUTION →
//         </button>
//       </div>

//       <div className="mb-3">
//         <span className="me-3">Questions <strong>{totalMarks}</strong></span>
//         <span className="me-3">Correct <strong>{correct}</strong></span>
//         <span className="me-3">Incorrect <strong>{incorrect}</strong></span>
//         <span className="me-3">Skipped <strong>{skipped}</strong></span>
//         <span className="me-3">Score <strong>{report.score}</strong></span>
//         <span>Time Taken <strong>{(totalTime / 60).toFixed(2)} min</strong></span>
//       </div>

//       <h6 className="mb-3 fw-semibold">Correct Answer & Time Taken Plotting</h6>
//       <div style={{ height: "350px", overflowX: "scroll" }}>
//         <Bar data={data} options={options} />
//       </div>

//       <div className="mt-3 small">
//         <span className="me-3"><span className="badge bg-success"> </span> Time For Correct Answer</span>
//         <span className="me-3"><span className="badge bg-danger"> </span> Time For Incorrect Answer</span>
//         <span><span className="badge bg-secondary"> </span> Time For Skipped Answer</span>
//       </div>
//     </div>
//   );
// };

// export default ScoreTimeReportPage;




import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

// const REACT_APP_API_URL = "https://mocktest-ljru.onrender.com";
const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

const ScoreTimeReportPage = () => {
  const { resultId } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await axios.get(`${REACT_APP_API_URL}/api/results/${resultId}`);
        setReport(res.data);
      } catch (err) {
        console.error("Error loading report:", err);
      }
    };
    fetchReport();
  }, [resultId]);

  if (!report) return <div className="text-center mt-5">Loading Report...</div>;

  const {
    totalMarks,
    correct,
    incorrect,
    skipped,
    detailedAnswers = [],
    questionTimeSpent = {}
  } = report;

  const questions = detailedAnswers.map((ans, idx) => `Q${idx + 1}`);
  const barData = detailedAnswers.map((ans) => {
    const qid = ans.questionId;
    const time = questionTimeSpent[qid] || 0;
    return {
      time: time / 60,
      status: ans.isCorrect ? "Correct" : (ans.selectedAnswer ? "Incorrect" : "Skipped")
    };
  });

  const data = {
    labels: questions,
    datasets: [{
      label: "Time Taken",
      data: barData.map((d) => d.time),
      backgroundColor: barData.map((d) =>
        d.status === "Correct" ? "#28a745" :
        d.status === "Incorrect" ? "#dc3545" :
        "#adb5bd"
      ),
      barThickness: 10,
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      x: {
        title: { display: true, text: "Questions" },
        ticks: { autoSkip: false },
      },
      y: {
        title: { display: true, text: "Time (Minutes)" },
        beginAtZero: true,
      }
    }
  };

  const totalTime = Object.values(questionTimeSpent || {}).reduce((sum, sec) => sum + sec, 0);

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold text-primary">Score & Time Analysis</h3>
        <button
          className="btn btn-primary"
          onClick={() => navigate(`/solution/${resultId}`)}
        >
          VIEW SOLUTION →
        </button>
      </div>

      <div className="mb-3">
        <span className="me-3">Questions <strong>{totalMarks}</strong></span>
        <span className="me-3">Correct <strong>{correct}</strong></span>
        <span className="me-3">Incorrect <strong>{incorrect}</strong></span>
        <span className="me-3">Skipped <strong>{skipped}</strong></span>
        <span className="me-3">Score <strong>{report.score}</strong></span>
        <span>Time Taken <strong>{(totalTime / 60).toFixed(2)} min</strong></span>
      </div>

      <h6 className="mb-3 fw-semibold">Correct Answer & Time Taken Plotting</h6>
      <div style={{ height: "350px", overflowX: "scroll" }}>
        <Bar data={data} options={options} />
      </div>

      <div className="mt-3 small">
        <span className="me-3">
          <span className="badge bg-success"> </span> Time For Correct Answer
        </span>
        <span className="me-3">
          <span className="badge bg-danger"> </span> Time For Incorrect Answer
        </span>
        <span>
          <span className="badge bg-secondary"> </span> Time For Skipped Answer
        </span>
      </div>
    </div>
  );
};

export default ScoreTimeReportPage;
