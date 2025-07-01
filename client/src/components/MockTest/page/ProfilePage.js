import axios from "axios";
import { useNavigate, useLocation as useRouterLocation, Link } from "react-router-dom";
import {
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaSignOutAlt,
  FaTachometerAlt,
  FaFileAlt,
  FaUser,
  FaWallet,
  FaCamera,
  FaChevronLeft,
FaChevronRight,
} from "react-icons/fa";
import StudentSidebar from "./StudentSidebar";
import TeacherSidebar from "./TeacherSidebar";
import LoadingAnimation from "../../LoadingAnimation";
import React, { useEffect, useState, useRef } from "react";
 
const REACT_APP_API_URL = process.env.REACT_APP_API_URL;
 
const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
   
// const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);
 
  const sidebarRef = useRef(null);
const toggleSidebar = () => {
  setSidebarOpen(prev => !prev);
};
 
  const [social, setSocial] = useState({
    facebook: "",
    youtube: "",
    linkedin: "",
    telegram: "",
    whatsapp: "",
  });
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [previewPhoto, setPreviewPhoto] = useState("");
 
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
 
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        window.innerWidth < 768
      ) {
        setSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
 
  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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
 
  // const toggleSidebar = () => {
  //   setSidebarOpen((prev) => !prev);
  // };
 
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
      {!isExamPage && (
        <>
          {user.role?.toLowerCase() === "student" && (
            <StudentSidebar isCollapsed={!sidebarOpen} setIsCollapsed={(val) => setSidebarOpen(!val)} />
          )}
          {user.role?.toLowerCase() === "teacher" && (
            <TeacherSidebar isCollapsed={!sidebarOpen} setIsCollapsed={(val) => setSidebarOpen(!val)} />
          )}
          {user.role?.toLowerCase() === "admin" && (
            <div ref={sidebarRef}>
              <div
                className="bg-light border-end p-3 position-fixed d-flex flex-column justify-content-between"
                style={{
                  width: "250px",
                  height: "100vh",
                  transition: "transform 0.3s ease-in-out",
                  transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
                  zIndex: 1050,
                  overflow: "hidden",
                }}
              >
                <style>
                  {`
                    .sidebar-links .sidebar-link,
                    .sidebar-links .sidebar-link:visited {
                      display: block;
                      padding: 10px 15px;
                      color: #212529 !important;
                      font-weight: 600;
                      border-radius: 4px;
                      transition: background-color 0.3s ease, color 0.3s ease, transform 0.3s;
                      white-space: nowrap;
                      text-decoration: none !important;
                    }
                    .sidebar-links .sidebar-link:hover {
                      background-color: #4748ac;
                      color: #fff !important;
                      transform: translateX(4px);
                    }
                  `}
                </style>
                <div>
                  <h4 className="mb-4">{user.role} Panel</h4>
                  <ul className="list-unstyled sidebar-links w-100">
                    <li className="mb-3 d-flex align-items-center">
                      <Link to={dashboardLink} className="sidebar-link d-flex align-items-center">
                        <FaTachometerAlt className="me-2" /> Dashboard
                      </Link>
                    </li>
                    <li className="mb-3 d-flex align-items-center">
                      <Link to="/mock-tests" className="sidebar-link d-flex align-items-center">
                        <FaFileAlt className="me-2" /> Mock Tests
                      </Link>
                    </li>
                    <li className="mb-3 d-flex align-items-center">
                      <Link to="/profile" className="sidebar-link d-flex align-items-center">
                        <FaUser className="me-2" /> Profile
                      </Link>
                    </li>
                    {user.role?.toLowerCase() === "admin" && (
                      <li className="mb-3 d-flex align-items-center">
                        <Link to="/Users" className="sidebar-link d-flex align-items-center">
                          <FaWallet className="me-2" /> Users
                        </Link>
                      </li>
                    )}
                  </ul>
                </div>
                <div
                  className="sidebar-link d-flex align-items-center mb-2"
                  onClick={handleLogout}
                  style={{ cursor: "pointer" }}
                >
                  <FaSignOutAlt className="me-2" /> Logout
                </div>
              </div>
            </div>
          )}
 
       
       
<div
  className="position-fixed"
  style={{
    top: "20px",
    left: sidebarOpen ? "260px" : "10px",
    zIndex: 1100,
    transition: "left 0.3s ease",
  }}
>
  {sidebarOpen ? (
    <FaChevronLeft
      onClick={toggleSidebar}
      style={{
        fontSize: "28px",
        color: "#333",
        backgroundColor: "#fff",
        padding: "6px",
        borderRadius: "50%",
        boxShadow: "0 0 6px rgba(0,0,0,0.2)",
        cursor: "pointer",
        marginTop: "40px",
      }}
    />
  ) : (
    <FaChevronRight
      onClick={toggleSidebar}
      style={{
        fontSize: "28px",
        color: "#333",
        backgroundColor: "#fff",
        padding: "6px",
        borderRadius: "50%",
        boxShadow: "0 0 6px rgba(0,0,0,0.2)",
        cursor: "pointer",
        marginTop: "40px",
      }}
    />
  )}
</div>
 
 
        </>
      )}
 
     <div
  className="container py-5"
  style={{
    marginLeft: !isExamPage && window.innerWidth >= 768 ? (sidebarOpen ? "250px" : "0px") : "0px",
    transition: "all 0.3s ease",
    filter: !isExamPage && sidebarOpen && window.innerWidth < 768 ? "blur(4px)" : "none",
    pointerEvents: !isExamPage && sidebarOpen && window.innerWidth < 768 ? "none" : "auto",
  }}
>
 
        <div className="card shadow">
          <div className="card-header bg-primary text-white text-center">
            <h3>Welcome, {user.name}</h3>
            <p className="mb-0">Role: <strong>{user.role}</strong></p>
          </div>
          <div className="card-body">
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