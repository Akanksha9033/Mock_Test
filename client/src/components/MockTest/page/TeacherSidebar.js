// import React, { useState, useContext } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { AuthContext } from "../context/AuthContext";
// import {
//   FaTachometerAlt,
//   FaFileAlt,
//   FaUser,
//   FaWallet,
//   FaAngleDoubleLeft,
//   FaAngleDoubleRight,
//   FaSignOutAlt,
// } from "react-icons/fa";

// const TeacherSidebar = () => {
//   const [isCollapsed, setIsCollapsed] = useState(false);
//   const { logout } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const toggleSidebar = () => setIsCollapsed(!isCollapsed);

//   const handleLogout = () => {
//     logout();
//     navigate("/signin");
//   };

//   return (
//     <div>
//       <div
//         className={`bg-light border-end p-3 sidebar position-fixed d-flex flex-column justify-content-between`}
//         style={{
//           width: isCollapsed ? "60px" : "250px",
//           height: "100vh",
//           zIndex: 1050,
//           overflow: "hidden",
//           transition: "width 0.3s ease",
//         }}
//       >
//         <div>
//           {!isCollapsed && (
//             <h4 className="mb-4" style={{ whiteSpace: "nowrap" }}>
//               Teacher Panel
//             </h4>
//           )}
//           <ul className="list-unstyled sidebar-links w-100">
//             <li className="mb-3 d-flex align-items-center">
//               <Link to="/teacher-dashboard" className="sidebar-link d-flex align-items-center">
//                 <FaTachometerAlt className="me-2" />
//                 {!isCollapsed && "Dashboard"}
//               </Link>
//             </li>
//             <li className="mb-3 d-flex align-items-center">
//               <Link to="/mock-tests" className="sidebar-link d-flex align-items-center">
//                 <FaFileAlt className="me-2" />
//                 {!isCollapsed && "Mock Tests"}
//               </Link>
//             </li>
//             <li className="mb-3 d-flex align-items-center">
//               <Link to="/profile" className="sidebar-link d-flex align-items-center">
//                 <FaUser className="me-2" />
//                 {!isCollapsed && "Profile"}
//               </Link>
//             </li>
           
//           </ul>
//         </div>
//         <div className="sidebar-link d-flex align-items-center mb-2" onClick={handleLogout} style={{ cursor: "pointer" }}>
//           <FaSignOutAlt className="me-2" />
//           {!isCollapsed && "Logout"}
//         </div>
//       </div>

//       <div
//         className="position-fixed"
//         style={{
//           top: "20px",
//           left: isCollapsed ? "60px" : "250px",
//           zIndex: 1060,
//           cursor: "pointer",
//           transition: "left 0.3s ease",
//         }}
//         onClick={toggleSidebar}
//       >
//         <span style={{ fontSize: "20px", color: "#000" }}>
//           {isCollapsed ? <FaAngleDoubleRight /> : <FaAngleDoubleLeft />}
//         </span>
//       </div>

//       <style>
//         {`
//           .sidebar-links .sidebar-link {
//             display: block;
//             padding: 10px 15px;
//             color: #343a40;
//             font-weight: 600;
//             border-radius: 4px;
//             transition: background-color 0.3s ease, color 0.3s ease, transform 0.3s;
//             white-space: nowrap;
//             text-decoration: none;
//           }
//           .sidebar-links .sidebar-link:hover,
//           .sidebar-link:hover {
//             background-color: #4748ac;
//             color: #fff;
//             transform: translateX(4px);
//           }
//         `}
//       </style>
//     </div>
//   );
// };

// export default TeacherSidebar;



// import React, { useState, useContext, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import { AuthContext } from "../context/AuthContext";
// import {
//   FaTachometerAlt,
//   FaFileAlt,
//   FaUser,
//   FaSignOutAlt,
//   FaBars,
// } from "react-icons/fa";
 
// const TeacherSidebar = () => {
//   const [isCollapsed, setIsCollapsed] = useState(window.innerWidth < 768);
//   const { logout } = useContext(AuthContext);
//   const navigate = useNavigate();
//   const sidebarRef = useRef();
 
//   useEffect(() => {
//     const handleOutsideClick = (e) => {
//       if (
//         sidebarRef.current &&
//         !sidebarRef.current.contains(e.target) &&
//         window.innerWidth < 768
//       ) {
//         setIsCollapsed(true);
//       }
//     };
//     document.addEventListener("mousedown", handleOutsideClick);
//     return () => document.removeEventListener("mousedown", handleOutsideClick);
//   }, []);
 
//   const handleNavigate = (path) => {
//     navigate(path);
//     if (window.innerWidth < 768) {
//       setIsCollapsed(true);
//     }
//   };
 
//   const handleLogout = () => {
//     logout();
//     navigate("/signin");
//   };
 
//   const toggleSidebar = () => {
//     setIsCollapsed(false);
//   };
 
//   return (
//     <>
//       {/* FaBars toggle outside the sidebar */}
//       {isCollapsed && (
//         <div
//           className="position-fixed"
//           style={{
//             top: "20px",
//             left: "10px",
//             zIndex: 2100,
//             cursor: "pointer",
//           }}
//           onClick={toggleSidebar}
//         >
//           <FaBars
//             style={{
//               fontSize: "26px",
//               color: "#333",
//               backgroundColor: "#fff",
//               padding: "6px",
//               borderRadius: "8px",
//               boxShadow: "0 0 6px rgba(0,0,0,0.2)",
//             }}
//           />
//         </div>
//       )}
 
//       {/* Sidebar */}
//       <div
//         ref={sidebarRef}
//         className="bg-light border-end p-3 position-fixed d-flex flex-column justify-content-between"
//         style={{
//           top: 0,
//           left: 0,
//           bottom: 0,
//           width: "250px",
//           height: "100vh",
//           backgroundColor: "#fff",
//           zIndex: 2000,
//           transform: isCollapsed ? "translateX(-100%)" : "translateX(0)",
//           transition: "transform 0.3s ease-in-out",
//         }}
//       >
//         <div>
//           <h4 className="mb-4" style={{ whiteSpace: "nowrap" }}>
//             Teacher Panel
//           </h4>
//           <ul className="list-unstyled sidebar-links w-100">
//             <li className="mb-3 d-flex align-items-center" onClick={() => handleNavigate("/teacher-dashboard")}>
//               <div className="sidebar-link d-flex align-items-center" style={{ cursor: "pointer" }}>
//                 <FaTachometerAlt className="me-2" />
//                 Dashboard
//               </div>
//             </li>
//             <li className="mb-3 d-flex align-items-center" onClick={() => handleNavigate("/mock-tests")}>
//               <div className="sidebar-link d-flex align-items-center" style={{ cursor: "pointer" }}>
//                 <FaFileAlt className="me-2" />
//                 Mock Tests
//               </div>
//             </li>
//             <li className="mb-3 d-flex align-items-center" onClick={() => handleNavigate("/profile")}>
//               <div className="sidebar-link d-flex align-items-center" style={{ cursor: "pointer" }}>
//                 <FaUser className="me-2" />
//                 Profile
//               </div>
//             </li>
//           </ul>
//         </div>
//         <div
//           className="sidebar-link d-flex align-items-center mb-2"
//           onClick={handleLogout}
//           style={{ cursor: "pointer" }}
//         >
//           <FaSignOutAlt className="me-2" />
//           Logout
//         </div>
//       </div>
 
//       <style>
//         {`
//           .sidebar-links .sidebar-link {
//             padding: 10px 15px;
//             color: #343a40;
//             font-weight: 600;
//             border-radius: 4px;
//             transition: background-color 0.3s ease, transform 0.3s;
//             white-space: nowrap;
//           }
//           .sidebar-links .sidebar-link:hover {
//             background-color: #4748ac;
//             color: #fff;
//             transform: translateX(4px);
//           }
//         `}
//       </style>
//     </>
//   );
// };
 
// export default TeacherSidebar;






 
import React, { useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  FaTachometerAlt,
  FaFileAlt,
  FaUser,
  FaSignOutAlt,
  
} from "react-icons/fa";
 
const TeacherSidebar = ({ isCollapsed, setIsCollapsed, onToggleCollapse }) => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const sidebarRef = useRef();
 
  // Collapse when outside is clicked on small screens
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target) &&
        window.innerWidth < 768
      ) {
        setIsCollapsed(true);
        onToggleCollapse?.(true);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [setIsCollapsed, onToggleCollapse]);
 
  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    onToggleCollapse?.(newState);
  };
 
  const handleNavigate = (path) => {
    navigate(path);
    if (window.innerWidth < 768) {
      setIsCollapsed(true);
      onToggleCollapse?.(true);
    }
  };
 
  const handleLogout = () => {
    logout();
    navigate("/signin");
  };
 
  return (
    <>
      
 
      <div
        ref={sidebarRef}
        className="bg-light border-end p-3 position-fixed d-flex flex-column justify-content-between"
        style={{
          top: "54px",
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
            Teacher Panel
          </h4>
          <ul className="list-unstyled sidebar-links w-100">
            <li className="mb-3 d-flex align-items-center" onClick={() => handleNavigate("/teacher-dashboard")}>
              <div className="sidebar-link d-flex align-items-center" style={{ cursor: "pointer" }}>
                <FaTachometerAlt className="me-2" />
                Dashboard
              </div>
            </li>
            <li className="mb-3 d-flex align-items-center" onClick={() => handleNavigate("/mock-tests")}>
              <div className="sidebar-link d-flex align-items-center" style={{ cursor: "pointer" }}>
                <FaFileAlt className="me-2" />
                Mock Tests
              </div>
            </li>
            <li className="mb-3 d-flex align-items-center" onClick={() => handleNavigate("/profile")}>
              <div className="sidebar-link d-flex align-items-center" style={{ cursor: "pointer" }}>
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
 
      <style>{`
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
      `}</style>
    </>
  );
};
 
export default TeacherSidebar;
 