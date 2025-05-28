import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

// const REACT_APP_API_URL = "https://mocktest-ljru.onrender.com";
const REACT_APP_API_URL = process.env.REACT_APP_API_URL;


const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false); // 👈 Track success



  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("Resetting password...");

    try {
      const res = await fetch(`${REACT_APP_API_URL}/api/auth/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      setMessage(data.message);
      if (res.ok) setSuccess(true); // 👈 Show "Go to Sign In" if successful
    } catch (err) {
      setMessage("Something went wrong. Please try again.");
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div className="container mt-5">
      <h2>Reset Password</h2>
      {message && <div className="alert alert-info">{message}</div>}
      
      {!success && (
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            className="form-control mb-2"
            placeholder="Enter new password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="btn btn-success" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      )}

      {success && (
        <button className="btn btn-primary mt-3" onClick={() => navigate("/signin")}>
          Go to Sign In
        </button>
      )}
    </div>
  );
};

export default ResetPassword;

