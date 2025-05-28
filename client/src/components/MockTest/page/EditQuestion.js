// const EditQuestion = ({
//     editedQuestion,
//     setEditedQuestion,
//     handleSave,
//     setEditingQuestion,
//   }) => {
//     if (!editedQuestion) return null;
  
//     // DEBUG
//     console.log("🟡 editedQuestion object:", editedQuestion);
  
//     const handleEditChange = (e) => {
//       const { name, value } = e.target;
//       setEditedQuestion({
//         ...editedQuestion,
//         [name]: name === "questionNumber" ? Number(value) || "" : value,
//       });
//     };
  
//     const handleOptionChange = (e, index) => {
//       const { value } = e.target;
//       const updatedOptions = [...(editedQuestion.options || [])];
//       updatedOptions[index] = { ...updatedOptions[index], text: value };
//       setEditedQuestion({
//         ...editedQuestion,
//         options: updatedOptions,
//       });
//     };
  
//     const handleCorrectAnswerChange = (e) => {
//       const { value } = e.target;
//       console.log("🟢 Selected Correct Answer:", value);
//       setEditedQuestion({
//         ...editedQuestion,
//         answer: value,
//       });
//     };
  
//     return (
//       <>
//         <input
//           type="number"
//           name="questionNumber"
//           className="form-control mb-2"
//           value={editedQuestion.questionNumber || ""}
//           onChange={handleEditChange}
//           placeholder="Question Number"
//         />
//         <input
//           type="text"
//           name="question"
//           className="form-control mb-2"
//           value={editedQuestion.question || ""}
//           onChange={handleEditChange}
//           placeholder="Enter Question"
//         />
  
//         {/* 🔵 Terms Debug */}
//         {Array.isArray(editedQuestion.terms) &&
//           editedQuestion.terms.map((term, index) => (
//             <input
//               key={`term-${index}`}
//               type="text"
//               className="form-control mb-2"
//               value={term || ""}
//               onChange={(e) => {
//                 const updatedTerms = [...editedQuestion.terms];
//                 updatedTerms[index] = e.target.value;
//                 console.log("🔵 Updated Terms:", updatedTerms);
//                 setEditedQuestion({ ...editedQuestion, terms: updatedTerms });
//               }}
//               placeholder={`Term ${index + 1}`}
//             />
//           ))}
  
//         {/* 🔴 Definitions Debug */}
//         {Array.isArray(editedQuestion.definitions) &&
//           editedQuestion.definitions.map((definition, index) => (
//             <input
//               key={`definition-${index}`}
//               type="text"
//               className="form-control mb-2"
//               value={definition.text || definition || ""}
//               onChange={(e) => {
//                 const updatedDefinitions = [...editedQuestion.definitions];
//                 if (typeof updatedDefinitions[index] === "object") {
//                   updatedDefinitions[index] = {
//                     ...updatedDefinitions[index],
//                     text: e.target.value,
//                   };
//                 } else {
//                   updatedDefinitions[index] = { text: e.target.value };
//                 }
//                 console.log("🔴 Updated Definitions:", updatedDefinitions);
//                 setEditedQuestion({
//                   ...editedQuestion,
//                   definitions: updatedDefinitions,
//                 });
//               }}
//               placeholder={`Definition ${index + 1}`}
//             />
//           ))}
  
//         {/* 🟣 Drag-and-Drop Correct Answer */}
//         {editedQuestion.type === "drag-and-drop" &&
//   Array.isArray(editedQuestion.terms) &&
//   editedQuestion.terms.map((term, index) => (
//     <div key={`term-answer-${index}`} className="mb-2">
//       <label><strong>{term}</strong> - Select Match</label>
//       <select
//         className="form-control"
//         value={editedQuestion.answer?.[index] || ""}
//         onChange={(e) => {
//           const updatedAnswers = [...(editedQuestion.answer || [])];
//           updatedAnswers[index] = e.target.value;
//           setEditedQuestion({
//             ...editedQuestion,
//             answer: updatedAnswers,
//           });
//         }}
//       >
//         <option value="">Select Correct Match</option>
//         {Array.isArray(editedQuestion.definitions) &&
//           editedQuestion.definitions.map((definition, defIndex) => (
//             <option key={defIndex} value={definition.match}>
//               {definition.match} - {definition.text}
//             </option>
//           ))}
//       </select>
//     </div>
// ))}


  
//         {/* 🟠 Multiple Choice Options */}
//         {Array.isArray(editedQuestion.options) &&
//           editedQuestion.options.map((option, index) => (
//             <input
//               key={index}
//               type="text"
//               className="form-control mb-2"
//               value={option.text || ""}
//               onChange={(e) => handleOptionChange(e, index)}
//               placeholder={`Option ${String.fromCharCode(65 + index)}`}
//             />
//           ))}
  
//         {/* Correct Answer for MCQ */}
//         <select
//           className="form-control mb-2"
//           value={editedQuestion.answer || ""}
//           onChange={handleCorrectAnswerChange}
//         >
//           <option value="">Select Correct Answer</option>
//           {Array.isArray(editedQuestion.options) &&
//             editedQuestion.options.map((_, index) => (
//               <option key={index} value={String.fromCharCode(65 + index)}>
//                 {String.fromCharCode(65 + index)}
//               </option>
//             ))}
//         </select>
  
//         {/* Explanation */}
//         <textarea
//           name="explanation"
//           className="form-control mb-2"
//           value={editedQuestion.explanation || ""}
//           onChange={handleEditChange}
//           placeholder="Explanation (optional)"
//         />
  
//         <button
//           className="btn btn-success me-2"
//           onClick={() => {
//             console.log("💾 Saving Edited Question:", editedQuestion);
//             handleSave(editedQuestion);
//             setEditingQuestion(null);
//           }}
//         >
//           Save
//         </button>
//         <button
//           className="btn btn-secondary"
//           onClick={() => setEditingQuestion(null)}
//         >
//           Cancel
//         </button>
//       </>
//     );
//   };
  
//   export default EditQuestion;
  



const EditQuestion = ({
  editedQuestion,
  setEditedQuestion,
  handleSave,
  setEditingQuestion,
}) => {
  if (!editedQuestion) return null;

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedQuestion({
      ...editedQuestion,
      [name]: name === "questionNumber" ? Number(value) || "" : value,
    });
  };

  const handleOptionChange = (e, index) => {
    const { value } = e.target;
    const updatedOptions = [...(editedQuestion.options || [])];
    updatedOptions[index] = {
      ...updatedOptions[index],
      label: String.fromCharCode(65 + index),
      text: value,
    };
    setEditedQuestion({
      ...editedQuestion,
      options: updatedOptions,
    });
  };
  
  
  const handleCorrectAnswerChange = (e) => {
    const { value } = e.target;
    setEditedQuestion({
      ...editedQuestion,
      answer: value,
    });
  };

  return (
    <>
      {/* Input for Question Number */}
      <input
        type="number"
        name="questionNumber"
        className="form-control mb-2"
        value={editedQuestion.questionNumber || ""}
        onChange={handleEditChange}
        placeholder="Question Number"
      />

      {/* Input for Question Text */}
      <input
        type="text"
        name="question"
        className="form-control mb-2"
        value={editedQuestion.question || ""}
        onChange={handleEditChange}
        placeholder="Enter Question"
      />

      {/* 🔵 Terms Input Fields */}
      {Array.isArray(editedQuestion.terms) &&
        editedQuestion.terms.map((term, index) => (
          <input
            key={`term-${index}`}
            type="text"
            className="form-control mb-2"
            value={term || ""}
            onChange={(e) => {
              const updatedTerms = [...editedQuestion.terms];
              updatedTerms[index] = e.target.value;
              setEditedQuestion({ ...editedQuestion, terms: updatedTerms });
            }}
            placeholder={`Term ${index + 1}`}
          />
        ))}

      {/* 🔴 Definitions Display Only (TOP SECTION - Read Only) */}
      {Array.isArray(editedQuestion.definitions) &&
        editedQuestion.definitions.map((definition, index) => (
          <div
            key={`definition-display-${index}`}
            className="form-control mb-2"
            style={{
              backgroundColor: "#f1f3f5",
              border: "1px solid #ced4da",
              pointerEvents: "none",
            }}
          >
            {typeof definition === "object"
              ? definition.text
              : definition}
          </div>
        ))}

      

      {/* 🟠 Options for MCQs */}
      {(editedQuestion.type !== "drag-and-drop" &&
        editedQuestion.questionType !== "Drag and Drop") &&
        Array.isArray(editedQuestion.options) &&
        editedQuestion.options.map((option, index) => (
          <div key={index} className="input-group mb-2">
            <span className="input-group-text">
              {String.fromCharCode(65 + index)}.
            </span>
            <input
              type="text"
              className="form-control"
              value={option.text || ""}
              onChange={(e) => handleOptionChange(e, index)}
              placeholder={`Option ${String.fromCharCode(65 + index)} - ${index + 1}`}
            />
          </div>
        ))}
          
          {editedQuestion.questionType === "Drag and Drop" && (
        <div style={{ marginTop: "20px" }}>
          <h4>Correct Match</h4>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {editedQuestion.definitions?.map((def, idx) => (
              <li
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "8px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  marginBottom: "8px",
                }}
              >
                <span style={{ flex: 1 }}>{def.text}</span>
                <input
                  type="text"
                  value={def.match || ""}
                  onChange={(e) => {
                    const updatedDefinitions = [...editedQuestion.definitions];
                    updatedDefinitions[idx] = {
                      ...updatedDefinitions[idx],
                      match: e.target.value,
                    };
                    setEditedQuestion({
                      ...editedQuestion,
                      definitions: updatedDefinitions,
                    });
                  }}
                  placeholder="Enter correct match"
                  className="form-control"
                  style={{ flex: 1 }}
                />
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Explanation for drag-and-drop */}
      {(editedQuestion.type === "drag-and-drop" ||
        editedQuestion.questionType === "Drag and Drop") && (
        <div className="row mb-3">
          <div className="col-12">
            <label className="form-label">
              <strong>Explanation</strong>
            </label>
            <textarea
              name="explanation"
              className="form-control"
              value={editedQuestion.explanation || ""}
              onChange={(e) =>
                setEditedQuestion((prev) => ({
                  ...prev,
                  explanation: e.target.value,
                }))
              }
              placeholder="Explain the logic behind matches..."
            />
          </div>
        </div>
      )}

      {/* Correct answer preview for MCQs */}
      {(editedQuestion.type !== "drag-and-drop" &&
        editedQuestion.questionType !== "Drag and Drop") &&
        editedQuestion.answer && (
          <div className="mb-2">
            <strong>Correct Answer: {editedQuestion.answer}</strong>
          </div>
        )}

      {/* Correct answer dropdown */}
      {(editedQuestion.type !== "drag-and-drop" &&
        editedQuestion.questionType !== "Drag and Drop") && (
        <select
          className="form-control mb-3"
          value={editedQuestion.answer || ""}
          onChange={handleCorrectAnswerChange}
        >
          <option value="">Select Correct Answer</option>
          {Array.isArray(editedQuestion.options) &&
            editedQuestion.options.map((_, index) => (
              <option key={index} value={String.fromCharCode(65 + index)}>
                {String.fromCharCode(65 + index)}
              </option>
            ))}
        </select>
      )}

      {/* Explanation for MCQs */}
      {(editedQuestion.type !== "drag-and-drop" &&
        editedQuestion.questionType !== "Drag and Drop") && (
        <>
          <label className="mb-1">
            <strong>Explanation:</strong>
          </label>
          <textarea
            name="explanation"
            className="form-control mb-3"
            value={editedQuestion.explanation || ""}
            onChange={handleEditChange}
            placeholder='Explanation: e.g. "Paris is the capital of France..."'
          />
        </>
      )}

      {/* Action Buttons */}
      <button
        className="btn btn-success me-2"
        onClick={() => {
          handleSave(editedQuestion);
          setEditingQuestion(null);
        }}
      >
        Save
      </button>
      <button
        className="btn btn-secondary"
        onClick={() => setEditingQuestion(null)}
      >
        Cancel
      </button>
    </>
  );
};

export default EditQuestion;