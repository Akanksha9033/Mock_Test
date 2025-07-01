import React, { useEffect, useState } from "react";
import SuperAdminSidebar from "./SuperAdminSidebar";
import LoadingAnimation from "../../LoadingAnimation";
import * as XLSX from "xlsx";
import { FaTrashAlt } from "react-icons/fa";
 
const REACT_APP_API_URL = process.env.REACT_APP_API_URL;
 
const SuperAdminAccounts = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("name");
 
  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(`${REACT_APP_API_URL}/api/superadmin/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setUsers(data);
          setFilteredUsers(data);
        } else {
          setError("Failed to fetch users.");
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
    if (!searchQuery) {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter((user) =>
        user[filterType]?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, filterType, users]);
 
  const handleDelete = async (userId) => {
    const token = localStorage.getItem("token");
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const res = await fetch(`${REACT_APP_API_URL}/api/admin/users/${userId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setUsers((prev) => prev.filter((user) => user._id !== userId));
        } else {
          alert(data.message || "Failed to delete.");
        }
      } catch (err) {
        alert("Error deleting user.");
      }
    }
  };
 
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
 
  return (
    <div className="d-flex">
      <SuperAdminSidebar />
      <div className="container mt-5" style={{ marginLeft: "250px" }}>
        <h2 className="mb-4">All Accounts</h2>
 
        {loading && <LoadingAnimation />}
        {error && <div className="alert alert-danger">{error}</div>}
        {!loading && !error && (
          <>
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
 
            <button className="btn btn-success mb-3" onClick={handleDownload}>
              ⬇ Download Accounts
            </button>
 
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
                  .filter((user) => user.role !== "superAdmin")
                  .map((user, index) => (
                    <tr key={user._id}>
                      <td>{index + 1}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.password || "N/A"}</td>
                      <td>{user.role}</td>
                      <td>{new Date(user.createdAt).toLocaleString()}</td>
                      <td>
                        <FaTrashAlt
                          style={{ color: "red", cursor: "pointer" }}
                          onClick={() => handleDelete(user._id)}
                        />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
};
 
export default SuperAdminAccounts;