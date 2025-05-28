import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import "./AddUserForm.css";


// const REACT_APP_API_URL = "https://mocktest-ljru.onrender.com";
const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

const AddUserForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });

  const [message, setMessage] = useState("");
  const [bulkMessage, setBulkMessage] = useState("");
  const navigate = useNavigate();


  

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${REACT_APP_API_URL}/api/admin/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("User created successfully!");
        setTimeout(() => navigate("/admin-dashboard"), 1500);
      } else {
        setMessage(data.message || "Failed to create user.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("An error occurred.");
    }
  };

  const handleExcelUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const token = localStorage.getItem("token");

    const reader = new FileReader();
    reader.onload = async (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(worksheet);

      const results = [];

      for (const row of rows) {
        const user = {
          name: row.name || row.Name,
          email: row.email || row.Email,
          password: row.password || row.Password,
          role: (row.role || row.Role || "student").toLowerCase(),
        };

        try {
          const res = await fetch("http://localhost:5000/api/admin/users", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(user),
          });

          const resData = await res.json();
          results.push(`${user.email}: ${res.ok ? "Created" : resData.message || "Error"}`);
        } catch (err) {
          results.push(`${user.email}: Error creating user`);
        }
      }

      setBulkMessage(results.join("\n"));
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="container mt-5">
      <h2>Add New User</h2>

      {message && <p className="text-info">{message}</p>}
      {bulkMessage && (
        <pre className="text-success bg-light p-3 mt-3">{bulkMessage}</pre>
      )}

      {/* Manual Add User Form */}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Name:</label>
          <input
            className="form-control"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Email:</label>
          <input
            className="form-control"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        

        <div className="mb-3">
          <label>Password:</label>
          <input
            className="form-control"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        {/* role  */}
        <div className="mb-3">
          <label>Role:</label>
          <select
            className="form-select"
            name="role"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="management">Management</option>
          </select>
        </div>

        {/* Excel Upload Section */}
      <div className="mt-4">
        <label htmlFor="excelUpload" className="form-label">
          Or Upload Excel File to Create Users:
        </label>
        <input
          type="file"
          id="excelUpload"
          accept=".xlsx, .xls"
          className="form-control"
          onChange={handleExcelUpload}
        />
        <p className="text-muted mt-2">
          (Make sure the Excel columns are: <strong>name, email, password, role</strong>)
        </p>
      </div>

        
        

        <button className="btn btn-success" type="submit">
          Create User
        </button>
      </form>

      
      {/* <button className="btn btn-success" type="submit">
          Create User
        </button> */}

      <button className="back-btn-fixed mt-4" onClick={() => navigate(-1)}>
        ← Back
      </button>
    </div>
  );
};
 
export default AddUserForm