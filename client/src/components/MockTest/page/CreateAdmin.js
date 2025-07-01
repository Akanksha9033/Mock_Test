import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const REACT_APP_API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const CreateAdmin = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [instituteName, setInstituteName] = useState("");
  const [instituteId, setInstituteId] = useState(""); // Optional

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication token not found.");
        return;
      }

      const payload = {
        name,
        email,
        password,
        instituteName,
        role: "Admin",
      };

      // ✅ Include instituteId only if entered (not required)
      if (instituteId.trim() !== "") {
        payload.instituteId = instituteId;
      }

      const res = await axios.post(`${REACT_APP_API_URL}/api/superadmin/create-admin`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage("✅ Admin created successfully");
      setName("");
      setEmail("");
      setPassword("");
      setInstituteName("");
      setInstituteId("");
    } catch (err) {
      console.error("❌ Error:", err);
      if (err.response) {
        console.error("📦 Backend Error:", err.response.data);
        setError(err.response.data.message || "❌ Failed to create Admin");
      } else if (err.request) {
        console.error("🟠 No response:", err.request);
        setError("❌ No response from server");
      } else {
        console.error("🔴 Request error:", err.message);
        setError("❌ Request setup failed");
      }
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light px-3">
      <div className="container bg-white p-4 shadow rounded" style={{ maxWidth: "500px", width: "100%" }}>
        <button className="btn btn-outline-secondary mb-3" onClick={() => navigate(-1)}>← Back</button>
        <h2 className="mb-3">Create Admin</h2>

        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label>Name</label>
            <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="form-group mb-3">
            <label>Email</label>
            <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group mb-3">
            <label>Password</label>
            <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div className="form-group mb-3">
            <label>Institute Name</label>
            <input type="text" className="form-control" value={instituteName} onChange={(e) => setInstituteName(e.target.value)} required />
          </div>
          <div className="form-group mb-3">
            <label>Institute ID (optional)</label>
            <input type="text" className="form-control" value={instituteId} onChange={(e) => setInstituteId(e.target.value)} />
          </div>
          <button type="submit" className="btn btn-primary w-100">Create Admin</button>
        </form>
      </div>
    </div>
  );
};

export default CreateAdmin;
