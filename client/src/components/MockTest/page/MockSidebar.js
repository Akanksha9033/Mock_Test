
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import React, { useState, useEffect, useContext } from "react";
// import { AuthContext } from "../context/AuthContext";
// import "bootstrap/dist/css/bootstrap.min.css";
// import {
//   FaTachometerAlt,
//   FaFileAlt,
//   FaUser,
//   FaWallet,
//   FaAngleDoubleLeft,
//   FaAngleDoubleRight,
//   FaSignOutAlt,
// } from "react-icons/fa";

// const MockSidebar = () => {
//   const [isCollapsed, setIsCollapsed] = useState(false);
//   const location = useLocation();
//   const navigate = useNavigate();
//   const isExamPage = location.pathname.includes("/exam");

//   const { user, logout } = useContext(AuthContext);

//   useEffect(() => {
//     if (isExamPage) {
//       setIsCollapsed(true);
//     }
//   }, [location.pathname, isExamPage]);

//   const toggleSidebar = () => {
//     setIsCollapsed(!isCollapsed);
//   };

//   const handleLogout = () => {
//     logout();
//     navigate("/login");
//   };

//   return (
//     !isExamPage && (
//       <div>
//         {/* Sidebar */}
//         <div
//           className={`bg-light border-end p-3 sidebar position-fixed d-flex flex-column justify-content-between`}
//           style={{
//             width: isCollapsed ? "60px" : "250px",
//             height: "100vh",
//             zIndex: 1050,
//             overflow: "hidden",
//             transition: "width 0.3s ease",
//           }}
//         >
//           <div>
//             {!isCollapsed && (
//               <h4 className="mb-4" style={{ whiteSpace: "nowrap" }}>
//                 Admin Panel
//               </h4>
//             )}

//             <ul className="list-unstyled sidebar-links w-100">
//             <li className="mb-3 d-flex align-items-center">
//   {user ? (
//     (() => {
//       const role = user.role?.toLowerCase();
//       const dashboardLink =
//         role === "student"
//           ? "/student-dashboard"
//           : role === "teacher"
//           ? "/teacher-dashboard"
//           : role === "management"
//           ? "/management-dashboard"
//           : role === "admin"
//           ? "/admin-dashboard"
//           : "/unauthorized";

//       return (
//         <Link to={dashboardLink} className="sidebar-link d-flex align-items-center">
//           <FaTachometerAlt className="me-2" />
//           {!isCollapsed && "Dashboard"}
//         </Link>
//       );
//     })()
//   ) : (
//     <div className="sidebar-link d-flex align-items-center" style={{ opacity: 0.5 }}>
//       <FaTachometerAlt className="me-2" />
//       {!isCollapsed && "Dashboard"}
//     </div>
//   )}
// </li>







//               <li className="mb-3 d-flex align-items-center">
//                 <Link to="/mock-tests" className="sidebar-link d-flex align-items-center">
//                   <FaFileAlt className="me-2" />
//                   {!isCollapsed && "Mock Tests"}
//                 </Link>
//               </li>
//               <li className="mb-3 d-flex align-items-center">
//                 <Link to="/profile" className="sidebar-link d-flex align-items-center">
//                   <FaUser className="me-2" />
//                   {!isCollapsed && "Profile"}
//                 </Link>
//               </li>
//               <li className="mb-3 d-flex align-items-center">
//                 <Link to="/accounts" className="sidebar-link d-flex align-items-center">
//                   <FaWallet className="me-2" />
//                   {!isCollapsed && "Accounts"}
//                 </Link>
//               </li>
//             </ul>
//           </div>

//           {/* Logout Button */}
//           <div
//             className="sidebar-link d-flex align-items-center mb-2"
//             onClick={handleLogout}
//             style={{ cursor: "pointer" }}
//           >
//             <FaSignOutAlt className="me-2" />
//             {!isCollapsed && "Logout"}
//           </div>
//         </div>

//         {/* Toggle Button */}
//         <div
//           className="position-fixed"
//           style={{
//             top: "20px",
//             left: isCollapsed ? "60px" : "250px",
//             zIndex: 1060,
//             cursor: "pointer",
//             transition: "left 0.3s ease",
//           }}
//           onClick={toggleSidebar}
//         >
//           <span style={{ fontSize: "20px", color: "#000" }}>
//             {isCollapsed ? <FaAngleDoubleRight /> : <FaAngleDoubleLeft />}
//           </span>
//         </div>

//         {/* Internal CSS */}
//         <style>
//           {`
//             .sidebar-links .sidebar-link {
//               display: block;
//               padding: 10px 15px;
//               color: #343a40;
//               font-weight: 600;
//               border-radius: 4px;
//               transition: background-color 0.3s ease, color 0.3s ease, transform 0.3s;
//               white-space: nowrap;
//               text-decoration: none;
//             }
//             .sidebar-links .sidebar-link:hover,
//             .sidebar-link:hover {
//               background-color: #4748ac;
//               color: #fff;
//               transform: translateX(4px);
//             }
//           `}
//         </style>
//       </div>
//     )
//   );
// };

// export default MockSidebar;


// import { useLocation, useNavigate } from "react-router-dom";
// import React, { useState, useEffect, useContext, useRef } from "react";
// import { AuthContext } from "../context/AuthContext";
// import "bootstrap/dist/css/bootstrap.min.css";
// import {
//   FaTachometerAlt,
//   FaFileAlt,
//   FaUser,
//   FaWallet,
//   FaAngleDoubleLeft,
//   FaAngleDoubleRight,
//   FaSignOutAlt,
// } from "react-icons/fa";

// const MockSidebar = () => {
//   const [isCollapsed, setIsCollapsed] = useState(false);
//   const wrapperRef = useRef(null);
//   const location = useLocation();
//   const navigate = useNavigate();
//   const isExamPage = location.pathname.includes("/exam");
//   const { user, logout } = useContext(AuthContext);

//   // Collapse on exam page
//   useEffect(() => {
//     if (isExamPage) setIsCollapsed(true);
//   }, [isExamPage]);

//   // ✅ Collapse sidebar when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (
//         wrapperRef.current &&
//         !wrapperRef.current.contains(e.target) &&
//         !isCollapsed
//       ) {
//         setIsCollapsed(true);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () =>
//       document.removeEventListener("mousedown", handleClickOutside);
//   }, [isCollapsed]);

//   const toggleSidebar = () => setIsCollapsed(!isCollapsed);

//   const handleLogout = () => {
//     logout();
//     navigate("/login");
//   };

//   const handleNavigate = (path) => {
//     setIsCollapsed(true);
//     setTimeout(() => {
//       navigate(path);
//     }, 100);
//   };

//   return (
//     !isExamPage && (
//       <div ref={wrapperRef}>
//         {/* Sidebar */}
//         <div
//           className="bg-light border-end p-3 position-fixed d-flex flex-column justify-content-between"
//           style={{
//             width: isCollapsed ? "60px" : "250px",
//             height: "100vh",
//             zIndex: 1050,
//             overflow: "hidden",
//             transition: "width 0.3s ease",
//           }}
//         >
//           <div>
//             {!isCollapsed && (
//               <h4 className="mb-4" style={{ whiteSpace: "nowrap" }}>
//                 Admin Panel
//               </h4>
//             )}
//             <ul className="list-unstyled sidebar-links w-100">
//               <li
//                 className="mb-3 d-flex align-items-center sidebar-link"
//                 onClick={() => {
//                   if (user) {
//                     const role = user.role?.toLowerCase();
//                     const path =
//                       role === "student"
//                         ? "/student-dashboard"
//                         : role === "teacher"
//                         ? "/teacher-dashboard"
//                         : role === "management"
//                         ? "/management-dashboard"
//                         : role === "admin"
//                         ? "/admin-dashboard"
//                         : "/unauthorized";
//                     handleNavigate(path);
//                   }
//                 }}
//                 style={{ cursor: "pointer" }}
//               >
//                 <FaTachometerAlt className="me-2" />
//                 {!isCollapsed && "Dashboard"}
//               </li>

//               <li
//                 className="mb-3 d-flex align-items-center sidebar-link"
//                 onClick={() => handleNavigate("/mock-tests")}
//                 style={{ cursor: "pointer" }}
//               >
//                 <FaFileAlt className="me-2" />
//                 {!isCollapsed && "Mock Tests"}
//               </li>

//               <li
//                 className="mb-3 d-flex align-items-center sidebar-link"
//                 onClick={() => handleNavigate("/profile")}
//                 style={{ cursor: "pointer" }}
//               >
//                 <FaUser className="me-2" />
//                 {!isCollapsed && "Profile"}
//               </li>

//               <li
//                 className="mb-3 d-flex align-items-center sidebar-link"
//                 onClick={() => handleNavigate("/accounts")}
//                 style={{ cursor: "pointer" }}
//               >
//                 <FaWallet className="me-2" />
//                 {!isCollapsed && "Accounts"}
//               </li>
//             </ul>
//           </div>

//           <div
//             className="sidebar-link d-flex align-items-center mb-2"
//             onClick={handleLogout}
//             style={{ cursor: "pointer" }}
//           >
//             <FaSignOutAlt className="me-2" />
//             {!isCollapsed && "Logout"}
//           </div>
//         </div>

//         {/* Toggle Button */}
//         <div
//           className="position-fixed"
//           style={{
//             top: "20px",
//             left: isCollapsed ? "60px" : "250px",
//             zIndex: 1060,
//             cursor: "pointer",
//             transition: "left 0.3s ease",
//           }}
//           onClick={toggleSidebar}
//         >
//           <span style={{ fontSize: "20px", color: "#000" }}>
//             {isCollapsed ? <FaAngleDoubleRight /> : <FaAngleDoubleLeft />}
//           </span>
//         </div>

//         <style>
//           {`
//             .sidebar-links .sidebar-link {
//               display: block;
//               padding: 10px 15px;
//               color: #343a40;
//               font-weight: 600;
//               border-radius: 4px;
//               transition: background-color 0.3s ease, color 0.3s ease, transform 0.3s;
//               white-space: nowrap;
//               text-decoration: none;
//             }

//             .sidebar-links .sidebar-link:hover,
//             .sidebar-link:hover {
//               background-color: #4748ac;
//               color: #fff;
//               transform: translateX(4px);
//             }
//           `}
//         </style>
//       </div>
//     )
//   );
// };

// export default MockSidebar;



import { useLocation, useNavigate } from "react-router-dom";
import React, { useState, useEffect, useContext, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  FaTachometerAlt,
  FaFileAlt,
  FaUser,
  FaWallet,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaSignOutAlt,
} from "react-icons/fa";

const MockSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const wrapperRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const isExamPage = location.pathname.includes("/exam");
  const { user, logout } = useContext(AuthContext);

  // Collapse on exam page
  useEffect(() => {
    if (isExamPage) setIsCollapsed(true);
  }, [isExamPage]);

  // ✅ Collapse sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target) &&
        !isCollapsed &&
        window.innerWidth < 768
      ) {
        setIsCollapsed(true);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isCollapsed]);

  const toggleSidebar = (e) => {
    e.stopPropagation(); // ✅ prevents collapse when clicking toggle
    setIsCollapsed(!isCollapsed);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleNavigate = (path) => {
    setIsCollapsed(true);
    setTimeout(() => {
      navigate(path);
    }, 100);
  };

  return (
    !isExamPage && (
      <div ref={wrapperRef}>
        {/* Sidebar */}
        <div
          className="bg-light border-end p-3 position-fixed d-flex flex-column justify-content-between"
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
                Admin Panel
              </h4>
            )}
            <ul className="list-unstyled sidebar-links w-100">
              <li
                className="mb-3 d-flex align-items-center sidebar-link"
                onClick={() => {
                  if (user) {
                    const role = user.role?.toLowerCase();
                    const path =
                      role === "student"
                        ? "/student-dashboard"
                        : role === "teacher"
                        ? "/teacher-dashboard"
                        : role === "management"
                        ? "/management-dashboard"
                        : role === "admin"
                        ? "/admin-dashboard"
                        : "/unauthorized";
                    handleNavigate(path);
                  }
                }}
                style={{ cursor: "pointer" }}
              >
                <FaTachometerAlt className="me-2" />
                {!isCollapsed && "Dashboard"}
              </li>

              <li
                className="mb-3 d-flex align-items-center sidebar-link"
                onClick={() => handleNavigate("/mock-tests")}
                style={{ cursor: "pointer" }}
              >
                <FaFileAlt className="me-2" />
                {!isCollapsed && "Mock Tests"}
              </li>

              <li
                className="mb-3 d-flex align-items-center sidebar-link"
                onClick={() => handleNavigate("/profile")}
                style={{ cursor: "pointer" }}
              >
                <FaUser className="me-2" />
                {!isCollapsed && "Profile"}
              </li>

              <li
                className="mb-3 d-flex align-items-center sidebar-link"
                onClick={() => handleNavigate("/accounts")}
                style={{ cursor: "pointer" }}
              >
                <FaWallet className="me-2" />
                {!isCollapsed && "Accounts"}
              </li>
            </ul>
          </div>

          <div
            className="sidebar-link d-flex align-items-center mb-2"
            onClick={handleLogout}
            style={{ cursor: "pointer" }}
          >
            <FaSignOutAlt className="me-2" />
            {!isCollapsed && "Logout"}
          </div>
        </div>

        {/* Toggle Button (inside wrapperRef now) */}
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

            @media (max-width: 768px) {
              .sidebar-links .sidebar-link {
                font-size: 14px;
              }
            }
          `}
        </style>
      </div>
    )
  );
};

export default MockSidebar;
