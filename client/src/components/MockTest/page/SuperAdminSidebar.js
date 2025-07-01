import React, { useState, useEffect, useContext, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  FaTachometerAlt,
  FaUserShield,
  FaUserPlus,
  FaSignOutAlt,
  FaMoon,
  FaSun,
  FaUser,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
 
const SuperAdminSidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
  const [darkMode, setDarkMode] = useState(false);
  const wrapperRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
 
  const isExamPage = location.pathname.includes("/exam");
  const sidebarWidth = 250;
 
  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
    setSidebarOpen((prev) => !prev);
  };
 
  const toggleDarkMode = () => setDarkMode(!darkMode);
 
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target) &&
        window.innerWidth < 768
      ) {
        setIsSidebarOpen(false);
        setSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
 
  useEffect(() => {
    const handleResize = () => {
      const shouldOpen = window.innerWidth >= 768;
      setIsSidebarOpen(shouldOpen);
      setSidebarOpen(shouldOpen);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
 
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
 
  const handleNavigate = (path) => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
      setSidebarOpen(false);
    }
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
            left: isSidebarOpen ? `${sidebarWidth + 10}px` : "10px",
            zIndex: 1100,
            transition: "left 0.3s ease-in-out",
          }}
        >
          {isSidebarOpen ? (
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
                 marginTop: "40px"
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
 
        {/* Sidebar */}
        <div
          ref={wrapperRef}
          className={`${
            darkMode ? "bg-dark text-white" : "bg-light text-dark"
          } border-end position-fixed d-flex flex-column justify-content-between`}
          style={{
            width: `${sidebarWidth}px`,
            height: "100vh",
            zIndex: 1050,
            transform: isSidebarOpen ? "translateX(0)" : "translateX(-100%)",
            transition: "transform 0.3s ease-in-out",
            overflowX: "hidden",
          }}
        >
          {/* Sidebar Content */}
          <div>
            <h4 className="p-3 mb-0" style={{ whiteSpace: "nowrap" }}>
              SuperAdmin Panel
            </h4>
 
            <ul className="list-unstyled sidebar-links w-100 px-3 mt-3">
              <li className="sidebar-link" onClick={() => handleNavigate("/superadmin-dashboard")}>
                <FaTachometerAlt className="me-2" /> Dashboard
              </li>
              <li className="sidebar-link" onClick={() => handleNavigate("/create-admin")}>
                <FaUserPlus className="me-2" /> Create Admin
              </li>
              <li className="sidebar-link" onClick={() => handleNavigate("/all-admins")}>
                <FaUserShield className="me-2" /> View All Admins
              </li>
              <li className="sidebar-link" onClick={() => handleNavigate("/superadmin/accounts")}>
                <FaUser className="me-2" /> All Accounts
              </li>
            </ul>
          </div>
 
       
        </div>
 
        {/* Styles */}
        <style>
          {`
            .sidebar-links .sidebar-link {
              display: flex;
              align-items: center;
              padding: 10px 15px;
              font-size: 15px;
              color: inherit;
              font-weight: 600;
              border-radius: 6px;
              transition: background-color 0.3s ease;
              cursor: pointer;
              white-space: nowrap;
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