import React, { useState, useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import StudentDashboard from "./StudentDashboard"; // ✅ correct
import {
  FaTachometerAlt,
  FaFileAlt,
  FaUser,
  FaSignOutAlt,
  
} from "react-icons/fa";

const StudentSidebar = ({ isCollapsed, setIsCollapsed }) => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const sidebarRef = useRef();

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target) &&
        window.innerWidth < 768
      ) {
        setIsCollapsed(true);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [setIsCollapsed]);

  const handleNavigate = (path) => {
    navigate(path);
    if (window.innerWidth < 768) {
      setIsCollapsed(true);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  const toggleSidebar = () => {
    setIsCollapsed(false);
  };

  return (
    <>
      

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className="bg-light border-end p-3 position-fixed d-flex flex-column justify-content-between"
        style={{
          top: "57px",
          left: 0,
          bottom: 0,
          width: "250px",
          height: "100vh",
          backgroundColor: "#fff",
          zIndex: 2000,
          transform: isCollapsed ? "translateX(-100%)" : "translateX(0)",
          transition: "transform 0.3s ease-in-out",
        }}
      >
        <div>
          <h4 className="mb-4" style={{ whiteSpace: "nowrap" }}>
            Student Panel
          </h4>
          <ul className="list-unstyled sidebar-links w-100">
            <li
              className="mb-3 d-flex align-items-center"
              onClick={() => handleNavigate("/student-dashboard")}
            >
              <div
                className="sidebar-link d-flex align-items-center"
                style={{ cursor: "pointer" }}
              >
                <FaTachometerAlt className="me-2" />
                Dashboard
              </div>
            </li>
            <li
              className="mb-3 d-flex align-items-center"
              onClick={() => handleNavigate("/mock-tests")}
            >
              <div
                className="sidebar-link d-flex align-items-center"
                style={{ cursor: "pointer" }}
              >
                <FaFileAlt className="me-2" />
                Mock Tests
              </div>
            </li>
            <li
              className="mb-3 d-flex align-items-center"
              onClick={() => handleNavigate("/profile")}
            >
              <div
                className="sidebar-link d-flex align-items-center"
                style={{ cursor: "pointer" }}
              >
                <FaUser className="me-2" />
                Profile
              </div>
            </li>
          </ul>
        </div>
        <div
          className="sidebar-link d-flex align-items-center mb-2"
          onClick={handleLogout}
          style={{ cursor: "pointer" }}
        >
          <FaSignOutAlt className="me-2" />
          Logout
        </div>
      </div>

      <style>
        {`
          .sidebar-links .sidebar-link {
            padding: 10px 15px;
            color: #343a40;
            font-weight: 600;
            border-radius: 4px;
            transition: background-color 0.3s ease, transform 0.3s;
            white-space: nowrap;
          }
          .sidebar-links .sidebar-link:hover {
            background-color: #4748ac;
            color: #fff;
            transform: translateX(4px);
          }
        `}
      </style>
    </>
  );
};

export default StudentSidebar;
