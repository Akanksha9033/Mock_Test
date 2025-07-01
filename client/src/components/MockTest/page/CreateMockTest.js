import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import * as XLSX from "xlsx";
import { Button } from "react-bootstrap";
import { toast } from "react-toastify";
import axios from "axios";
import LoadingAnimation from "../../LoadingAnimation";
import BackButton from "./BackButton";

// const REACT_APP_API_URL = "https://mocktest-ljru.onrender.com";
const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

const CreateMockTest = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
const [formattedQuestions, setFormattedQuestions] = useState([]);
const [excelFileObject, setExcelFileObject] = useState(null); // ✅ for backend validation
const [showPreview, setShowPreview] = useState(false);



  const [mockTest, setMockTest] = useState({
    title: "",
    price: "",
    isFree: false,
    duration: 0,
    excelFile: null,
    wallpaper: null, // ✅ added wallpaper
    questions: [],
  });

  useEffect(() => {
    if (
      user?.role?.toLowerCase() !== "admin" &&
      user?.role?.toLowerCase() !== "teacher"
    ) {
      console.log(user?.role?.toLowerCase());
      navigate("/mock-tests");
    }
  }, [user, navigate]);

  if (!user) {
    return (
      <p>
        <LoadingAnimation />
      </p>
    );
  }

  const handleChange = (e) => {
  const { name, value, type, checked } = e.target;

  if (name === "isFree") {
    setMockTest((prev) => ({
      ...prev,
      isFree: checked,
      price: checked ? 0 : "", // ✅ auto-set price to 0 when free
    }));
  } else {
    setMockTest((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name === "duration"
          ? value === ""
            ? ""
            : Number(value)
          : value,
    }));
  }
};


  const handleFileUpload = (e) => {
  const file = e.target.files[0];
  if (!file) {
    console.log("No file selected");
    return;
  }

  if (
    file.type !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" &&
    file.type !== "application/vnd.ms-excel"
  ) {
    alert("Please upload a valid Excel file.");
    return;
  }

   // ✅ Check file size (in bytes): 10MB = 10 * 1024 * 1024 = 10485760
  if (file.size > 10 * 1024 * 1024) {
    alert("⚠️ The selected image is larger than 10MB. Please upload an image below 10MB.");
    e.target.value = ""; // Reset the file input
    return;
  }

  // ✅ Save file for validation upload
  setExcelFileObject(file);

  // ✅ Keep your original base64 logic intact
  const reader = new FileReader();
  reader.onload = (event) => {
    const base64String = event.target.result.split(",")[1];
    setMockTest((prev) => ({
      ...prev,
      excelFile: `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${base64String}`,
    }));
  };
  reader.readAsDataURL(file);
};



const validateBeforeUpload = async () => {
  if (!excelFileObject) {
    toast.error("Please select a file before validation.");
    return;
  }

 const formData = new FormData();
formData.append("file", excelFileObject);

try {
  const res = await axios.post(`${REACT_APP_API_URL}/api/admin/upload`, formData);
  toast.success("Excel validated successfully ✅");

  // ✅ Save formatted questions for preview
  setFormattedQuestions(res.data.data); 

  // ✅ Update mockTest.questions so it reflects in your preview list
  setMockTest((prev) => ({
    ...prev,
    questions: Array.isArray(res.data.data) ? res.data.data : [],
  }));
} catch (error) {
  if (error.response?.status === 400 && error.response.data?.errors) {
    const errorList = error.response.data.errors;
    const fullMessage = ["⚠️ Excel validation failed:", ...errorList].join("\n");
    toast.error(fullMessage, { autoClose: false });
  } else {
    toast.error("Something went wrong during validation.");
  }
}
}



  // ✅ Wallpaper upload handler
  const handleWallpaperUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setMockTest((prev) => ({
        ...prev,
        wallpaper: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!mockTest.title.trim()) {
      alert("Please provide a valid title.");
      return;
    }
    if (!mockTest.isFree && !mockTest.price) {
      alert("Please provide a price for the mock test.");
      return;
    }
    if (!mockTest.excelFile) {
      alert("Please upload an Excel file.");
      return;
    }

    const formattedMockTest = {
      title: mockTest.title.trim(),
      price: mockTest.isFree ? 0 : Number(mockTest.price) || 0,
      isFree: mockTest.isFree,
      duration: Number(mockTest.duration) || 0,
      excelFile: mockTest.excelFile,
      wallpaper: mockTest.wallpaper || null, // ✅ include wallpaper
      questions: JSON.stringify(mockTest.questions),
    };

    try {
      const token = localStorage.getItem("token");

const response = await fetch(
  `${REACT_APP_API_URL}/api/admin/mock-tests`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // ✅ send the token
    },
    body: JSON.stringify(formattedMockTest),
  }
);


      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create mock test");
      }

      const data = await response.json();
      navigate("/mock-tests");
    } catch (error) {
      console.error("❌ Error in fetch:", error.message);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <>
    <BackButton/>
    <div className="container mt-5">
      <h2>Create a New Mock Test</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Title*</label>
          <input
            type="text"
            className="form-control"
            name="title"
            placeholder="Enter mock test title"
            value={mockTest.title}
            onChange={handleChange}
            required
          />
        </div>

        

<div className="mb-3">
  <label className="form-label">Price</label>
  <input
    type="number"
    className="form-control"
    name="price"
    placeholder="Enter price"
    value={mockTest.price}
    onChange={handleChange}
    disabled={mockTest.isFree} // ✅ disables when checkbox is checked
  />
</div>

<div className="form-check mb-3">
  <input
    className="form-check-input"
    type="checkbox"
    name="isFree"
    checked={mockTest.isFree}
    onChange={handleChange}
    id="isFreeCheckbox"
  />
  <label className="form-check-label" htmlFor="isFreeCheckbox">
    Make this a free mock test
  </label>
</div>


        <div className="mb-3">
          <label className="form-label">Duration (in minutes)*</label>
          <input
            type="number"
            className="form-control"
            name="duration"
            placeholder="Enter duration"
            value={mockTest.duration}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
  <label className="form-label">Upload Excel File</label>
  <input
    type="file"
    className="form-control"
    accept=".xlsx, .xls"
    onChange={handleFileUpload}
  />

  {/* ✅ New validation button */}
  <Button onClick={validateBeforeUpload} variant="warning" className="mt-2">
    ✅ Validate Excel Fields
  </Button>
</div>


        {/* ✅ Wallpaper uploader */}
        <div className="mb-3">
          <label className="form-label">Upload Test Wallpaper (Image)</label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={handleWallpaperUpload}
          />
        </div>

       {showPreview && Array.isArray(mockTest.questions) && mockTest.questions.length > 0 && (
  <div className="mt-3">
    <h5>📌 Extracted Questions Preview:</h5>
    <ul className="list-group">
      {mockTest.questions.map((q, index) => (
        <li key={index} className="list-group-item">
          <strong>Q{index + 1}: {q.question}</strong>

          {Array.isArray(q.options) && q.options.length > 0 && (
            <ul>
              {q.options.map((opt, i) => (
                <li key={i}>
                  <strong>{opt.option || opt.label}:</strong> {opt.text}
                </li>
              ))}
            </ul>
          )}

          <p><strong>Answer:</strong> {Array.isArray(q.answer) ? q.answer.join(", ") : q.answer || "N/A"}</p>
          <p><strong>Explanation:</strong> {q.explanation}</p>
          <p><strong>Tags:</strong> {Array.isArray(q.tags) ? q.tags.join(", ") : q.tags || "N/A"}</p>
          <p><strong>Level:</strong> {q.level || q.difficulty || "N/A"}</p>
          <p><strong>Subtag:</strong> {q.subtag || "N/A"}</p>
          <p><strong>Approach:</strong> {q.approach || "N/A"}</p>
          <p><strong>Performance Domain:</strong> {q.performanceDomain || "N/A"}</p>
        </li>
      ))}
    </ul>
  </div>
)}



        <div className="d-flex gap-2 mt-3">
          <button type="submit" className="btn btn-success">
            Create
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/mock-tests")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
    </>
  );
};

export default CreateMockTest;
