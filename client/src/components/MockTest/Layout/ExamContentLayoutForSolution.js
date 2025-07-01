import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../styles/ExamContentLayout.css";

 
const ExamContentLayoutForSolution = ({
  test,
  testId,
  answers,
  currentQuestionIndex,
  setCurrentQuestionIndex,
}) => {
  const navigate = useNavigate();
  const [showExplanation, setShowExplanation] = useState(false);
 
  const questions = test?.questions || [];
  const currentQuestion = questions[currentQuestionIndex];


  
  // 🔍 Debug logs
  console.log("🧪 test.isPaused:", test?.isPaused);
  console.log("📍 currentQuestionIndex:", currentQuestionIndex);
  console.log("📋 currentQuestion:", currentQuestion);
 
  if (!currentQuestion) {
    return <div style={{ padding: "2rem", textAlign: "center" }}>Loading solution...</div>;
  }
 
  const selectedOption = answers[currentQuestion._id]?.selectedOption;
  const correctAnswer = answers[currentQuestion._id]?.correctAnswer;
  const isCorrect = answers[currentQuestion._id]?.isCorrect;

  console.log("🧠 Selected Option:", selectedOption);
console.log("✅ Correct Answer:", correctAnswer);
console.log("🎯 Is Correct:", isCorrect);

 
  const normalizeArray = (v) => {
    if (Array.isArray(v)) {
      if (v.length === 1 && typeof v[0] === 'string' && v[0].includes(',')) {
        console.log('💥 Backend sent combined string in array → splitting:', v[0]);
        return v[0].split(',').map(s => s.trim());
      }
      return v.map(String);
    }
    if (typeof v === 'string' && v.includes(',')) {
      console.log('💥 Backend sent combined string → splitting:', v);
      return v.split(',').map(s => s.trim());
    }
    return [String(v)];
  };
 
 
  const getOptionStyle = (opt, idx) => {
    const val = String.fromCharCode(65 + idx);
    const selectedArr = normalizeArray(selectedOption);
    const correctArr = normalizeArray(correctAnswer);
 
    const isSelected = selectedArr.includes(val);
    const isCorrectOption = correctArr.includes(val);
 
    console.log('💥 DEBUG → val:', val, '| selectedArr:', selectedArr, '| correctArr:', correctArr, '| isSelected:', isSelected, '| isCorrectOption:', isCorrectOption);
 
    if (isSelected && isCorrectOption) return 'option-box correct';
    if (isSelected && !isCorrectOption) return 'option-box incorrect';
    if (!isSelected && isCorrectOption) return 'option-box highlight-correct';
    return 'option-box';
  };
 
 
  const renderOptions = () => {
    if (currentQuestion.questionType === "Drag and Drop") {
      const correctPairs = {};
      (currentQuestion.definitions || []).forEach(def => {
        if (def && def.text && def.match) correctPairs[def.text] = def.match;
      });
 
      const studentPairs = selectedOption || {};
 
      return (
        <div className="drag-drop-solution-edzest">
          <h3 className="section-title">Your Attempt</h3>
          {(currentQuestion.definitions || []).map((def, idx) => {
            const userMatch = studentPairs[def.text] || "--";
            const correctMatch = correctPairs[def.text] || "--";
            const isCorrect = userMatch === correctMatch;
            return (
              <div key={idx} className={`match-card ${isCorrect ? "correct" : "incorrect"}`}>
                <div className="left-box">{def.text}</div>
                <div className="arrow">→</div>
                <div className="right-box">{userMatch}</div>
                <div className="icon">{isCorrect ? "✔️" : "❌"}</div>
              </div>
            );
          })}
 
          <h3 className="section-title">Correct Matches:</h3>
          {(currentQuestion.definitions || []).map((def, idx) => (
            <div key={`c-${idx}`} className="match-card readonly">
              <div className="left-box">{def.text}</div>
              <div className="arrow">→</div>
              <div className="right-box">{correctPairs[def.text]}</div>
            </div>
          ))}
        </div>
      );
    }
 
    if (Array.isArray(currentQuestion.options)) {
      return (
        <div className="options-container">
          {currentQuestion.options.map((opt, idx) => {
            const label = String.fromCharCode(65 + idx);
            const display = typeof opt === "string" ? opt : opt.text;
            return (
              <div key={idx} className={getOptionStyle(opt, idx)}>
                <strong>{label}.</strong> {display}
              </div>
            );
          })}
        </div>
      );
    }
 
    return null;
  };
 
  return (
    <div className="exam-container">
      <div className="exam-content">
        <div className="question-header">
          <h2>{test.title}</h2>
          <div className="question-info">
            <p><strong>Question Type:</strong> {currentQuestion.questionType || "Single-Select"}</p>
            <p><strong>Marks:</strong> {currentQuestion.marks || 1}</p>
            <p><strong>Time:</strong> {test.time || "--"} minutes</p>
          </div>
        </div>
 
        <div className="row">
          <div className={showExplanation ? "col-md-7" : "col-md-12"}>
            <div className="question-box">
              <h3>Q{currentQuestionIndex + 1}: {currentQuestion.question}</h3>
              {renderOptions()}
 
              <button
                className="explanation-toggle bg"
                onClick={() => setShowExplanation((prev) => !prev)}
              >
                {showExplanation ? "➤ Hide Explanation" : "Explanation ➤ "}
              </button>
            </div>
 
            <div className="nav-buttons">
              <button
                disabled={currentQuestionIndex === 0 || test?.isPaused === "true" || test?.isPaused === true}

                onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
              >Previous</button>
             {currentQuestionIndex !== questions.length - 1 && (
              <button onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}>
                Next
              </button>
            )}

            </div>
          </div>
 
          {showExplanation && (
            <div className="col-md-5">
              <div className="explanation-panel">
                <div className="d-flex justify-content-between align-items-center">
                  <h5><span style={{ color: "#e53935" }}></span> Answer Explanation</h5>
                  <button className="btn btn-sm btn-light" onClick={() => setShowExplanation(false)}>X</button>
                </div>
                <hr />
                {currentQuestion.questionType === "Drag and Drop" ? (
                  <div>
                    <p><strong>Explanation (Correct Matches):</strong></p>
                    <ul>
                      {(currentQuestion.definitions || []).map((def, idx) => (
                        <li key={idx}>{def.text} → {def.match}</li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p>{currentQuestion.explanation || "No explanation provided."}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
 
      <div className="exam-sidebar">
        <div className="navigator">
          <h4>Question Navigator</h4>
          <div className="navigator-buttons">
            {questions.map((_, index) => {
              const qId = questions[index]._id;
              const a = answers[qId];
              let className = "navigator-btn";
              if (a?.selectedOption) {
                className += a.isCorrect ? " green" : " red";
              }
              return (
                <button
                  key={index}
                  className={`${className} ${index === currentQuestionIndex ? "active" : ""}`}
                  onClick={() => setCurrentQuestionIndex(index)}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
        </div>
 
        <div className="status-legend">
          <h4>Status Legend</h4>
          <ul>
            <li><span className="dot green"></span> Correct</li>
            <li><span className="dot red"></span> Incorrect</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
 
export default ExamContentLayoutForSolution;