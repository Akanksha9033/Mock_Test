import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import SuperAdminSidebar from "./SuperAdminSidebar";
import LoadingAnimation from "../../LoadingAnimation";
import {
  FaUsers,
  FaUserShield,
  FaToggleOn,
  FaToggleOff,
  FaUserPlus,
} from "react-icons/fa";
 
const REACT_APP_API_URL = process.env.REACT_APP_API_URL;
 
// Count-up animation hook
const useCountUp = (target, duration = 1000) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const stepTime = Math.abs(Math.floor(duration / target));
    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= target) clearInterval(timer);
    }, stepTime);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
};
 
const SuperAdminDashboard = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
 
  const [admins, setAdmins] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      try {
        const [adminsRes, usersRes] = await Promise.all([
          fetch(`${REACT_APP_API_URL}/api/superadmin/all-admins`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${REACT_APP_API_URL}/api/admin/users`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
 
        const adminsData = await adminsRes.json();
        const usersData = await usersRes.json();
 
        setAdmins(adminsData || []);
        setUsers(usersData || []);
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
 
    fetchData();
  }, []);
 
  const totalAdmins = useCountUp(admins.length);
  const totalUsers = useCountUp(users.length);
 
  return (
    <div className="d-flex">
      <SuperAdminSidebar />
 
      <div className="container mt-4" style={{ marginLeft: "250px" }}>
        <style>
          {`
            .dashboard-card {
              background-color: #f8f9fa;
              padding: 20px;
              border-radius: 10px;
              box-shadow: 0 4px 6px rgba(0,0,0,0.1);
              text-align: center;
              height: 100%;
              transition: 0.3s ease;
            }
 
            .dashboard-card:hover {
              transform: translateY(-3px);
            }
 
            .dashboard-card .value {
              font-size: 28px;
              font-weight: bold;
              color: #007bff;
            }
 
            @media (max-width: 768px) {
              .container {
                margin-left: 0 !important;
              }
            }
          `}
        </style>
 
        <h2 className="text-center text-primary">SuperAdmin Dashboard</h2>
        <p className="text-center text-muted">
          Manage Admins, Users and monitor platform usage
        </p>
 
        {loading ? (
          <div
            className="d-flex justify-content-center align-items-center mt-5"
            style={{ minHeight: "150px" }}
          >
            <LoadingAnimation />
          </div>
        ) : (
          <>
            {/* <h4 className="text-center mt-5 mb-4">📊 Platform Statistics</h4> */}
            {/* <div className="row">
              <div className="col-md-6 mb-4">
                <div className="dashboard-card">
                  <FaUserShield size={30} className="mb-2 text-warning" />
                  <h5>Total Admins</h5>
                  <div className="value">{totalAdmins}</div>
                </div>
              </div>
              <div className="col-md-6 mb-4">
                <div className="dashboard-card">
                  <FaUsers size={30} className="mb-2 text-info" />
                  <h5>Total Users</h5>
                  <div className="value">{totalUsers}</div>
                </div>
              </div>
            </div> */}
 
            {/* <h4 className="text-center mt-4 mb-3">🛠️ Actions</h4> */}
            <div className="d-flex justify-content-center gap-3 mb-5">
              <button
                className="btn btn-success"
                onClick={() => navigate("/create-admin")}
              >
                <FaUserPlus className="me-2" />
                Create Admin
              </button>
              <button className="btn btn-danger" onClick={logout}>
                Logout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
 
export default SuperAdminDashboard;