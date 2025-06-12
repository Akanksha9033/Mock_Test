import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

// const REACT_APP_API_URL = "https://mocktest-ljru.onrender.com";
const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const token = new URLSearchParams(location.search).get("token");

  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");
  const [passwordFeedback, setPasswordFeedback] = useState("");

  const evaluatePasswordStrength = (pwd) => {
    const hasLower = /[a-z]/.test(pwd);
    const hasUpper = /[A-Z]/.test(pwd);
    const hasNumber = /\d/.test(pwd);
    const hasSpecial = /[@#$%^&+=!]/.test(pwd);
    const isLong = pwd.length >= 8;

    const passed = [hasLower, hasUpper, hasNumber, hasSpecial, isLong].filter(Boolean).length;

    if (passed <= 2) {
      setPasswordStrength("Weak");
      setPasswordFeedback("Use at least 8 characters with a mix of upper, lower, number and symbol.");
    } else if (passed <= 4) {
      setPasswordStrength("Medium");
      setPasswordFeedback("Add more variety to strengthen it.");
    } else {
      setPasswordStrength("Strong");
      setPasswordFeedback("Good! Your password is strong.");
    }
  };

  const validatePassword = (pwd) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,}$/.test(pwd);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!validatePassword(password)) {
      return setMessage("Password must be at least 8 characters and include upper, lower, number, and special character.");
    }

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
      if (res.ok) setSuccess(true);
    } catch (err) {
      setMessage("Something went wrong. Please try again.");
      console.error(err);
    }
    setLoading(false);
  };

  const getColor = () => {
    switch (passwordStrength) {
      case "Weak": return "red";
      case "Medium": return "orange";
      case "Strong": return "green";
      default: return "gray";
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <h2>Reset Password</h2>
      {message && <div className="alert alert-info">{message}</div>}

      {!success && (
        <form onSubmit={handleSubmit}>
          <div className="input-group mb-2">
            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              placeholder="Enter new password"
              required
              onChange={(e) => {
                setPassword(e.target.value);
                evaluatePasswordStrength(e.target.value);
              }}
            />
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          {password && (
            <>
              <div style={{ color: getColor(), fontWeight: "bold", fontSize: "14px" }}>
                Strength: {passwordStrength}
              </div>
              <div style={{ fontSize: "12px", color: "#666" }}>{passwordFeedback}</div>
            </>
          )}
          <button type="submit" className="btn btn-success w-100 mt-3" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      )}

      {success && (
        <button className="btn btn-primary w-100 mt-3" onClick={() => navigate("/signin")}>
          Go to Sign In
        </button>
      )}
    </div>
  );
};

export default ResetPassword;
