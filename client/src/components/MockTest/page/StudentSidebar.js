import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  FaTachometerAlt,
  FaFileAlt,
  FaUser,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaSignOutAlt,
} from "react-icons/fa";
 
const StudentSidebar = ({ onToggleCollapse }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
 
  const toggleSidebar = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    if (onToggleCollapse) {
      onToggleCollapse(newCollapsedState);
    }
  };
 
  const handleLogout = () => {
    logout();
    navigate("/signin");
  };
 
  return (
    <div>
      <div
        className="bg-light border-end p-3 sidebar position-fixed d-flex flex-column justify-content-between"
        style={{
          width: isCollapsed ? "60px" : "250px",
          height: "100vh",
          zIndex: 1050,
          overflow: "hidden",
          transition: "width 0.3s ease",
        }}
      >
        <div>
          {!isCollapsed && (
            <h4 className="mb-4" style={{ whiteSpace: "nowrap" }}>
              Student Panel
            </h4>
          )}
          <ul className="list-unstyled sidebar-links w-100">
            <li className="mb-3 d-flex align-items-center">
              <Link to="/student-dashboard" className="sidebar-link d-flex align-items-center">
                <FaTachometerAlt className="me-2" />
                {!isCollapsed && "Dashboard"}
              </Link>
            </li>
            <li className="mb-3 d-flex align-items-center">
              <Link to="/mock-tests" className="sidebar-link d-flex align-items-center">
                <FaFileAlt className="me-2" />
                {!isCollapsed && "Mock Tests"}
              </Link>
            </li>
            <li className="mb-3 d-flex align-items-center">
              <Link to="/profile" className="sidebar-link d-flex align-items-center">
                <FaUser className="me-2" />
                {!isCollapsed && "Profile"}
              </Link>
            </li>
          </ul>
        </div>
        <div className="sidebar-link d-flex align-items-center mb-2" onClick={handleLogout} style={{ cursor: "pointer" }}>
          <FaSignOutAlt className="me-2" />
          {!isCollapsed && "Logout"}
        </div>
      </div>
 
      <div
        className="position-fixed"
        style={{
          top: "20px",
          left: isCollapsed ? "60px" : "250px",
          zIndex: 1060,
          cursor: "pointer",
          transition: "left 0.3s ease",
        }}
        onClick={toggleSidebar}
      >
        <span style={{ fontSize: "20px", color: "#000" }}>
          {isCollapsed ? <FaAngleDoubleRight /> : <FaAngleDoubleLeft />}
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
    </div>
  );
};
 
export default StudentSidebar;