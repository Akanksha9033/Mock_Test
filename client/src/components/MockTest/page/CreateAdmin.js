import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

const CreateAdmin = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${REACT_APP_API_URL}/api/superadmin/create-admin`,
        {
          name,
          email,
          password,
          role: "Admin", // ✅ required field for backend to work
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("✅ Admin created successfully");
      setName("");
      setEmail("");
      setPassword("");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "❌ Failed to create Admin");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light px-3">
      <div className="container bg-white p-4 shadow rounded" style={{ maxWidth: "500px", width: "100%" }}>
        {/* 🔙 Back Button */}
        <button
          className="btn btn-outline-secondary mb-3"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>

        <h2 className="mb-3">Create Admin</h2>

        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label>Name</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">Create Admin</button>
        </form>
      </div>
    </div>
  );
};

export default CreateAdmin;
