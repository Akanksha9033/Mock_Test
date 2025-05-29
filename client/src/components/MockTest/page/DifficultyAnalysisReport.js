import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import LoadingAnimation from "../../LoadingAnimation";

const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

const DifficultlyAnalysisReport = () => {
  const navigate = useNavigate();
  const { resultId } = useParams();

  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);

 useEffect(() => {
  const fetchResult = async () => {
    try {
      const res = await axios.get(`${REACT_APP_API_URL}/api/results/${resultId}`);
      setResult(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching result:", error);
      setLoading(false);
    }
  };
  fetchResult();
}, [resultId]);


  if (loading || !result) {
    return <div className="container mt-4"><LoadingAnimation /></div>;
  }

  const totalScore = result.score || 0;
  const detailedAnswers = result.detailedAnswers || [];

  const difficultyStats = {
    Easy: { score: 0, timeSpent: 0, questions: [] },
    Medium: { score: 0, timeSpent: 0, questions: [] },
    Intense: { score: 0, timeSpent: 0, questions: [] },
  };

  const questionStatus = {};

  detailedAnswers.forEach((ans) => {
    const difficulty = ans.difficulty || "Medium";
    const qId = ans.questionId;
    const isCorrect = ans.isCorrect;
    const timeSpent = result.questionTimeSpent?.[qId] || 0;

    difficultyStats[difficulty] = difficultyStats[difficulty] || {
      score: 0,
      timeSpent: 0,
      questions: [],
    };

    if (isCorrect) difficultyStats[difficulty].score += 1;
    difficultyStats[difficulty].timeSpent += timeSpent / 60; // convert to minutes
    difficultyStats[difficulty].questions.push(qId);
    questionStatus[qId] = isCorrect ? "correct" : "incorrect";
  });

  const getColor = (status) => {
    if (status === "correct") return "#28a745";
    if (status === "incorrect") return "#dc3545";
    return "#ced4da";
  };

  const renderDifficultyBlock = (label, data) => (
    <div className="bg-white shadow-sm p-4 rounded mb-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="fw-semibold mb-0">{label}</h6>
        <div className="text-muted small fw-semibold">
          Questions <strong>{data.questions.length}</strong> • Score{" "}
          <strong>{data.score}</strong> • Time Spent{" "}
          <strong>{data.timeSpent.toFixed(2)} min</strong>
        </div>
      </div>
      <div className="d-flex flex-wrap gap-2">
        {data.questions.map((q, index) => (
          <div
            key={`${label}-${index}`}
            className="rounded-circle d-flex justify-content-center align-items-center"
            style={{
              width: 36,
              height: 36,
              backgroundColor: getColor(questionStatus[q]),
              color: "#fff",
              fontWeight: "bold",
            }}
          >
            {index + 1}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="fw-bold">Difficulty Level Analysis</h3>
        <button
          className="btn btn-primary"
          onClick={() => navigate(`/solution/${resultId}`)}
        >
          VIEW SOLUTION
        </button>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <select className="form-select w-auto" defaultValue="Filter By">
          <option>Filter By</option>
        </select>
        <div className="text-muted fw-semibold">
          Total Score <strong>{totalScore}</strong> • Score in Easy{" "}
          <strong>{difficultyStats.Easy.score}</strong> • Score in Medium{" "}
          <strong>{difficultyStats.Medium.score}</strong> • Score in Intense{" "}
          <strong>{difficultyStats.Intense.score}</strong>
        </div>
      </div>

      {renderDifficultyBlock("Easy", difficultyStats.Easy)}
      {renderDifficultyBlock("Medium", difficultyStats.Medium)}
      {renderDifficultyBlock("Intense", difficultyStats.Intense)}
    </div>
  );
};

export default DifficultlyAnalysisReport;
