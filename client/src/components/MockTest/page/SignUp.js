// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "bootstrap/dist/css/bootstrap.min.css";


// // const REACT_APP_API_URL = "https://mocktest-ljru.onrender.com";
// const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

// const SignUp = () => {
//     const [formData, setFormData] = useState({ name: "", email: "", password: "" });
//     const [error, setError] = useState(null);
//     const navigate = useNavigate();

//     const handleChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setError(null);

//         try {
//             const response = await fetch(`${REACT_APP_API_URL}/api/auth/register`, {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify(formData),
//             });

//             const data = await response.json();
//             if (!response.ok) return setError(data.message);
            
//             navigate("/signin");
//         } catch (error) {
//             setError("Signup failed. Try again.");
//         }
//     };

//     return (
//         <div className="container d-flex justify-content-center align-items-center vh-100">
//             <div className="card p-4 shadow-sm" style={{ width: "350px" }}>
//                 <h2 className="text-center mb-4">Sign Up</h2>
//                 {error && <div className="alert alert-danger">{error}</div>}
//                 <form onSubmit={handleSubmit}>
//                     <div className="mb-3">
//                         <label className="form-label">Name</label>
//                         <input
//                             type="text"
//                             className="form-control"
//                             name="name"
//                             placeholder="Enter your name"
//                             onChange={handleChange}
//                             required
//                         />
//                     </div>
//                     <div className="mb-3">
//                         <label className="form-label">Email</label>
//                         <input
//                             type="email"
//                             className="form-control"
//                             name="email"
//                             placeholder="Enter your email"
//                             onChange={handleChange}
//                             required
//                         />
//                     </div>
//                     <div className="mb-3">
//                         <label className="form-label">Password</label>
//                         <input
//                             type="password"
//                             className="form-control"
//                             name="password"
//                             placeholder="Create a password"
//                             onChange={handleChange}
//                             required
//                         />
//                     </div>
//                     <div className="d-flex justify-content-center mt-4">
//                     <button type="submit" className="btn " style={{backgroundColor : "#4748ac", color : "white"}}>Sign Up</button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default SignUp;




import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

const SignUp = () => {
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState("");
    const [passwordFeedback, setPasswordFeedback] = useState("");
    const [emailValid, setEmailValid] = useState(null);

    const navigate = useNavigate();

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
        return regex.test(email);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (name === "password") {
            evaluatePasswordStrength(value);
        }

        if (name === "email") {
            setEmailValid(validateEmail(value));
        }
    };

    const evaluatePasswordStrength = (password) => {
        const hasLower = /[a-z]/.test(password);
        const hasUpper = /[A-Z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecial = /[@#$%^&+=!]/.test(password);
        const isLongEnough = password.length >= 8;

        const checksPassed = [hasLower, hasUpper, hasNumber, hasSpecial, isLongEnough].filter(Boolean).length;

        let strength = "";
        let feedback = "";

        if (checksPassed <= 2) {
            strength = "Weak";
            feedback = "Use at least 8 characters, with a mix of letters, numbers, and symbols.";
        } else if (checksPassed === 3 || checksPassed === 4) {
            strength = "Medium";
            feedback = "Add more variety to strengthen your password.";
        } else {
            strength = "Strong";
            feedback = "Great! Your password is strong.";
        }

        setPasswordStrength(strength);
        setPasswordFeedback(feedback);
    };

    const validatePassword = (password) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,}$/;
        return regex.test(password);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!validateEmail(formData.email)) {
            return setError("Please enter a valid email address.");
        }

        if (!validatePassword(formData.password)) {
            return setError("Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.");
        }

        try {
            const response = await fetch(`${REACT_APP_API_URL}/api/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (!response.ok) return setError(data.message);

            navigate("/signin");
        } catch (error) {
            setError("Signup failed. Try again.");
        }
    };

    const getStrengthColor = () => {
        switch (passwordStrength) {
            case "Weak": return "red";
            case "Medium": return "orange";
            case "Strong": return "green";
            default: return "gray";
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card p-4 shadow-sm" style={{ width: "350px" }}>
                <h2 className="text-center mb-4">Sign Up</h2>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Name</label>
                        <input
                            type="text"
                            className="form-control"
                            name="name"
                            placeholder="Enter your name"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            className={`form-control ${emailValid === false ? 'is-invalid' : emailValid === true ? 'is-valid' : ''}`}
                            name="email"
                            placeholder="Enter your email"
                            onChange={handleChange}
                            required
                        />
                        <div className="form-text text-muted">
                            Must be a valid email like <code>example@gmail.com</code>
                        </div>
                        {emailValid === false && (
                            <div className="text-danger" style={{ fontSize: "12px" }}>
                                Invalid email format
                            </div>
                        )}
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <div className="input-group">
                            <input
                                type={showPassword ? "text" : "password"}
                                className="form-control"
                                name="password"
                                placeholder="Create a password"
                                onChange={handleChange}
                                required
                            />
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>

                        {formData.password && (
                            <div className="mt-2">
                                <div style={{ fontSize: "14px", color: getStrengthColor(), fontWeight: "bold" }}>
                                    Strength: {passwordStrength}
                                </div>
                                <div style={{ fontSize: "12px", color: "#555" }}>{passwordFeedback}</div>

                                {/* Strength progress bar */}
                                <div className="progress mt-2" style={{ height: "6px" }}>
                                    <div
                                        className="progress-bar"
                                        role="progressbar"
                                        style={{
                                            width:
                                                passwordStrength === "Weak"
                                                    ? "33%"
                                                    : passwordStrength === "Medium"
                                                    ? "66%"
                                                    : "100%",
                                            backgroundColor: getStrengthColor(),
                                        }}
                                    ></div>
                                </div>

                                {/* Live password requirement checkboxes */}
                                <ul className="list-unstyled mt-3 mb-0" style={{ fontSize: "13px" }}>
                                    <li>
                                        <span style={{ color: /[A-Z]/.test(formData.password) ? "green" : "gray" }}>
                                            {/[A-Z]/.test(formData.password) ? "✓" : "○"} At least one uppercase letter
                                        </span>
                                    </li>
                                    <li>
                                        <span style={{ color: /[a-z]/.test(formData.password) ? "green" : "gray" }}>
                                            {/[a-z]/.test(formData.password) ? "✓" : "○"} At least one lowercase letter
                                        </span>
                                    </li>
                                    <li>
                                        <span style={{ color: /\d/.test(formData.password) ? "green" : "gray" }}>
                                            {/\d/.test(formData.password) ? "✓" : "○"} At least one number
                                        </span>
                                    </li>
                                    <li>
                                        <span style={{ color: /[@#$%^&+=!]/.test(formData.password) ? "green" : "gray" }}>
                                            {/[@#$%^&+=!]/.test(formData.password) ? "✓" : "○"} At least one special character
                                        </span>
                                    </li>
                                    <li>
                                        <span style={{ color: formData.password.length >= 8 ? "green" : "gray" }}>
                                            {formData.password.length >= 8 ? "✓" : "○"} Minimum 8 characters
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                    <div className="d-flex justify-content-center mt-4">
                        <button
                            type="submit"
                            className="btn"
                            style={{ backgroundColor: "#4748ac", color: "white" }}
                        >
                            Sign Up
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignUp;
