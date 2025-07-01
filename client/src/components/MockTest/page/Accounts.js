// import React, { useEffect, useState, useRef } from "react";
// import { useNavigate, useLocation, Link } from "react-router-dom";
// import "bootstrap/dist/css/bootstrap.min.css";
// import * as XLSX from "xlsx";
// import {
//   FaTrashAlt,
//   FaTachometerAlt,
//   FaFileAlt,
//   FaUser,
//   FaWallet,
//   FaSignOutAlt,
//   FaBars,
// } from "react-icons/fa";
// import "./Accounts.css";
// import LoadingAnimation from "../../LoadingAnimation";
 
// const REACT_APP_API_URL = process.env.REACT_APP_API_URL;
 
// const Account = () => {
//   const [users, setUsers] = useState([]);
//   const [filteredUsers, setFilteredUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [filterType, setFilterType] = useState("name");
//   const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);
 
//   const sidebarRef = useRef(null);
//   const navigate = useNavigate();
//   const location = useLocation();
//   const isExamPage = location.pathname.includes("/exam");
 
//   useEffect(() => {
//     const fetchUsers = async () => {
//       const token = localStorage.getItem("token");
//       try {
//         const response = await fetch(`${REACT_APP_API_URL}/api/admin/users`, {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         const data = await response.json();
//         if (response.ok) {
//           setUsers(data);
//           setFilteredUsers(data);
//         } else {
//           setError(data.message || "Failed to fetch users.");
//         }
//       } catch (err) {
//         setError("An error occurred while fetching users.");
//       } finally {
//         setLoading(false);
//       }
//     };
 
//     fetchUsers();
//   }, []);
 
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (
//         sidebarRef.current &&
//         !sidebarRef.current.contains(event.target) &&
//         window.innerWidth < 768
//       ) {
//         setIsSidebarOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);
 
//   useEffect(() => {
//     const handleResize = () => {
//       setIsSidebarOpen(window.innerWidth >= 768);
//     };
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);
 
//   const handleDelete = async (userId) => {
//     const token = localStorage.getItem("token");
//     if (window.confirm("Are you sure you want to delete this account?")) {
//       try {
//         const response = await fetch(`${REACT_APP_API_URL}/api/admin/users/${userId}`, {
//           method: "DELETE",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         const data = await response.json();
//         if (response.ok) {
//           setUsers(users.filter((user) => user._id !== userId));
//           setFilteredUsers(filteredUsers.filter((user) => user._id !== userId));
//         } else {
//           setError(data.message || "Failed to delete user.");
//         }
//       } catch (err) {
//         setError("An error occurred while deleting the user.");
//       }
//     }
//   };
 
//   useEffect(() => {
//     if (!searchQuery) {
//       setFilteredUsers(users);
//     } else {
//       const filtered = users.filter((user) =>
//         user[filterType]?.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//       setFilteredUsers(filtered);
//     }
//   }, [searchQuery, filterType, users]);
 
//   const handleDownload = () => {
//     const exportData = users.map((user, index) => ({
//       "S.No": index + 1,
//       Name: user.name,
//       Email: user.email,
//       Password: user.password || "N/A",
//       Role: user.role,
//       "Created At": new Date(user.createdAt).toLocaleString(),
//     }));
 
//     const worksheet = XLSX.utils.json_to_sheet(exportData);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Accounts");
//     XLSX.writeFile(workbook, "All_Accounts.xlsx");
//   };
 
//   const handleLogout = () => {
//     localStorage.clear();
//     navigate("/login");
//   };
 
//   return (
//     <div className="d-flex">
//       {!isExamPage && (
//         <>
//           {/* Sidebar */}
//           <div ref={sidebarRef}>
//             <div
//               className="bg-light border-end p-3 position-fixed d-flex flex-column justify-content-between"
//               style={{
//                 width: "250px",
//                 height: "100vh",
//                 transition: "transform 0.3s ease-in-out",
//                 transform: isSidebarOpen ? "translateX(0)" : "translateX(-100%)",
//                 zIndex: 1050,
//                 overflow: "hidden",
//               }}
//             >
//               <div>
//                 <h4 className="mb-4">Admin Panel</h4>
//                 <ul className="list-unstyled sidebar-links w-100">
//                   <li className="mb-3 d-flex align-items-center">
//                     <Link to="/admin-dashboard" className="sidebar-link d-flex align-items-center">
//                       <FaTachometerAlt className="me-2" />
//                       Dashboard
//                     </Link>
//                   </li>
//                   <li className="mb-3 d-flex align-items-center">
//                     <Link to="/mock-tests" className="sidebar-link d-flex align-items-center">
//                       <FaFileAlt className="me-2" />
//                       Mock Tests
//                     </Link>
//                   </li>
//                   <li className="mb-3 d-flex align-items-center">
//                     <Link to="/profile" className="sidebar-link d-flex align-items-center">
//                       <FaUser className="me-2" />
//                       Profile
//                     </Link>
//                   </li>
//                   <li className="mb-3 d-flex align-items-center">
//                     <Link to="/accounts" className="sidebar-link d-flex align-items-center">
//                       <FaWallet className="me-2" />
//                       Accounts
//                     </Link>
//                   </li>
//                 </ul>
//               </div>
//               <div
//                 className="sidebar-link d-flex align-items-center mb-2"
//                 onClick={handleLogout}
//                 style={{ cursor: "pointer", padding: "10px 15px", color: "#343a40", fontWeight: "600" }}
//               >
//                 <FaSignOutAlt className="me-2" />
//                 Logout
//               </div>
//             </div>
//           </div>
 
//           {/* FaBars toggle button */}
//           <div
//             className="position-fixed"
//             style={{
//               top: "20px",
//               left: isSidebarOpen ? "260px" : "10px",
//               zIndex: 1100,
//               transition: "left 0.3s ease",
//               cursor: "pointer",
//             }}
//             onClick={() => setIsSidebarOpen((prev) => !prev)}
//           >
//             <FaBars
//               style={{
//                 fontSize: "26px",
//                 color: "#333",
//                 backgroundColor: "#fff",
//                 padding: "6px",
//                 borderRadius: "8px",
//                 boxShadow: "0 0 6px rgba(0,0,0,0.2)",
//               }}
//             />
//           </div>
//         </>
//       )}
 
//       {/* Main Content */}
//       <div
//         className="container mt-5"
//         style={{
//           marginLeft: !isExamPage ? (isSidebarOpen ? "250px" : "0px") : "0px",
//           transition: "margin-left 0.3s ease",
//         }}
//       >
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
//             .sidebar-links .sidebar-link:hover {
//               background-color: #4748ac;
//               color: #fff;
//               transform: translateX(4px);
//             }
//           `}
//         </style>
 
//         <h2 className="mb-4">Newly Created Accounts</h2>
 
//         {loading && <p><LoadingAnimation /></p>}
//         {error && <div className="alert alert-danger">{error}</div>}
//         {!loading && !error && users.length === 0 && (
//           <p className="text-muted">No accounts created yet.</p>
//         )}
 
//         <div className="mb-4 d-flex">
//           <input
//             type="text"
//             className="form-control me-2"
//             placeholder={`Search by ${filterType}`}
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//           <select
//             className="form-select"
//             value={filterType}
//             onChange={(e) => setFilterType(e.target.value)}
//           >
//             <option value="name">Name</option>
//             <option value="email">Email</option>
//           </select>
//         </div>
 
//         {filteredUsers.length > 0 && (
//           <button className="btn btn-success mb-3" onClick={handleDownload}>
//             ⬇ Download Accounts
//           </button>
//         )}
 
//         {!loading && !error && filteredUsers.length > 0 && (
//           <table className="table table-bordered table-striped">
//             <thead className="table-dark">
//               <tr>
//                 <th>#</th>
//                 <th>Name</th>
//                 <th>Email</th>
//                 <th>Password</th>
//                 <th>Role</th>
//                 <th>Created At</th>
//                 <th>Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredUsers
//   .filter(user => user.role !== "superAdmin") // 👈 Hide superAdmin on UI
//   .map((user, index) => (
//     <tr key={user._id || index}>
//       <td>{index + 1}</td>
//       <td>{user.name}</td>
//       <td>{user.email}</td>
//       <td>{user.password || "N/A"}</td>
//       <td>{user.role}</td>
//       <td>{new Date(user.createdAt).toLocaleString()}</td>
//       <td>
//         {user.role !== "admin" && (
//           <FaTrashAlt
//             style={{ cursor: "pointer", color: "red" }}
//             onClick={() => handleDelete(user._id)}
//           />
//         )}
//       </td>
//     </tr>
// ))}

//             </tbody>
//           </table>
//         )}
//       </div>
//     </div>
//   );
// };
 
// export default Account;



import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import * as XLSX from "xlsx";
import {
  FaTrashAlt,
  FaTachometerAlt,
  FaFileAlt,
  FaUser,
  FaWallet,
  FaSignOutAlt,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import "./Accounts.css";
import LoadingAnimation from "../../LoadingAnimation";
 
const REACT_APP_API_URL = process.env.REACT_APP_API_URL;
 
const Account = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("name");
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);
 
  const sidebarRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isExamPage = location.pathname.includes("/exam");
 


   const toggleSidebar = () => {
  setIsSidebarOpen(prev => !prev);
};

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(`${REACT_APP_API_URL}/api/admin/users`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setUsers(data);
          setFilteredUsers(data);
        } else {
          setError(data.message || "Failed to fetch users.");
        }
      } catch (err) {
        setError("An error occurred while fetching users.");
      } finally {
        setLoading(false);
      }
    };
 
    fetchUsers();
  }, []);
 
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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
 
  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
 
  const handleDelete = async (userId) => {
    const token = localStorage.getItem("token");
    if (window.confirm("Are you sure you want to delete this account?")) {
      try {
        const response = await fetch(`${REACT_APP_API_URL}/api/admin/users/${userId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setUsers(users.filter((user) => user._id !== userId));
          setFilteredUsers(filteredUsers.filter((user) => user._id !== userId));
        } else {
          setError(data.message || "Failed to delete user.");
        }
      } catch (err) {
        setError("An error occurred while deleting the user.");
      }
    }
  };
 
  useEffect(() => {
    if (!searchQuery) {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter((user) =>
        user[filterType]?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, filterType, users]);
 
  const handleDownload = () => {
    const exportData = users.map((user, index) => ({
      "S.No": index + 1,
      Name: user.name,
      Email: user.email,
      Password: user.password || "N/A",
      Role: user.role,
      "Created At": new Date(user.createdAt).toLocaleString(),
    }));
 
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Accounts");
    XLSX.writeFile(workbook, "All_Accounts.xlsx");
  };
 
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };
 
  return (
    <div className="d-flex">
      {!isExamPage && (
        <>
          {/* Sidebar */}
          <div ref={sidebarRef}>
            <div
              className="bg-light border-end p-3 position-fixed d-flex flex-column justify-content-between"
              style={{
                width: "250px",
                height: "100vh",
                transition: "transform 0.3s ease-in-out",
                transform: isSidebarOpen ? "translateX(0)" : "translateX(-100%)",
                zIndex: 1050,
                overflow: "hidden",
              }}
            >
              <div>
                <h4 className="mb-4">Admin Panel</h4>
                <ul className="list-unstyled sidebar-links w-100">
                  <li className="mb-3 d-flex align-items-center">
                    <Link to="/admin-dashboard" className="sidebar-link d-flex align-items-center">
                      <FaTachometerAlt className="me-2" />
                      Dashboard
                    </Link>
                  </li>
                  <li className="mb-3 d-flex align-items-center">
                    <Link to="/mock-tests" className="sidebar-link d-flex align-items-center">
                      <FaFileAlt className="me-2" />
                      Mock Tests
                    </Link>
                  </li>
                  <li className="mb-3 d-flex align-items-center">
                    <Link to="/profile" className="sidebar-link d-flex align-items-center">
                      <FaUser className="me-2" />
                      Profile
                    </Link>
                  </li>
                  <li className="mb-3 d-flex align-items-center">
                    <Link to="/accounts" className="sidebar-link d-flex align-items-center">
                      <FaWallet className="me-2" />
                      Users
                    </Link>
                  </li>
                </ul>
              </div>
              <div
                className="sidebar-link d-flex align-items-center mb-2"
                onClick={handleLogout}
                style={{ cursor: "pointer", padding: "10px 15px", color: "#343a40", fontWeight: "600" }}
              >
                <FaSignOutAlt className="me-2" />
                Logout
              </div>
            </div>
          </div>
 
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
        </>
      )}
 
      {/* Main Content */}
      <div
        className="container mt-5"
        style={{
          marginLeft: !isExamPage ? (isSidebarOpen ? "250px" : "0px") : "0px",
          transition: "margin-left 0.3s ease",
        }}
      >
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
            .sidebar-links .sidebar-link:hover {
              background-color: #4748ac;
              color: #fff;
              transform: translateX(4px);
            }
          `}
        </style>
 
 
<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
  <h2 className="mb-0">Newly Created Accounts</h2>
  <button className="btn btn-success" onClick={() => navigate("/add-user")}>
    Add User
  </button>
</div>
 
       
 
        <div className="mb-4 d-flex">
          <input
            type="text"
            className="form-control me-2"
            placeholder={`Search by ${filterType}`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select
            className="form-select"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="name">Name</option>
            <option value="email">Email</option>
          </select>
        </div>
  {loading && <p><LoadingAnimation /></p>}
        {error && <div className="alert alert-danger">{error}</div>}
        {!loading && !error && users.length === 0 && (
          <p className="text-muted">No accounts created yet.</p>
        )}
        {filteredUsers.length > 0 && (
          <button className="btn btn-success mb-3" onClick={handleDownload}>
            ⬇ Download Accounts
          </button>
         
        )}
 
        {!loading && !error && filteredUsers.length > 0 && (
          <table className="table table-bordered table-striped">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Password</th>
                <th>Role</th>
                <th>Created At</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers
  .filter(user => user.role !== "superAdmin") // 👈 Hide superAdmin on UI
  .map((user, index) => (
    <tr key={user._id || index}>
      <td>{index + 1}</td>
      <td>{user.name}</td>
      <td>{user.email}</td>
      <td>{user.password || "N/A"}</td>
      <td>{user.role}</td>
      <td>{new Date(user.createdAt).toLocaleString()}</td>
      <td>
        {user.role !== "admin" && (
          <FaTrashAlt
            style={{ cursor: "pointer", color: "red" }}
            onClick={() => handleDelete(user._id)}
          />
        )}
      </td>
    </tr>
))}
 
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
 
export default Account;