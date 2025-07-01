// import { useState, useEffect, useContext } from "react";
// import { useNavigate, useLocation, Link } from "react-router-dom";
// import { AuthContext } from "../context/AuthContext";
// import {
//   FaTrash,
//   FaEye,
//   FaEyeSlash,
//   FaFilter,
//   FaSearch,
//   FaTachometerAlt,
//   FaFileAlt,
//   FaUser,
//   FaWallet,
//   FaAngleDoubleLeft,
//   FaAngleDoubleRight,
//   FaSignOutAlt,
// } from "react-icons/fa";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "../MockTestPage.css";
// import LoadingAnimation from "../../LoadingAnimation";

// // const REACT_APP_API_URL = "https://mocktest-ljru.onrender.com";
// const REACT_APP_API_URL = process.env.REACT_APP_API_URL;
// const MockTests = () => {
//   const { user } = useContext(AuthContext);
//   const [mockTestsData, setMockTestsData] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [showFilterOptions, setShowFilterOptions] = useState(false);
//   const [isCollapsed, setIsCollapsed] = useState(false);
//   const [loading, setLoading] = useState(true);

//   const navigate = useNavigate();
//   const location = useLocation();
//   const isExamPage = location.pathname.includes("/exam");

//   useEffect(() => {
//     fetchMockTests();
//     if (isExamPage) setIsCollapsed(true);
//   }, [location.pathname]);

//   const fetchMockTests = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch(`${REACT_APP_API_URL}/api/admin/mock-tests`);
//       if (response.ok) {
//         const data = await response.json();
//         setMockTestsData(data);
//       } else {
//         console.error("Failed to fetch mock tests");
//       }
//     } catch (error) {
//       console.error("Error fetching mock tests:", error);
//     }
//     setLoading(false);
//   };

//   const handleToggleStatus = async (testId, currentStatus) => {
//     const newStatus = currentStatus === "active" ? "inactive" : "active";
//     try {
//       const res = await fetch(
//         `${REACT_APP_API_URL}/api/admin/mock-tests/${testId}/status`,
//         {
//           method: "PATCH",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ status: newStatus }),
//         }
//       );
//       if (res.ok) fetchMockTests();
//     } catch (err) {
//       console.error("Error updating test status:", err);
//     }
//   };

//   const handleDeleteTest = async (testId) => {
//     const confirmDelete = window.confirm(
//       "Do you want to delete this test permanently?"
//     );
//     if (!confirmDelete) return;

//     try {
//       const res = await fetch(
//         `${REACT_APP_API_URL}/api/admin/mock-tests/${testId}`,
//         {
//           method: "DELETE",
//         }
//       );
//       if (res.ok) fetchMockTests();
//     } catch (err) {
//       console.error("Error deleting test:", err);
//     }
//   };

//   const handleLogout = () => {
//     localStorage.clear();
//     navigate("/login");
//   };

//   const filteredTests = mockTestsData.filter((test) => {
//     const matchesSearch = (test?.title || "")
//       .toLowerCase()
//       .includes(searchTerm.toLowerCase());
//     const matchesStatus =
//       statusFilter === "all"
//         ? true
//         : (test?.status || "").toLowerCase() === statusFilter;

//     return matchesSearch && matchesStatus;
//   });

//   const renderSidebar = () => (
//     <>
//       <div
//         className="bg-light border-end p-3 position-fixed d-flex flex-column justify-content-between"
//         style={{
//           width: isCollapsed ? "60px" : "250px",
//           height: "100vh",
//           transition: "width 0.3s ease",
//           zIndex: 1050,
//           overflow: "hidden",
//         }}
//       >
//         <div>
//           {!isCollapsed && <h4 className="mb-4">{user.role} Panel</h4>}
//           <ul className="list-unstyled sidebar-links w-100">
//             <li className="mb-3 d-flex align-items-center">
//               <Link
//                 to={`/${user.role.toLowerCase()}-dashboard`}
//                 className="sidebar-link d-flex align-items-center"
//               >
//                 <FaTachometerAlt className="me-2" />
//                 {!isCollapsed && "Dashboard"}
//               </Link>
//             </li>
//             <li className="mb-3 d-flex align-items-center">
//               <Link
//                 to="/mock-tests"
//                 className="sidebar-link d-flex align-items-center"
//               >
//                 <FaFileAlt className="me-2" />
//                 {!isCollapsed && "Mock Tests"}
//               </Link>
//             </li>
//             <li className="mb-3 d-flex align-items-center">
//               <Link
//                 to="/profile"
//                 className="sidebar-link d-flex align-items-center"
//               >
//                 <FaUser className="me-2" />
//                 {!isCollapsed && "Profile"}
//               </Link>
//             </li>
//             {user.role?.toLowerCase() === "admin" && (
//               <li className="mb-3 d-flex align-items-center">
//                 <Link
//                   to="/Users"
//                   className="sidebar-link d-flex align-items-center"
//                 >
//                   <FaWallet className="me-2" />
//                   {!isCollapsed && "Users"}
//                 </Link>
//               </li>
//             )}
//           </ul>
//         </div>
//         <div
//           className="sidebar-link d-flex align-items-center mb-2"
//           onClick={handleLogout}
//           style={{
//             cursor: "pointer",
//             padding: "10px 15px",
//             color: "#343a40",
//             fontWeight: "600",
//           }}
//         >
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
//         onClick={() => setIsCollapsed(!isCollapsed)}
//       >
//         <span style={{ fontSize: "20px", color: "#000" }}>
//           {isCollapsed ? <FaAngleDoubleRight /> : <FaAngleDoubleLeft />}
//         </span>
//       </div>
//     </>
//   );

//   return (
//     <div className="d-flex">
//       {!isExamPage && renderSidebar()}

//       <div
//         className="container mt-4"
//         style={{
//           marginLeft: !isExamPage ? (isCollapsed ? "60px" : "250px") : "0px",
//           transition: "margin-left 0.3s ease",
//         }}
//       >
//         <style>
//           {`
//             .card {
//               overflow: hidden;
//               position: relative;
//             }
//             .hover-card-img {
//               transition: transform 0.3s ease-in-out;
//               will-change: transform;
//             }
//             .card:hover .hover-card-img {
//               transform: scale(1.05);
//             }
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
//             .sidebar-links .sidebar-link:hover {
//               background-color: #4748ac;
//               color: #fff;
//               transform: translateX(4px);
//             }
//             .test-time {
//               position: absolute;
//               top: 10px;
//               right: 10px;
//               background-color: rgba(0, 0, 0, 0.7);
//               color: white;
//               padding: 5px 10px;
//               border-radius: 5px;
//               font-size: 0.9rem;
//             }
//           `}
//         </style>

//         <button type="button" className="back-btn-custom mb-3" onClick={() => navigate(-1)}>
//           ← Back
//         </button>

//         <h1 className="text-2xl font-bold mb-3">Available Mock Tests</h1>

//         <div className="d-flex align-items-center gap-2 mb-3">
//           <div className="input-group" style={{ maxWidth: "300px" }}>
//             <span className="input-group-text">
//               <FaSearch />
//             </span>
//             <input
//               type="text"
//               className="form-control"
//               placeholder="Search test by name"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>

//           <div className="position-relative">
//             <button
//               type="button"
//               className="btn btn-outline-dark d-flex align-items-center"
//               onClick={() => setShowFilterOptions((prev) => !prev)}
//             >
//               <FaFilter className="me-1" /> Filter
//             </button>
//             {showFilterOptions && (
//               <div
//                 className="position-absolute bg-white border rounded p-2 mt-2 shadow"
//                 style={{ zIndex: 10 }}
//               >
//                 <button type="button" className="dropdown-item" onClick={() => setStatusFilter("all")}>
//                   All
//                 </button>
//                 <button type="button" className="dropdown-item" onClick={() => setStatusFilter("active")}>
//                   Active
//                 </button>
//                 <button type="button" className="dropdown-item" onClick={() => setStatusFilter("inactive")}>
//                   Inactive
//                 </button>
//               </div>
//             )}
//           </div>

//           {(user?.role?.toLowerCase() === "admin" || user?.role?.toLowerCase() === "teacher") && (
//     <button
//       type="button"
//       className="btn btn-success ms-auto"
//       onClick={() => {
//         navigate("/create-mock-test");
//       }}
//     >
//       Create Mock
//     </button>
//   )}

//         </div>

//         {loading ? (
//           <LoadingAnimation />
//         ) : filteredTests.length === 0 ? (
//           <div className="alert alert-warning text-center" role="alert">
//             No mock tests found.
//           </div>
//         ) : (
//           <div className="row">
//             {filteredTests.map((test) => (
//               <div key={test._id} className="col-md-4">
//                 <div className="card mb-3 shadow">
//                   {test.wallpaper && (
//                     <div
//                       style={{
//                         cursor :
//                           user?.role?.toLowerCase() === 'admin' || user?.role?.toLowerCase() === 'teacher' || (user?.role?.toLowerCase() === 'student' && test.status === 'active') ? 'pointer' : 'not-allowed'
//                       }}
//                       onClick={() => {
//                         if (
//                           test.status === "active" &&
//                           user?.role?.toLowerCase() === "student"
//                         ) {
//                           navigate(`/test-overview/${test._id}`);
//                         }
//                         else if(user?.role?.toLowerCase() === 'admin'){
//                             navigate(`/exam/${test._id}`)
//                         }
//                         else if(user?.role?.toLowerCase() === 'teacher'){
//                           navigate(`/exam/${test._id}`)
//                         }
//                       }}
//                     >
//                       <img
//                         src={test.wallpaper}
//                         alt="Test Wallpaper"
//                         className="card-img-top hover-card-img"
//                         style={{
//                           height: "180px",
//                           objectFit: "cover",
//                           opacity: test.status === "active" ? 1 : 0.6,
//                         }}
//                       />
//                     </div>

//                   )}
//                   <div className="card-body">
//                     <h5 className="card-title">{test.title}</h5>
//                     <p className="card-text">
//                       {test.isFree ? "Free" : `Price: ₹${test.price}`}
//                     </p>
//                     <p>
//                       Status:{" "}
//                       <span
//                         style={{
//                           color: "white",
//                           padding: "3px 8px",
//                           borderRadius: "5px",
//                           backgroundColor:
//                             test.status === "active" ? "green" : "red",
//                         }}
//                       >
//                         {test.status === "active" ? "Active" : "Inactive"}
//                       </span>
//                     </p>
//                     {test.duration && (
//                       <div className="test-time">
//                         Time: {test.duration}{" "}
//                         {test.duration > 1 ? "minutes" : "minute"}
//                       </div>
//                     )}
//                     {user?.role?.toLowerCase() === "student" &&
//                       (test.status === "active" ? (
//                         <button
//                           type="button"
//                           className="btn btn-primary"
//                           onClick={() => navigate(`/test-overview/${test._id}`)}
//                         >
//                           Start Test
//                         </button>
//                       ) : (
//                         <p className="text-danger fw-bold mt-2">
//                           Test is currently inactive
//                         </p>
//                       ))}

//                     {user?.role?.toLowerCase() === "admin" && (
//                       <>
//                         <button
//                           type="button"
//                           className="btn btn-primary"
//                           onClick={() => navigate(`/exam/${test._id}`)}
//                         >
//                           Edit Test
//                         </button>
//                         <button
//                           type="button"
//                           className="btn btn-outline-secondary ms-2"
//                           onClick={() =>
//                             handleToggleStatus(test._id, test.status)
//                           }
//                         >
//                           {test.status === "active" ? <FaEye /> : <FaEyeSlash />}
//                         </button>
//                         <button
//                           type="button"
//                           className="btn btn-outline-danger ms-2"
//                           onClick={() => handleDeleteTest(test._id)}
//                         >
//                           <FaTrash />
//                         </button>
//                       </>
//                     )}

//                     {user?.role?.toLowerCase() === "teacher" && (
//                       <>
//                         <button
//                           type="button"
//                           className="btn btn-info me-2"
//                           onClick={() =>
//                             navigate(`/exam/${test._id}?mode=view`)
//                           }
//                         >
//                           View Test
//                         </button>
//                         <button
//                           type="button"
//                           className="btn btn-outline-secondary ms-2"
//                           onClick={(e) =>{
//                             e.preventDefault();
//                             handleToggleStatus(test._id, test.status);
//                           }}
//                         >
//                           {test.status === "active" ? <FaEye /> : <FaEyeSlash />}
//                         </button>
//                       </>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default MockTests;

// import { useState, useEffect, useContext, useRef } from "react";
// import { useNavigate, useLocation, Link } from "react-router-dom";
// import { AuthContext } from "../context/AuthContext";
// import {
//   FaTrash,
//   FaEye,
//   FaEyeSlash,
//   FaFilter,
//   FaSearch,
//   FaTachometerAlt,
//   FaFileAlt,
//   FaUser,
//   FaWallet,
//   FaAngleDoubleLeft,
//   FaAngleDoubleRight,
//   FaSignOutAlt,
// } from "react-icons/fa";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "../MockTestPage.css";
// import LoadingAnimation from "../../LoadingAnimation";

// const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

// const MockTests = () => {
//   const { user } = useContext(AuthContext);
//   const [mockTestsData, setMockTestsData] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [showFilterOptions, setShowFilterOptions] = useState(false);
//   const [isCollapsed, setIsCollapsed] = useState(false);
//   const [loading, setLoading] = useState(true);

//   const navigate = useNavigate();
//   const location = useLocation();
//   const isExamPage = location.pathname.includes("/exam");

//   const sidebarRef = useRef(null); // 👉 Sidebar reference

//   useEffect(() => {
//     fetchMockTests();
//     if (isExamPage) setIsCollapsed(true);
//   }, [location.pathname]);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (
//         sidebarRef.current &&
//         !sidebarRef.current.contains(event.target) &&
//         !isCollapsed
//       ) {
//         setIsCollapsed(true);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [isCollapsed]);

//   const fetchMockTests = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch(`${REACT_APP_API_URL}/api/admin/mock-tests`);
//       if (response.ok) {
//         const data = await response.json();
//         setMockTestsData(data);
//       } else {
//         console.error("Failed to fetch mock tests");
//       }
//     } catch (error) {
//       console.error("Error fetching mock tests:", error);
//     }
//     setLoading(false);
//   };

//   const handleToggleStatus = async (testId, currentStatus) => {
//     const newStatus = currentStatus === "active" ? "inactive" : "active";
//     try {
//       const res = await fetch(
//         `${REACT_APP_API_URL}/api/admin/mock-tests/${testId}/status`,
//         {
//           method: "PATCH",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ status: newStatus }),
//         }
//       );
//       if (res.ok) fetchMockTests();
//     } catch (err) {
//       console.error("Error updating test status:", err);
//     }
//   };

//   const handleDeleteTest = async (testId) => {
//     const confirmDelete = window.confirm("Do you want to delete this test permanently?");
//     if (!confirmDelete) return;

//     try {
//       const res = await fetch(`${REACT_APP_API_URL}/api/admin/mock-tests/${testId}`, {
//         method: "DELETE",
//       });
//       if (res.ok) fetchMockTests();
//     } catch (err) {
//       console.error("Error deleting test:", err);
//     }
//   };

//   const handleLogout = () => {
//     localStorage.clear();
//     navigate("/login");
//   };

//   const filteredTests = mockTestsData.filter((test) => {
//     const matchesSearch = (test?.title || "")
//       .toLowerCase()
//       .includes(searchTerm.toLowerCase());
//     const matchesStatus =
//       statusFilter === "all"
//         ? true
//         : (test?.status || "").toLowerCase() === statusFilter;

//     return matchesSearch && matchesStatus;
//   });

//   const renderSidebar = () => (
//     <>
//       <div
//         ref={sidebarRef} // 👈 Ref added here
//         className="bg-light border-end p-3 position-fixed d-flex flex-column justify-content-between"
//         style={{
//           width: isCollapsed ? "60px" : "250px",
//           height: "100vh",
//           transition: "width 0.3s ease",
//           zIndex: 1050,
//           overflow: "hidden",
//         }}
//       >
//         <div>
//           {!isCollapsed && <h4 className="mb-4">{user.role} Panel</h4>}
//           <ul className="list-unstyled sidebar-links w-100">
//             <li className="mb-3 d-flex align-items-center">
//               <Link to={`/${user.role.toLowerCase()}-dashboard`} className="sidebar-link d-flex align-items-center">
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
//             {user.role?.toLowerCase() === "admin" && (
//               <li className="mb-3 d-flex align-items-center">
//                 <Link to="/Users" className="sidebar-link d-flex align-items-center">
//                   <FaWallet className="me-2" />
//                   {!isCollapsed && "Users"}
//                 </Link>
//               </li>
//             )}
//           </ul>
//         </div>

//         <div
//           className="sidebar-link d-flex align-items-center mb-2"
//           onClick={handleLogout}
//           style={{
//             cursor: "pointer",
//             padding: "10px 15px",
//             color: "#343a40",
//             fontWeight: "600",
//           }}
//         >
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
//         onClick={() => setIsCollapsed(!isCollapsed)}
//       >
//         <span style={{ fontSize: "20px", color: "#000" }}>
//           {isCollapsed ? <FaAngleDoubleRight /> : <FaAngleDoubleLeft />}
//         </span>
//       </div>
//     </>
//   );

//   return (
//     <div className="d-flex">
//       {!isExamPage && renderSidebar()}

//       <div
//         className="container mt-4"
//         style={{
//           marginLeft: !isExamPage ? (isCollapsed ? "60px" : "250px") : "0px",
//           transition: "margin-left 0.3s ease",
//         }}
//       >
//         <style>
//           {`
//             .card {
//               overflow: hidden;
//               position: relative;
//             }
//             .hover-card-img {
//               transition: transform 0.3s ease-in-out;
//               will-change: transform;
//             }
//             .card:hover .hover-card-img {
//               transform: scale(1.05);
//             }
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
//             .sidebar-links .sidebar-link:hover {
//               background-color: #4748ac;
//               color: #fff;
//               transform: translateX(4px);
//             }
//             .test-time {
//               position: absolute;
//               top: 10px;
//               right: 10px;
//               background-color: rgba(0, 0, 0, 0.7);
//               color: white;
//               padding: 5px 10px;
//               border-radius: 5px;
//               font-size: 0.9rem;
//             }
//           `}
//         </style>

//         <h1
//           style={{
//             textAlign: "center",
//             fontWeight: "bold",
//             fontSize: "34px",
//             marginBottom: "1rem",
//             marginTop: "1rem",
//           }}
//         >
//           Available Mock Tests
//         </h1>

//         <div className="d-flex align-items-center gap-2 mb-3">
//           <div className="input-group" style={{ maxWidth: "300px" }}>
//             <span className="input-group-text">
//               <FaSearch />
//             </span>
//             <input
//               type="text"
//               className="form-control"
//               placeholder="Search test by name"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>

//           <div className="position-relative">
//             <button
//               type="button"
//               className="btn btn-outline-dark d-flex align-items-center"
//               onClick={() => setShowFilterOptions((prev) => !prev)}
//             >
//               <FaFilter className="me-1" /> Filter
//             </button>
//             {showFilterOptions && (
//               <div className="position-absolute bg-white border rounded p-2 mt-2 shadow" style={{ zIndex: 10 }}>
//                 <button type="button" className="dropdown-item" onClick={() => setStatusFilter("all")}>All</button>
//                 <button type="button" className="dropdown-item" onClick={() => setStatusFilter("active")}>Active</button>
//                 <button type="button" className="dropdown-item" onClick={() => setStatusFilter("inactive")}>Inactive</button>
//               </div>
//             )}
//           </div>

//           {(user?.role?.toLowerCase() === "admin" || user?.role?.toLowerCase() === "teacher") && (
//             <button
//               type="button"
//               className="btn btn-success ms-auto"
//               onClick={() => {
//                 navigate("/create-mock-test");
//               }}
//             >
//               Create Mock
//             </button>
//           )}
//         </div>

//         {loading ? (
//           <LoadingAnimation />
//         ) : filteredTests.length === 0 ? (
//           <div className="alert alert-warning text-center" role="alert">
//             No mock tests found.
//           </div>
//         ) : (
//           <div className="row">
//             {filteredTests.map((test) => (
//               <div key={test._id} className="col-md-4">
//                 <div className="card mb-3 shadow">
//                   {test.wallpaper && (
//                     <div
//                       style={{
//                         cursor:
//                           user?.role?.toLowerCase() === "admin" ||
//                           user?.role?.toLowerCase() === "teacher" ||
//                           (user?.role?.toLowerCase() === "student" && test.status === "active")
//                             ? "pointer"
//                             : "not-allowed",
//                       }}
//                       onClick={() => {
//                         if (test.status === "active" && user?.role?.toLowerCase() === "student") {
//                           navigate(`/test-overview/${test._id}`);
//                         } else if (user?.role?.toLowerCase() === "admin" || user?.role?.toLowerCase() === "teacher") {
//                           navigate(`/exam/${test._id}`);
//                         }
//                       }}
//                     >
//                       <img
//                         src={test.wallpaper}
//                         alt="Test Wallpaper"
//                         className="card-img-top hover-card-img"
//                         style={{
//                           height: "180px",
//                           objectFit: "cover",
//                           opacity: test.status === "active" ? 1 : 0.6,
//                         }}
//                       />
//                     </div>
//                   )}
//                   <div className="card-body">
//                     <h5 className="card-title">{test.title}</h5>
//                     <p className="card-text">{test.isFree ? "Free" : `Price: ₹${test.price}`}</p>
//                     <p>
//                       Status:{" "}
//                       <span
//                         style={{
//                           color: "white",
//                           padding: "3px 8px",
//                           borderRadius: "5px",
//                           backgroundColor: test.status === "active" ? "green" : "red",
//                         }}
//                       >
//                         {test.status === "active" ? "Active" : "Inactive"}
//                       </span>
//                     </p>
//                     {test.duration && (
//                       <div className="test-time">
//                         Time: {test.duration} {test.duration > 1 ? "minutes" : "minute"}
//                       </div>
//                     )}
//                     {user?.role?.toLowerCase() === "student" &&
//                       (test.status === "active" ? (
//                         <button
//                           type="button"
//                           className="btn btn-primary"
//                           onClick={() => navigate(`/test-overview/${test._id}`)}
//                         >
//                           Start Test
//                         </button>
//                       ) : (
//                         <p className="text-danger fw-bold mt-2">Test is currently inactive</p>
//                       ))}

//                     {user?.role?.toLowerCase() === "admin" && (
//                       <>
//                         <button
//                           type="button"
//                           className="btn btn-primary"
//                           onClick={() => navigate(`/exam/${test._id}`)}
//                         >
//                           Edit Test
//                         </button>
//                         <button
//                           type="button"
//                           className="btn btn-outline-secondary ms-2"
//                           onClick={() => handleToggleStatus(test._id, test.status)}
//                         >
//                           {test.status === "active" ? <FaEye /> : <FaEyeSlash />}
//                         </button>
//                         <button
//                           type="button"
//                           className="btn btn-outline-danger ms-2"
//                           onClick={() => handleDeleteTest(test._id)}
//                         >
//                           <FaTrash />
//                         </button>
//                       </>
//                     )}

//                     {user?.role?.toLowerCase() === "teacher" && (
//                       <>
//                         <button
//                           type="button"
//                           className="btn btn-info me-2"
//                           onClick={() => navigate(`/exam/${test._id}?mode=view`)}
//                         >
//                           View Test
//                         </button>
//                         <button
//                           type="button"
//                           className="btn btn-outline-secondary ms-2"
//                           onClick={(e) => {
//                             e.preventDefault();
//                             handleToggleStatus(test._id, test.status);
//                           }}
//                         >
//                           {test.status === "active" ? <FaEye /> : <FaEyeSlash />}
//                         </button>
//                       </>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default MockTests;

import { useState, useEffect, useContext, useRef } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  FaTrash,
  FaEye,
  FaEyeSlash,
  FaFilter,
  FaSearch,
  FaTachometerAlt,
  FaFileAlt,
  FaUser,
  FaWallet,
  FaSignOutAlt,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "../MockTestPage.css";
import LoadingAnimation from "../../LoadingAnimation";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const handleBuyTest = async (testId, amount, userId) => {
  await loadRazorpayScript();

  const res = await fetch("http://localhost:5000/api/payment/create-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount, testId }),
  });

  const { order } = await res.json();

  const options = {
    key: "YOUR_RAZORPAY_KEY_ID", // 🔁 Replace with real key
    amount: order.amount,
    currency: order.currency,
    name: "Mock Test",
    description: "Access for 1 Year",
    order_id: order.id,
    handler: async function (response) {
      const verifyRes = await fetch(
        "http://localhost:5000/api/payment/verify-payment",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            testId,
            ...response,
          }),
        }
      );

      const result = await verifyRes.json();
      if (result.success) {
        alert("✅ Payment Successful! Test access granted.");
      } else {
        alert("❌ Payment verification failed.");
      }
    },
    prefill: {
      name: "Student User",
      email: "test@example.com",
      contact: "9999999999",
    },
    theme: { color: "#0a5db6" },
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
};

const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

const MockTests = () => {
  const { user } = useContext(AuthContext);
  const [mockTestsData, setMockTestsData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();
  const isExamPage = location.pathname.includes("/exam");

  const sidebarRef = useRef(null);

  useEffect(() => {
    fetchMockTests();
  }, [location.pathname]);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        window.innerWidth < 768
      ) {
        setIsSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const fetchMockTests = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      let url;

      if (user.role?.toLowerCase() === "student") {
        url = `${REACT_APP_API_URL}/api/admin/student-visible-tests`;
      } else if (user.role?.toLowerCase() === "teacher") {
        url = `${REACT_APP_API_URL}/api/admin/teacher-visible-tests`; // ✅ newly added route
      } else {
        url = `${REACT_APP_API_URL}/api/admin/mock-tests`; // for Admins
      }

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setMockTestsData(data);
      } else {
        console.error("Failed to fetch mock tests");
      }
    } catch (error) {
      console.error("Error fetching mock tests:", error);
    }
    setLoading(false);
  };

  const handleToggleStatus = async (testId, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      const res = await fetch(
        `${REACT_APP_API_URL}/api/admin/mock-tests/${testId}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        }
      );
      if (res.ok) fetchMockTests();
    } catch (err) {
      console.error("Error updating test status:", err);
    }
  };

  const handleDeleteTest = async (testId) => {
    const confirmDelete = window.confirm(
      "Do you want to delete this test permanently?"
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(
        `${REACT_APP_API_URL}/api/admin/mock-tests/${testId}`,
        {
          method: "DELETE",
        }
      );
      if (res.ok) fetchMockTests();
    } catch (err) {
      console.error("Error deleting test:", err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const filteredTests = Array.isArray(mockTestsData)
    ? mockTestsData.filter((test) => {
        const matchesSearch = (test?.title || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

        const matchesStatus =
          statusFilter === "all"
            ? true
            : (test?.status || "").toLowerCase() === statusFilter;

        return matchesSearch && matchesStatus;
      })
    : [];

  const renderSidebar = () => (
    <div
      ref={sidebarRef}
      className="bg-light border-end p-3 position-fixed d-flex flex-column justify-content-between"
      style={{
        width: "250px",
        height: "100vh",
        transition: "transform 0.3s ease-in-out",
        transform: isSidebarOpen ? "translateX(0)" : "translateX(-100%)",
        zIndex: 1050,
      }}
    >
      <div>
        <h4 className="mb-4">{user.role} Panel</h4>
        <ul className="list-unstyled sidebar-links w-100">
          <li className="mb-3 d-flex align-items-center">
            <Link
              to={`/${user.role.toLowerCase()}-dashboard`}
              className="sidebar-link d-flex align-items-center"
            >
              <FaTachometerAlt className="me-2" /> Dashboard
            </Link>
          </li>
          <li className="mb-3 d-flex align-items-center">
            <Link
              to="/mock-tests"
              className="sidebar-link d-flex align-items-center"
            >
              <FaFileAlt className="me-2" /> Mock Tests
            </Link>
          </li>
          <li className="mb-3 d-flex align-items-center">
            <Link
              to="/profile"
              className="sidebar-link d-flex align-items-center"
            >
              <FaUser className="me-2" /> Profile
            </Link>
          </li>
          {user.role?.toLowerCase() === "admin" && (
            <li className="mb-3 d-flex align-items-center">
              <Link
                to="/Users"
                className="sidebar-link d-flex align-items-center"
              >
                <FaWallet className="me-2" /> Users
              </Link>
            </li>
          )}
        </ul>
      </div>
      <div
        className="sidebar-link d-flex align-items-center mb-2"
        onClick={handleLogout}
        style={{
          cursor: "pointer",
          padding: "10px 15px",
          color: "#343a40",
          fontWeight: "600",
        }}
      >
        <FaSignOutAlt className="me-2" /> Logout
      </div>
    </div>
  );
  return (
    <div className="d-flex">
      {!isExamPage && renderSidebar()}

      {!isExamPage && (
        <div
          className="position-fixed"
          style={{
            top: "20px",
            left: isSidebarOpen ? "260px" : "10px",
            zIndex: 1100,
            transition: "left 0.3s ease",
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
      )}

      <div
        className="container mt-4"
        style={{
          marginLeft:
            !isExamPage && window.innerWidth >= 768
              ? isSidebarOpen
                ? "250px"
                : "80px"
              : "0px",
          transition: "all 0.3s ease",
          filter:
            !isExamPage && isSidebarOpen && window.innerWidth < 768
              ? "blur(4px)"
              : "none",
          pointerEvents:
            !isExamPage && isSidebarOpen && window.innerWidth < 768
              ? "none"
              : "auto",
        }}
      >
        <style>
          {`
            .card {
              overflow: hidden;
              position: relative;
            }
            .hover-card-img {
              transition: transform 0.3s ease-in-out;
              will-change: transform;
            }
            .card:hover .hover-card-img {
              transform: scale(1.05);
            }
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
            .sidebar-links .sidebar-link:hover {
              background-color: #4748ac;
              color: #fff;
              transform: translateX(4px);
            }
            .test-time {
              position: absolute;
              top: 10px;
              right: 10px;
              background-color: rgba(0, 0, 0, 0.7);
              color: white;
              padding: 5px 10px;
              border-radius: 5px;
              font-size: 0.9rem;
            }
          `}
        </style>

        <h1
          style={{
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "34px",
            marginBottom: "1rem",
            marginTop: "1rem",
          }}
        >
          Available Mock Tests
        </h1>

        <div className="d-flex align-items-center gap-2 mb-3">
          <div className="input-group" style={{ maxWidth: "300px" }}>
            <span className="input-group-text">
              <FaSearch />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search test by name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="position-relative">
            <button
              type="button"
              className="btn btn-outline-dark d-flex align-items-center"
              onClick={() => setShowFilterOptions((prev) => !prev)}
            >
              <FaFilter className="me-1" /> Filter
            </button>
            {showFilterOptions && (
              <div
                className="position-absolute bg-white border rounded p-2 mt-2 shadow"
                style={{ zIndex: 10 }}
              >
                <button
                  type="button"
                  className="dropdown-item"
                  onClick={() => setStatusFilter("all")}
                >
                  All
                </button>
                <button
                  type="button"
                  className="dropdown-item"
                  onClick={() => setStatusFilter("active")}
                >
                  Active
                </button>
                <button
                  type="button"
                  className="dropdown-item"
                  onClick={() => setStatusFilter("inactive")}
                >
                  Inactive
                </button>
              </div>
            )}
          </div>

          {(user?.role?.toLowerCase() === "admin" ||
            user?.role?.toLowerCase() === "teacher") && (
            <button
              type="button"
              className="btn btn-success ms-auto"
              onClick={() => {
                navigate("/create-mock-test");
              }}
            >
              Create Mock
            </button>
          )}
        </div>
        {loading ? (
          <LoadingAnimation />
        ) : filteredTests.length === 0 ? (
          <div className="alert alert-warning text-center" role="alert">
            No mock tests found.
          </div>
        ) : (
          <div className="row">
            {filteredTests.map((test) => (
              <div key={test._id} className="col-md-4">
                <div className="card mb-3 shadow">
                  {test.wallpaper && (
                    <div
                      style={{
                        cursor:
                          user?.role?.toLowerCase() === "admin" ||
                          user?.role?.toLowerCase() === "teacher" ||
                          (user?.role?.toLowerCase() === "student" &&
                            test.status === "active")
                            ? "pointer"
                            : "not-allowed",
                      }}
                      onClick={() => {
                        if (
                          test.status === "active" &&
                          user?.role?.toLowerCase() === "student"
                        ) {
                          navigate(`/test-overview/${test._id}`);
                        } else if (
                          user?.role?.toLowerCase() === "admin" ||
                          user?.role?.toLowerCase() === "teacher"
                        ) {
                          navigate(`/exam/${test._id}`);
                        }
                      }}
                    >
                      <img
                        src={test.wallpaper}
                        alt="Test Wallpaper"
                        className="card-img-top hover-card-img"
                        style={{
                          height: "180px",
                          objectFit: "cover",
                          opacity: test.status === "active" ? 1 : 0.6,
                        }}
                      />
                    </div>
                  )}
                  <div className="card-body">
                    <h5 className="card-title">{test.title}</h5>
                    <p className="card-text">
                      {test.isFree ? "Free" : `Price: ₹${test.price}`}
                    </p>

                    <p>
                      Status:{" "}
                      <span
                        style={{
                          color: "white",
                          padding: "3px 8px",
                          borderRadius: "5px",

                          backgroundColor:
                            test.status === "active" ? "green" : "red",
                        }}
                      >
                        {test.status === "active" ? "Active" : "Inactive"}
                      </span>
                    </p>
                    {test.duration && (
                      <div className="test-time">
                        Time: {test.duration}{" "}
                        {test.duration > 1 ? "minutes" : "minute"}
                      </div>
                    )}

                    {user?.role?.toLowerCase() === "student" &&
                      test.status === "active" && (
                        <>
                          <button
                            className="btn btn-success me-2"
                            onClick={() =>
                              handleBuyTest(
                                test._id,
                                test.price || 299,
                                user._id
                              )
                            }
                          >
                            Buy Now ₹{test.price || 299}
                          </button>
                          <button
                            className="btn btn-primary"
                            onClick={() =>
                              navigate(`/test-overview/${test._id}`)
                            }
                          >
                            Start Test
                          </button>
                        </>
                      )}

                    {user?.role?.toLowerCase() === "admin" && (
                      <>
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={() => navigate(`/exam/${test._id}`)}
                        >
                          Edit Test
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-secondary ms-2"
                          onClick={() =>
                            handleToggleStatus(test._id, test.status)
                          }
                        >
                          {test.status === "active" ? (
                            <FaEye />
                          ) : (
                            <FaEyeSlash />
                          )}
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-danger ms-2"
                          onClick={() => handleDeleteTest(test._id)}
                        >
                          <FaTrash />
                        </button>
                      </>
                    )}

                    {user?.role?.toLowerCase() === "teacher" && (
                      <>
                        <button
                          type="button"
                          className="btn btn-info me-2"
                          onClick={() =>
                            navigate(`/exam/${test._id}?mode=view`)
                          }
                        >
                          View Test
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-secondary ms-2"
                          onClick={(e) => {
                            e.preventDefault();
                            handleToggleStatus(test._id, test.status);
                          }}
                        >
                          {test.status === "active" ? (
                            <FaEye />
                          ) : (
                            <FaEyeSlash />
                          )}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MockTests;
