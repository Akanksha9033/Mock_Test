// BackButton.js
import React from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const BackButton = () => {
  const navigate = useNavigate();
  return (
    <div style={{ padding: "10px" }}>
      <button
        className="btn btn-outline-secondary"
        onClick={() => navigate(-1)}
        style={{ display: "flex", alignItems: "center", gap: "8px" }}
      >
        <FaArrowLeft /> Go Back
      </button>
    </div>
  );
};

export default BackButton;
