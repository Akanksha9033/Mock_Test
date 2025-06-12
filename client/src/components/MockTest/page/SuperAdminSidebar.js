import { useLocation, useNavigate } from "react-router-dom";
import React, { useState, useEffect, useContext, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  FaTachometerAlt,
  FaUserShield,
  FaUserPlus,
  FaSignOutAlt,
  FaBars,
  FaMoon,
  FaSun,
} from "react-icons/fa";

const SuperAdminSidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);
  const [darkMode, setDarkMode] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const wrapperRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const isExamPage = location.pathname.includes("/exam");
  const sidebarWidth = screenWidth < 768 ? "80vw" : "250px";

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target) &&
        screenWidth < 768
      ) {
        setIsSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [screenWidth]);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleNavigate = (path) => {
    if (screenWidth < 768) setIsSidebarOpen(false);
    navigate(path);
  };

  return (
    !isExamPage && (
      <>
        {/* Toggle Button */}
        <div
          className="position-fixed"
          style={{
            top: "20px",
            left: !isSidebarOpen ? "10px" : screenWidth < 768 ? `calc(${sidebarWidth} + 10px)` : "10px",
            zIndex: 1100,
            transition: "left 0.3s ease-in-out",
          }}
        >
          <FaBars
            onClick={toggleSidebar}
            style={{
              fontSize: "26px",
              color: "#333",
              backgroundColor: "#fff",
              padding: "6px",
              borderRadius: "8px",
              boxShadow: "0 0 6px rgba(0,0,0,0.2)",
              cursor: "pointer",
            }}
          />
        </div>

        {/* Mobile Overlay */}
        {isSidebarOpen && screenWidth < 768 && (
          <div
            onClick={() => setIsSidebarOpen(false)}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              zIndex: 1049,
              background: "rgba(0,0,0,0.3)",
            }}
          />
        )}

        {/* Sidebar */}
        <div
          ref={wrapperRef}
          className={`${
            darkMode ? "bg-dark text-white" : "bg-light text-dark"
          } border-end position-fixed d-flex flex-column justify-content-between`}
          style={{
            width: sidebarWidth,
            height: "100vh",
            zIndex: 1050,
            transform: isSidebarOpen ? "translateX(0)" : "translateX(-100%)",
            transition: "transform 0.3s ease-in-out",
            maxWidth: "100vw",
            overflowX: "hidden",
          }}
        >
          <div>
            <h4 className="p-3 mb-0">SuperAdmin Panel</h4>
            <ul className="list-unstyled sidebar-links w-100 px-3 mt-3">
              <li
                className="mb-3 d-flex align-items-center sidebar-link"
                onClick={() => handleNavigate("/superadmin-dashboard")}
                style={{ cursor: "pointer" }}
              >
                <FaTachometerAlt className="me-2" />
                Dashboard
              </li>

              <li
                className="mb-3 d-flex align-items-center sidebar-link"
                onClick={() => handleNavigate("/create-admin")}
                style={{ cursor: "pointer" }}
              >
                <FaUserPlus className="me-2" />
                Create Admin
              </li>

              <li
                className="mb-3 d-flex align-items-center sidebar-link"
                onClick={() => handleNavigate("/all-admins")}
                style={{ cursor: "pointer" }}
              >
                <FaUserShield className="me-2" />
                View All Admins
              </li>
            </ul>
          </div>

          <div className="px-3 mb-3">
            <div
              className="sidebar-link d-flex align-items-center mb-3"
              onClick={toggleDarkMode}
              style={{ cursor: "pointer" }}
            >
              {darkMode ? <FaSun className="me-2" /> : <FaMoon className="me-2" />}
              {darkMode ? "Light Mode" : "Dark Mode"}
            </div>

            <div
              className="sidebar-link d-flex align-items-center"
              onClick={handleLogout}
              style={{ cursor: "pointer" }}
            >
              <FaSignOutAlt className="me-2" />
              Logout
            </div>
          </div>
        </div>

        {/* Internal styles */}
        <style>
          {`
            .sidebar-links .sidebar-link {
              display: block;
              padding: 10px 15px;
              color: inherit;
              font-weight: 600;
              border-radius: 4px;
              transition: background-color 0.3s ease, color 0.3s ease;
              white-space: nowrap;
              text-decoration: none;
            }

            .sidebar-links .sidebar-link:hover {
              background-color: #4748ac;
              color: #fff;
            }

            @media (max-width: 768px) {
              .sidebar-links .sidebar-link {
                font-size: 14px;
              }
              h4 {
                font-size: 18px !important;
              }
            }
          `}
        </style>
      </>
    )
  );
};

export default SuperAdminSidebar;
