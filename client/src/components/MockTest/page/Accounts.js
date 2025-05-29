import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import * as XLSX from "xlsx";
import {
  FaTrashAlt,
  FaTachometerAlt,
  FaFileAlt,
  FaUser,
  FaWallet,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaSignOutAlt,
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
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const isExamPage = location.pathname.includes("/exam");

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
          <div
            className="bg-light border-end p-3 position-fixed d-flex flex-column justify-content-between"
            style={{
              width: isCollapsed ? "60px" : "250px",
              height: "100vh",
              transition: "width 0.3s ease",
              zIndex: 1050,
              overflow: "hidden",
            }}
          >
            <div>
              {!isCollapsed && <h4 className="mb-4">Admin Panel</h4>}

              <ul className="list-unstyled sidebar-links w-100">
                <li className="mb-3 d-flex align-items-center">
                  <Link to="/admin-dashboard" className="sidebar-link d-flex align-items-center">
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
                <li className="mb-3 d-flex align-items-center">
                  <Link to="/accounts" className="sidebar-link d-flex align-items-center">
                    <FaWallet className="me-2" />
                    {!isCollapsed && "Accounts"}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Logout Button */}
            <div
              className="sidebar-link d-flex align-items-center mb-2"
              onClick={handleLogout}
              style={{ cursor: "pointer", padding: "10px 15px", color: "#343a40", fontWeight: "600" }}
            >
              <FaSignOutAlt className="me-2" />
              {!isCollapsed && "Logout"}
            </div>
          </div>

          {/* Toggle Button */}
          <div
            className="position-fixed"
            style={{
              top: "20px",
              left: isCollapsed ? "60px" : "250px",
              zIndex: 1060,
              cursor: "pointer",
              transition: "left 0.3s ease",
            }}
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <span style={{ fontSize: "20px", color: "#000" }}>
              {isCollapsed ? <FaAngleDoubleRight /> : <FaAngleDoubleLeft />}
            </span>
          </div>
        </>
      )}

      {/* Main Content */}
      <div
        className="container mt-5"
        style={{
          marginLeft: !isExamPage ? (isCollapsed ? "60px" : "250px") : "0px",
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

        <h2 className="mb-4">Newly Created Accounts</h2>

        {loading && <p><LoadingAnimation /></p>}
        {error && <div className="alert alert-danger">{error}</div>}
        {!loading && !error && users.length === 0 && (
          <p className="text-muted">No accounts created yet.</p>
        )}

        {/* Search and Filter */}
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

        {/* Download button */}
        {filteredUsers.length > 0 && (
          <button className="btn btn-success mb-3" onClick={handleDownload}>
            ⬇ Download Accounts
          </button>
        )}

        {/* User Table */}
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
              {filteredUsers.map((user, index) => (
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

        <button className="backbtn" onClick={() => navigate(-1)}>
          ← Back
        </button>
      </div>
    </div>
  );
};

export default Account;
