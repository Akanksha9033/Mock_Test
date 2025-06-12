// import { useState, useContext } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { AuthContext } from "../context/AuthContext";
// import "bootstrap/dist/css/bootstrap.min.css";

// // ✅ Fallback to localhost:5000 if env variable is missing
// const REACT_APP_API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

// const SignIn = () => {
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [error, setError] = useState(null);
//     const navigate = useNavigate();
//     const { login } = useContext(AuthContext);

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setError(null);

//         console.log("📤 Sending credentials:", { email, password });
//         console.log("🌐 API URL:", REACT_APP_API_URL);

//         try {
//             const res = await fetch(`${REACT_APP_API_URL}/api/auth/signin`, {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ email, password }),
//             });

//             const data = await res.json();

//             if (!res.ok) {
//                 console.error("❌ Login failed:", data.message);
//                 return setError(data.message);
//             }

//             console.log("✅ Sign-in successful:", data);

//             // Save token and user info
//             localStorage.setItem("token", data.token);
//             localStorage.setItem("role", data.user.role);
//             localStorage.setItem("user", JSON.stringify(data.user));

//             // Update AuthContext
//             login(data.token, data.user);

//             // Redirect based on role
//             const role = data.user.role.toLowerCase();
//             switch (role) {
//                 case "admin":
//                     navigate("/admin-dashboard");
//                     break;
//                 case "superadmin":
//                     navigate("/admin-dashboard");
//                     break;
//                 case "teacher":
//                     navigate("/teacher-dashboard");
//                     break;
//                 case "management":
//                     navigate("/management-dashboard");
//                     break;
//                 case "student":
//                     navigate("/student-dashboard");
//                     break;
//                 default:
//                     navigate("/unauthorized");
//                     break;
//             }

//         } catch (error) {
//             console.error("🚨 Network/login error:", error);
//             setError("Login failed. Try again.");
//         }
//     };

//     return (
//         <div className="container d-flex justify-content-center align-items-center vh-100">
//             <div className="card p-4 shadow-sm" style={{ width: "350px" }}>
//                 <h2 className="text-center mb-4">Sign In</h2>
//                 {error && <div className="alert alert-danger">{error}</div>}
//                 <form onSubmit={handleSubmit}>
//                     <div className="mb-3">
//                         <label className="form-label">Email</label>
//                         <input
//                             type="email"
//                             className="form-control"
//                             placeholder="Enter your email"
//                             onChange={(e) => setEmail(e.target.value)}
//                             required
//                         />
//                     </div>
//                     <div className="mb-3">
//                         <label className="form-label">Password</label>
//                         <input
//                             type="password"
//                             className="form-control"
//                             placeholder="Enter your password"
//                             onChange={(e) => setPassword(e.target.value)}
//                             required
//                         />
//                     </div>
//                     <div className="d-flex justify-content-center mt-4">
//                         <button type="submit" className="btn" style={{ backgroundColor: "#4748ac", color: "white" }}>
//                             Sign In
//                         </button>
//                     </div>
//                 </form>
//                 <p className="mt-3 text-center">
//                     Don't have an account? <Link to="/signup">Sign Up</Link>
//                 </p>
//                 <p className="mt-2 text-center">
//                     <Link to="/forgot-password">Forgot Password?</Link>
//                 </p>
//             </div>
//         </div>
//     );
// };

// export default SignIn;


import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";

const REACT_APP_API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch(`${REACT_APP_API_URL}/api/auth/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) return setError(data.message);

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.user.role);
      localStorage.setItem("user", JSON.stringify(data.user));

      login(data.token, data.user);

            const role = data.user.role.toLowerCase();
      switch (role) {
        case "superadmin":
          navigate("/superadmin-dashboard");
          break;
        case "admin":
          navigate("/admin-dashboard");
          break;
        case "teacher":
          navigate("/teacher-dashboard");
          break;
        case "management":
          navigate("/management-dashboard");
          break;
        case "student":
          navigate("/student-dashboard");
          break;
        default:
          navigate("/unauthorized");
      }

    } catch (error) {
      console.error("Login error:", error);
      setError("Login failed. Try again.");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow-sm" style={{ width: "350px" }}>
        <h2 className="text-center mb-4">Sign In</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input type="password" className="form-control" onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div className="d-flex justify-content-center mt-4">
            <button type="submit" className="btn" style={{ backgroundColor: "#4748ac", color: "white" }}>Sign In</button>
          </div>
        </form>
        <p className="mt-3 text-center">Don't have an account? <Link to="/signup">Sign Up</Link></p>
        <p className="mt-2 text-center"><Link to="/forgot-password">Forgot Password?</Link></p>
      </div>
    </div>
  );
};

export default SignIn;
