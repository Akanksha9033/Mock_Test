import axios from "axios";
import { useNavigate, useLocation as useRouterLocation, Link } from "react-router-dom";
import { FaAngleDoubleLeft, FaAngleDoubleRight, FaSignOutAlt, FaTachometerAlt, FaFileAlt, FaUser, FaWallet, FaCamera } from "react-icons/fa";
import StudentSidebar from "./StudentSidebar";
import TeacherSidebar from "./TeacherSidebar";
// import LoadingAnimation from "../components/LoadingAnimation"; // ✅ Import animation component
import LoadingAnimation from "../../LoadingAnimation";
import React, { useEffect, useState } from "react";
 
 
// const REACT_APP_API_URL = "https://mocktest-ljru.onrender.com";
const REACT_APP_API_URL = process.env.REACT_APP_API_URL;
 
const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [social, setSocial] = useState({
    facebook: "",
    youtube: "",
    linkedin: "",
    telegram: "",
    whatsapp: "",
  });
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [previewPhoto, setPreviewPhoto] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
 
  const navigate = useNavigate();
  const routerLocation = useRouterLocation();
  const isExamPage = routerLocation.pathname.includes("/exam");
 
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${REACT_APP_API_URL}/api/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data;
        setUser(data);
        setPhone(data.phone || "");
        setDob(data.dob || "");
        setLocation(data.location || "");
        setDescription(data.description || "");
        setSocial(data.social || {});
        setPreviewPhoto(data.profilePhoto || "");
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, []);
 
  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const payload = { phone, dob, location, description, social, profilePhoto };
      const res = await axios.put(`${REACT_APP_API_URL}/api/auth/update-profile`, payload, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      setUser(res.data.user);
      alert("Profile updated successfully.");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile.");
    }
  };
 
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewPhoto(reader.result);
      setProfilePhoto(reader.result);
    };
    reader.readAsDataURL(file);
  };
 
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };
 
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };
 
  // ✅ Show loading animation if user data is not yet fetched
  if (!user) {
    return (
      <div className="d-flex justify-content-center align-items-center mt-5" style={{ minHeight: "200px" }}>
        <LoadingAnimation />
      </div>
    );
  }
 
  const dashboardLink =
    user.role?.toLowerCase() === "student"
      ? "/student-dashboard"
      : user.role?.toLowerCase() === "teacher"
      ? "/teacher-dashboard"
      : user.role?.toLowerCase() === "management"
      ? "/management-dashboard"
      : user.role?.toLowerCase() === "admin"
      ? "/admin-dashboard"
      : "/unauthorized";
 
  return (
    <div className="d-flex">
      {/* Sidebar Rendering */}
      {!isExamPage && (
        <>
          {user.role?.toLowerCase() === "student" && <StudentSidebar onToggleCollapse={setSidebarCollapsed} />}
          {user.role?.toLowerCase() === "teacher" && <TeacherSidebar onToggleCollapse={setSidebarCollapsed} />}
          {user.role?.toLowerCase() === "admin" && (
            <>
              <div
                className="bg-light border-end p-3 position-fixed d-flex flex-column justify-content-between"
                style={{
                  width: sidebarCollapsed ? "60px" : "250px",
                  height: "100vh",
                  transition: "width 0.3s ease",
                  zIndex: 1050,
                  overflow: "hidden",
                }}
              >
                <div>
                  {!sidebarCollapsed && <h4 className="mb-4">Admin Panel</h4>}
                  <ul className="list-unstyled sidebar-links w-100">
                    <li className="mb-3 d-flex align-items-center">
                      <Link to={dashboardLink} className="sidebar-link d-flex align-items-center">
                        <FaTachometerAlt className="me-2" />
                        {!sidebarCollapsed && "Dashboard"}
                      </Link>
                    </li>
                    <li className="mb-3 d-flex align-items-center">
                      <Link to="/mock-tests" className="sidebar-link d-flex align-items-center">
                        <FaFileAlt className="me-2" />
                        {!sidebarCollapsed && "Mock Tests"}
                      </Link>
                    </li>
                    <li className="mb-3 d-flex align-items-center">
                      <Link to="/profile" className="sidebar-link d-flex align-items-center">
                        <FaUser className="me-2" />
                        {!sidebarCollapsed && "Profile"}
                      </Link>
                    </li>
                    <li className="mb-3 d-flex align-items-center">
                      <Link to="/accounts" className="sidebar-link d-flex align-items-center">
                        <FaWallet className="me-2" />
                        {!sidebarCollapsed && "Accounts"}
                      </Link>
                    </li>
                  </ul>
                </div>
                <div
                  className="sidebar-link d-flex align-items-center mb-2"
                  onClick={handleLogout}
                  style={{ cursor: "pointer" }}
                >
                  <FaSignOutAlt className="me-2" />
                  {!sidebarCollapsed && "Logout"}
                </div>
              </div>
 
              {/* Sidebar Toggle Button */}
              <div
                className="position-fixed"
                style={{
                  top: "20px",
                  left: sidebarCollapsed ? "60px" : "250px",
                  zIndex: 1060,
                  cursor: "pointer",
                  transition: "left 0.3s ease",
                }}
                onClick={toggleSidebar}
              >
                <span style={{ fontSize: "20px", color: "#000" }}>
                  {sidebarCollapsed ? <FaAngleDoubleRight /> : <FaAngleDoubleLeft />}
                </span>
              </div>
 
              <style>
                {`
                  .sidebar-links .sidebar-link {
                    display: block;
                    padding: 10px 15px;
                    color: #343a40;
                    font-weight: 600;
                    border-radius: 4px;
                    transition: background-color 0.3s ease, color 0.3s ease, transform 0.3s;
                    white-space: nowrap;
                    text-decoration: none;
                  }
                  .sidebar-links .sidebar-link:hover,
                  .sidebar-link:hover {
                    background-color: #4748ac;
                    color: #fff;
                    transform: translateX(4px);
                  }
                `}
              </style>
            </>
          )}
        </>
      )}
 
      {/* Main Content */}
      <div
        className="container py-5"
        style={{
          marginLeft: !isExamPage ? (sidebarCollapsed ? "60px" : "250px") : "0px",
          transition: "margin-left 0.3s ease",
        }}
      >
        <div className="card shadow">
          <div className="card-header bg-primary text-white text-center">
            <h3>Welcome, {user.name}</h3>
            <p className="mb-0">Role: <strong>{user.role}</strong></p>
          </div>
          <div className="card-body">
            {/* Profile Image + Upload */}
            <div className="text-center mb-4 position-relative d-inline-block">
              {previewPhoto ? (
                <img
                  src={previewPhoto}
                  alt="Profile"
                  className="rounded-circle"
                  style={{ width: "120px", height: "120px", objectFit: "cover" }}
                />
              ) : (
                <div
                  className="rounded-circle bg-secondary d-flex align-items-center justify-content-center"
                  style={{ width: "120px", height: "120px", color: "#fff" }}
                >
                  No Image
                </div>
              )}
              <label
                htmlFor="profilePhotoInput"
                className="position-absolute bg-dark text-white rounded-circle p-1 d-flex align-items-center justify-content-center"
                style={{
                  bottom: "0",
                  right: "0",
                  width: "30px",
                  height: "30px",
                  cursor: "pointer",
                  transform: "translate(25%, 25%)",
                  opacity: 0.8,
                }}
                title="Change photo"
              >
                <FaCamera />
              </label>
              <input
                type="file"
                id="profilePhotoInput"
                style={{ display: "none" }}
                onChange={handlePhotoChange}
              />
            </div>
 
            {/* Profile Form */}
            <div className="mb-3">
              <label className="form-label">Phone Number</label>
              <input type="text" className="form-control" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div className="mb-3">
              <label className="form-label">Date of Birth</label>
              <input type="date" className="form-control" value={dob} onChange={(e) => setDob(e.target.value)} />
            </div>
            <div className="mb-3">
              <label className="form-label">Location</label>
              <input type="text" className="form-control" value={location} onChange={(e) => setLocation(e.target.value)} />
            </div>
            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea className="form-control" rows="3" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
            </div>
 
            <hr />
            <h5>Social Media Links</h5>
            {["facebook", "youtube", "linkedin", "telegram", "whatsapp"].map((platform) => (
              <div className="mb-3" key={platform}>
                <label className="form-label">{platform.charAt(0).toUpperCase() + platform.slice(1)}</label>
                <input
                  type="text"
                  className="form-control"
                  value={social[platform] || ""}
                  onChange={(e) => setSocial({ ...social, [platform]: e.target.value })}
                  placeholder={platform === "whatsapp" ? "Phone number with country code" : "Username"}
                />
              </div>
            ))}
 
            <div className="text-center">
              <button className="btn btn-success px-5" onClick={handleSaveProfile}>
                Save Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
 
export default ProfilePage;