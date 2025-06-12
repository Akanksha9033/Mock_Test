import React, { useEffect, useRef, useState } from "react";
import SuperAdminSidebar from "./SuperAdminSidebar";
import { FaBars } from "react-icons/fa";

const SuperAdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
  const sidebarRef = useRef();

  // ✅ Close sidebar on outside click (desktop + mobile)
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        sidebarOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target)
      ) {
        setSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sidebarOpen]);

  // ✅ Handle responsive resize
  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="d-flex position-relative">
      {/* Toggle Icon (only when sidebar is closed) */}
      {!sidebarOpen && (
        <FaBars
          onClick={() => setSidebarOpen(true)}
          style={{
            position: "fixed",
            top: "15px",
            left: "15px",
            fontSize: "1.5rem",
            cursor: "pointer",
            zIndex: 2000,
            backgroundColor: "#fff",
            padding: "6px",
            borderRadius: "6px",
            boxShadow: "0 0 6px rgba(0,0,0,0.2)",
          }}
        />
      )}

      {/* Overlay for mobile */}
      {sidebarOpen && window.innerWidth < 768 && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            zIndex: 999,
            background: "rgba(0,0,0,0.2)",
          }}
        />
      )}

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`sidebar-container ${sidebarOpen ? "d-block" : "d-none d-md-block"}`}
        style={{
          width: window.innerWidth < 768 ? "80vw" : "240px",
          background: "#2f3640",
          color: "white",
          height: "100vh",
          position: "sticky",
          top: 0,
          zIndex: 1000,
          transition: "transform 0.3s ease-in-out",
        }}
      >
        <SuperAdminSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 p-4" style={{ backgroundColor: "#f5f6fa", minHeight: "100vh" }}>
        <div className="p-4 bg-white rounded shadow">
          <h2 className="mb-3 text-primary">
            Welcome, SuperAdmin <span role="img" aria-label="crown">👑</span>
          </h2>
          <p className="text-secondary">
            This is your main dashboard. From here, you can manage admins and monitor your platform.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
