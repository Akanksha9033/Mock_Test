// import React, { useState } from "react";

// const QuestionOptions = ({
//   currentQuestion,
//   answers,
//   handleAnswerSelect,
//   isEditing = false,
//   editedQuestion,
//   setEditedQuestion,
// }) => {
//   const [draggedTerm, setDraggedTerm] = useState(null);
//   const [matchedPairs, setMatchedPairs] = useState({});

//   const questionData = isEditing ? editedQuestion : currentQuestion;

//   const handleDrop = (defText) => {
//     if (draggedTerm) {
//       const updatedPairs = { ...matchedPairs, [defText]: draggedTerm };
//       setMatchedPairs(updatedPairs);

//       const correctPairs = questionData.answer || {};
//       let isCorrect = true;

//       for (const def in correctPairs) {
//         if (updatedPairs[def] !== correctPairs[def]) {
//           isCorrect = false;
//           break;
//         }
//       }

//       if (
//         Object.keys(updatedPairs).length === Object.keys(correctPairs).length
//       ) {
//         handleAnswerSelect(
//           currentQuestion._id,
//           updatedPairs,
//           correctPairs,
//           isCorrect
//         );
//       }

//       setDraggedTerm(null);
//     }
//   };

//   const renderDragAndDrop = () => {
//     const terms = questionData.terms || [];
//     const definitions = questionData.definitions || [];
//     const usedTerms = Object.values(matchedPairs);
//     const selectedMatches = answers[currentQuestion._id]?.selectedOption || {};
//     const correctPairs = answers[currentQuestion._id]?.correctAnswer || {};
//     const viewingSolutions = currentQuestion.viewingSolutions === true;

//     return (
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           gap: "2rem",
//           marginTop: "1rem",
//           flexWrap: "wrap",
//         }}
//       >
//         {/* Terms (draggable) */}
//         <div style={{ flex: 1 }}>
//           <h5>Terms</h5>
//           <div
//             style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
//           >
//             {terms
//               .filter((term) => !usedTerms.includes(term))
//               .map((term, idx) => (
//                 <div
//                   key={idx}
//                   draggable
//                   onDragStart={() => setDraggedTerm(term)}
//                   style={{
//                     padding: "12px",
//                     backgroundColor: "#ccc",
//                     borderRadius: "8px",
//                     textAlign: "center",
//                     cursor: "grab",
//                     fontWeight: 500,
//                   }}
//                 >
//                   {term}
//                 </div>
//               ))}
//           </div>
//         </div>

//         {/* Definitions (droppable) */}
//         <div style={{ flex: 1 }}>
//           <h5>Definitions</h5>
//           <div
//             style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
//           >
//             {definitions.map((def, idx) => {
//               const selectedTerm =
//                 matchedPairs[def.text] || selectedMatches?.[def.text];
//               const correctTerm = correctPairs?.[def.text];

//               let bgColor = "#f5f5f5";
//               if (viewingSolutions && selectedTerm) {
//                 if (selectedTerm === correctTerm) {
//                   bgColor = "#d4edda"; // green
//                 } else {
//                   bgColor = "#f8d7da"; // red
//                 }
//               }

//               return (
//                 <div
//                   key={idx}
//                   onDragOver={(e) => e.preventDefault()}
//                   onDrop={() => handleDrop(def.text)}
//                   style={{
//                     padding: "12px",
//                     backgroundColor: bgColor,
//                     borderRadius: "8px",
//                     textAlign: "center",
//                     minHeight: "50px",
//                     border: "1px solid #ccc",
//                     fontWeight: 500,
//                   }}
//                 >
//                   {def.text}
//                   {selectedTerm && (
//                     <div
//                       style={{
//                         marginTop: "8px",
//                         fontWeight: "bold",
//                         color: "#333",
//                       }}
//                     >
//                       → {selectedTerm}
//                     </div>
//                   )}
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </div>
//     );
//   };

//   const renderSingleSelect = () => {
//     const options = questionData.options || [];
//     const selected = answers[currentQuestion._id]?.selectedOption;
//     const isCorrect = answers[currentQuestion._id]?.isCorrect;
//     const correctAnswer = answers[currentQuestion._id]?.correctAnswer?.[0];
//     const viewingSolutions = currentQuestion.viewingSolutions === true;

//     return options.map((opt, idx) => {
//       const val = String.fromCharCode(65 + idx);
//       const isSelected = selected === val;
//       const isThisCorrect = opt.text === correctAnswer;

//       let className = "p-2 border rounded my-2 bg-light";

//       if (viewingSolutions) {
//         if (isSelected && isCorrect) {
//           className = "p-2 border rounded my-2 bg-success text-white";
//         } else if (isSelected && !isCorrect) {
//           className = "p-2 border rounded my-2 bg-danger text-white";
//         } else if (!isSelected && isThisCorrect) {
//           className = "p-2 border rounded my-2 bg-success text-white";
//         }
//       } else if (isSelected) {
//         className = "p-2 border rounded my-2 bg-primary text-white";
//       }

//       return (
//         <div
//           key={idx}
//           className={className}
//           onClick={() => {
//             if (!viewingSolutions) {
//               handleAnswerSelect(currentQuestion._id, val);
//             }
//           }}
//           style={{ cursor: viewingSolutions ? "default" : "pointer" }}
//         >
//           {val}. {opt.text}
//         </div>
//       );
//     });
//   };

//   const renderMultiSelect = () => {
//     const options = questionData.options || [];
//     const selected = answers[currentQuestion._id]?.selectedOption || [];
//     const correctAnswers = answers[currentQuestion._id]?.correctAnswer || [];
//     const viewingSolutions = currentQuestion.viewingSolutions === true;

//     return options.map((opt, idx) => {
//       const val = String.fromCharCode(65 + idx);
//       const isSelected = selected.includes(val);
//       const isCorrectOption = correctAnswers.includes(val);

//       let className = "p-2 border rounded my-2 bg-light";

//       if (viewingSolutions) {
//         if (isSelected && isCorrectOption) {
//           className = "p-2 border rounded my-2 bg-success text-white";
//         } else if (isSelected && !isCorrectOption) {
//           className = "p-2 border rounded my-2 bg-danger text-white";
//         } else if (!isSelected && isCorrectOption) {
//           className = "p-2 border rounded my-2 bg-success text-white";
//         }
//       } else if (isSelected) {
//         className = "p-2 border rounded my-2 bg-primary text-white";
//       }

//       return (
//         <div
//           key={idx}
//           className={className}
//           onClick={() => {
//             if (!viewingSolutions) {
//               const updated = isSelected
//                 ? selected.filter((v) => v !== val)
//                 : [...selected, val];
//               handleAnswerSelect(currentQuestion._id, updated);
//             }
//           }}
//           style={{ cursor: viewingSolutions ? "default" : "pointer" }}
//         >
//           {val}. {opt.text}
//         </div>
//       );
//     });
//   };

//   if (questionData.questionType === "Drag and Drop") return renderDragAndDrop();
//   if (questionData.questionType === "Multi-Select") return renderMultiSelect();

//   return renderSingleSelect();
// };

// export default QuestionOptions;

import React, { useState } from "react";

const QuestionOptions = ({
  currentQuestion,
  answers,
  handleAnswerSelect,
  isEditing = false,
  editedQuestion,
  setEditedQuestion,
}) => {
  const [draggedTerm, setDraggedTerm] = useState(null);
  const [matchedPairs, setMatchedPairs] = useState({});

  const questionData = isEditing ? editedQuestion : currentQuestion;

  const handleDrop = (defText) => {
    if (draggedTerm) {
      const updatedPairs = { ...matchedPairs, [defText]: draggedTerm };
      setMatchedPairs(updatedPairs);

      const correctPairs = questionData.answer || {};
      let isCorrect = true;

      for (const def in correctPairs) {
        if (updatedPairs[def] !== correctPairs[def]) {
          isCorrect = false;
          break;
        }
      }

      if (
        Object.keys(updatedPairs).length === Object.keys(correctPairs).length
      ) {
        handleAnswerSelect(
          currentQuestion._id,
          updatedPairs,
          correctPairs,
          isCorrect
        );
      }

      setDraggedTerm(null);
    }
  };

  const renderDragAndDrop = () => {
    const terms = questionData.terms || [];
    const definitions = questionData.definitions || [];
    const usedTerms = Object.values(matchedPairs);
    const selectedMatches = answers[currentQuestion._id]?.selectedOption || {};
    const correctPairs = answers[currentQuestion._id]?.correctAnswer || {};
    const viewingSolutions = currentQuestion.viewingSolutions === true;

    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "2rem",
          marginTop: "1rem",
          flexWrap: "wrap",
        }}
      >
        {/* Terms (draggable) */}
        <div style={{ flex: 1 }}>
          <h5>Terms</h5>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            {terms
              .filter((term) => !usedTerms.includes(term))
              .map((term, idx) => (
                <div
                  key={idx}
                  draggable
                  onDragStart={() => setDraggedTerm(term)}
                  style={{
                    padding: "12px",
                    backgroundColor: "#ccc",
                    borderRadius: "8px",
                    textAlign: "center",
                    cursor: "grab",
                    fontWeight: 500,
                  }}
                >
                  {term}
                </div>
              ))}
          </div>
        </div>

        {/* Definitions (droppable) */}
        <div style={{ flex: 1 }}>
          <h5>Definitions</h5>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            {definitions.map((def, idx) => {
              const selectedTerm =
                matchedPairs[def.text] || selectedMatches?.[def.text];
              const correctTerm = correctPairs?.[def.text];

              let bgColor = "#f5f5f5";
              if (viewingSolutions && selectedTerm) {
                if (selectedTerm === correctTerm) {
                  bgColor = "#d4edda"; // green
                } else {
                  bgColor = "#f8d7da"; // red
                }
              }

              return (
                <div
                  key={idx}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop(def.text)}
                  style={{
                    padding: "20px",
                    backgroundColor: bgColor,
                    borderRadius: "8px",
                    textAlign: "center",
                    minHeight: "50px",
                    border: "1px solid #ccc",
                    fontWeight: "bold",
                    fontSize: "16px",
                  }}
                >
                  {selectedTerm ? selectedTerm : def.text}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderSingleSelect = () => {
    const options = questionData.options || [];
    const selected = answers[currentQuestion._id]?.selectedOption;
    const isCorrect = answers[currentQuestion._id]?.isCorrect;
    const correctAnswer = answers[currentQuestion._id]?.correctAnswer?.[0];
    const viewingSolutions = currentQuestion.viewingSolutions === true;

    return options.map((opt, idx) => {
      const val = String.fromCharCode(65 + idx);
      const isSelected = selected === val;
      const isThisCorrect = opt.text === correctAnswer;

      let className = "p-2 border rounded my-2 bg-light";

      if (viewingSolutions) {
        if (isSelected && isCorrect) {
          className = "p-2 border rounded my-2 bg-success text-white";
        } else if (isSelected && !isCorrect) {
          className = "p-2 border rounded my-2 bg-danger text-white";
        } else if (!isSelected && isThisCorrect) {
          className = "p-2 border rounded my-2 bg-success text-white";
        }
      } else if (isSelected) {
        className = "p-2 border rounded my-2 bg-primary text-white";
      }
      
      // if (isSelected) {
      //   console.log(
      //     `🔍 Single-Select → Option ${val} clicked | Text: ${opt.text}`
      //   );
      //   console.log(`✅ Is this option correct? → ${isThisCorrect}`);
      // }
      

      return (
        <div
          key={idx}
          className={className}
          onClick={() => {
            if (!viewingSolutions) {
              handleAnswerSelect(currentQuestion._id, val);
            }
          }}
          style={{ cursor: viewingSolutions ? "default" : "pointer" }}
        >
          {val}. {opt.text}
        </div>
      );
    });
  };

  const renderMultiSelect = () => {
    const options = questionData.options || [];
    const selected = answers[currentQuestion._id]?.selectedOption || [];
    const correctAnswers = answers[currentQuestion._id]?.correctAnswer || [];
    const viewingSolutions = currentQuestion.viewingSolutions === true;

    return options.map((opt, idx) => {
      const val = String.fromCharCode(65 + idx);
      const isSelected = selected.includes(val);
      const isCorrectOption = correctAnswers.includes(val);

      let className = "p-2 border rounded my-2 bg-light";

      if (viewingSolutions) {
        if (isSelected && isCorrectOption) {
          className = "p-2 border rounded my-2 bg-success text-white";
        } else if (isSelected && !isCorrectOption) {
          className = "p-2 border rounded my-2 bg-danger text-white";
        } else if (!isSelected && isCorrectOption) {
          className = "p-2 border rounded my-2 bg-success text-white";
        }
      } else if (isSelected) {
        className = "p-2 border rounded my-2 bg-primary text-white";
      }

      return (
        <div
          key={idx}
          className={className}
          onClick={() => {
            if (!viewingSolutions) {
              const updated = isSelected
                ? selected.filter((v) => v !== val)
                : [...selected, val];
              handleAnswerSelect(currentQuestion._id, updated);
            }
          }}
          style={{ cursor: viewingSolutions ? "default" : "pointer" }}
        >
          {val}. {opt.text}
        </div>
      );
    });
  };

  if (questionData.questionType === "Drag and Drop") return renderDragAndDrop();
  if (questionData.questionType === "Multi-Select") return renderMultiSelect();

  return renderSingleSelect();
};

export default QuestionOptions;

