import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import SuperAdminSidebar from "./SuperAdminSidebar";

const AllAdmins = () => {
  const { user } = useContext(AuthContext);
  const [admins, setAdmins] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/superadmin/all-admins`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAdmins(res.data);
      } catch (err) {
        console.error("Failed to fetch admins:", err);
        setError("❌ Failed to load admin data");
      }
    };

    if (user?.role?.toLowerCase() === "superadmin") {
      fetchAdmins();
    }
  }, [user]);

  return (
    <div className="d-flex">
      <SuperAdminSidebar />
      <div className="flex-grow-1 p-4">
        <h2>All Admins</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <table className="table table-bordered mt-3">
          <thead className="table-light">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {admins.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center">No Admins Found</td>
              </tr>
            ) : (
              admins.map((admin, index) => (
                <tr key={admin._id}>
                  <td>{index + 1}</td>
                  <td>{admin.name}</td>
                  <td>{admin.email}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllAdmins;
