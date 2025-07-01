import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import { Collapse } from "react-bootstrap";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import StudentSidebar from "./StudentSidebar";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import LoadingAnimation from "../../LoadingAnimation";

const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

const StudentDashboard = () => {
  const { user } = useContext(AuthContext);
  const [attempts, setAttempts] = useState([]);
  const [selectedAttempt, setSelectedAttempt] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(
    window.innerWidth < 768
  );
  const [loading, setLoading] = useState(true);
  const [openSections, setOpenSections] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsSidebarCollapsed(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!user?.id) return;

    const fetchData = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(
          `${REACT_APP_API_URL}/api/user/dashboard/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAttempts(res.data.attempts || []);
        setSelectedAttempt(res.data.attempts?.[0]);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.id]);


  const toggleSection = (key) => {
    setOpenSections((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleAttemptChange = (index) => {
    setSelectedAttempt(attempts[index]);
    setShowDetail(false);
  };

  const getLineChart = (tag) => {
    const filtered = attempts.map((a) => {
      const match = a.topicReport?.find((t) => t.tag === tag);
      return match ? match.correct : 0;
    });
    const labels = attempts.map((a) =>
      new Date(a.completedAt).toLocaleDateString()
    );
    return {
      labels,
      datasets: [
        {
          label: tag,
          data: filtered,
          fill: false,
          borderColor: "#007bff",
          backgroundColor: "#cce5ff",
        },
      ],
    };
  };

  const getWeakAreas = () => {
    const topics = selectedAttempt?.topicReport || [];
    return [...topics].sort(
      (a, b) => a.correct / a.total - b.correct / b.total
    );
  };


  const renderDeepStructure = (tag) => (
    <ul className="small text-muted">
      {tag.subtopics.map((sub, idx) => (
        <li key={idx} className="mb-2">
          <strong>Subtag:</strong> {sub.subtag}
          <ul>
            <li>
              <strong>Approach:</strong> {sub.approach}
              <ul>
                <li>
                  <strong>Domain:</strong> {sub.performanceDomain}
                  <ul>
                    <li>
                      <strong>Difficulty:</strong> {sub.difficulty} — {sub.correct}/{sub.total} (
                      <span
                        className={`badge ${
                          ((sub.correct / sub.total) * 100).toFixed(1) < 50
                            ? "bg-danger"
                            : ((sub.correct / sub.total) * 100).toFixed(1) < 75
                            ? "bg-warning text-dark"
                            : "bg-success"
                        }`}
                      >
                        {((sub.correct / sub.total) * 100).toFixed(1)}%
                      </span>
                      )
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
          </ul>
        </li>
      ))}
    </ul>
  );


  // Helper function (add this inside your component, above return)
const getCategoryPercentage = (topicReport, categoryName) => {
  if (!Array.isArray(topicReport)) return 0;

  let correct = 0;
  let total = 0;

  topicReport.forEach(t => {
    if (
      t.tag === categoryName ||
      t.subtag === categoryName ||
      t.performanceDomain === categoryName
    ) {
      correct += t.correct;
      total += t.total;
    }
  });

  if (total === 0) return 0;
  return ((correct / total) * 100).toFixed(2);
};


  return (
    <div className="d-flex flex-column flex-md-row">
      <StudentSidebar
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />

      {/* Toggle Button */}
      <div
        className="position-fixed d-md-block"
        style={{
          top: "55px",
          left: isSidebarCollapsed ? "15px" : "250px",
          zIndex: 1050,
          backgroundColor: "#ffffff",
          borderRadius: "50%",
          padding: "8px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          cursor: "pointer",
          transition: "left 0.3s ease",
        }}
      >
        {isSidebarCollapsed ? (
          <FaChevronRight
            size={18}
            onClick={() => setIsSidebarCollapsed(false)}
          />
        ) : (
          <FaChevronLeft
            size={18}
            onClick={() => setIsSidebarCollapsed(true)}
          />
        )}
      </div>

      {/* Main Content */}
      <div
        className="min-vh-100"
        style={{
          flexGrow: 1,
          padding: "1.5rem",
          paddingLeft: isSidebarCollapsed ? "70px" : "270px",
          transition: "padding-left 0.3s ease",
          width: "100%",
          backgroundColor: "#f8f9fa",
        }}
      >
        {loading ? (
          <LoadingAnimation />
        ) : attempts.length === 0 ? (
          <div className="text-center mt-5">
            <img
              src="https://res-cdn.learnyst.com/pro/admin-v3/media/no-result.png"
              alt="No Tests Yet"
              className="img-fluid mb-4"
              style={{ maxWidth: "250px" }}
            />
            <h3 className="fw-bold">You haven't taken any tests yet!</h3>
            <p className="text-muted mb-4">
              Click the button below to take your first test and start your
              learning journey.
            </p>
            <button
              className="btn btn-primary px-4 py-2"
              onClick={() => navigate("/mock-tests")}
            >
              Take a Test
            </button>
          </div>
        ) : (
          <div className="container-fluid px-0">
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
              <h2 className="fw-bold">Student Dashboard</h2>
              <button
                className="btn btn-outline-primary fw-semibold"
                onClick={() => navigate("/mock-tests")}
              >
                + Take Test
              </button>
            </div>

            <div className="card shadow-lg p-4 mb-4">
              <h4 className="mb-3">
                Welcome, <span className="text-primary">{user?.name}</span>
              </h4>
              {selectedAttempt && (
  <>
    <h5 className="mb-3 text-muted">
      Most Recent Test: {selectedAttempt.examName}
    </h5>
    <div className="row g-4">
      <div className="col-sm-6 col-md-3">
        <div className="border-start border-4 border-primary bg-white rounded p-3 shadow-sm text-center">
          <h4 className="text-primary fw-bold">
          {selectedAttempt?.score ?? 0}/
          {selectedAttempt?.totalMarks ?? 0}
        </h4>
          <p className="text-muted small mb-0">Total Marks Scored</p>
        </div>
      </div>

      <div className="col-sm-6 col-md-3">
        <div className="bg-white rounded p-3 shadow-sm text-center">
          <h4 className="text-success">
            {selectedAttempt.yourAccuracy || 0}%
          </h4>
          <p className="text-muted small mb-0">Accuracy</p>
        </div>
      </div>

      <div className="col-sm-12 col-md-4">
        <div className="bg-white rounded p-3 shadow-sm">
          <p className="mb-1">
            <strong>People:</strong>{" "}
            {getCategoryPercentage(selectedAttempt.topicReport, 'People')}%
          </p>
          <p className="mb-1">
            <strong>Process:</strong>{" "}
            {getCategoryPercentage(selectedAttempt.topicReport, 'Process')}%
          </p>
          <p className="mb-1">
            <strong>Business:</strong>{" "}
            {getCategoryPercentage(selectedAttempt.topicReport, 'Business')}%
          </p>
        </div>
      </div>

      <div className="col-sm-12 col-md-2 d-flex align-items-center">
        <button
          className="btn btn-primary w-100"
          onClick={() => setShowDetail(!showDetail)}
        >
          {showDetail ? "Hide Details" : "View Details"}
        </button>
      </div>
    </div>

    {showDetail && (
      <div className="card mt-4 shadow-sm">
        <div className="card-header bg-light fw-bold">Detailed Performance</div>
        <ul className="list-group list-group-flush">
          {(selectedAttempt.topicReport || []).map((t, i) => (
            <li
              key={i}
              className="list-group-item d-flex justify-content-between"
            >
              <span>{t.tag}</span>
              <span className="text-secondary">
                Correct: {t.correct} / {t.total}
              </span>
            </li>
          ))}
        </ul>
      </div>
    )}
  </>
)}

        </div>


            {attempts.length > 1 && (
              <div className="card shadow-sm p-3 mb-4">
                <label className="fw-bold mb-2">Check Other Results</label>
                <select
                  className="form-select"
                  value={attempts.indexOf(selectedAttempt)}
                  onChange={(e) => handleAttemptChange(e.target.value)}
                >
                  {attempts.map((a, i) => {
                    const dateObj = new Date(a.completedAt);
                    const date = dateObj.toLocaleDateString("en-GB");
                    const time = dateObj.toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    });
                    const studentScore = a.totalCombinedScore || 0;
                    const totalScore = a.totalCombinedMarks || 0;
                    return (
                      <option key={i} value={i}>
                        {a.examName} - {studentScore}/{totalScore} - {time} -{" "}
                        {date}
                      </option>
                    );
                  })}
                </select>
              </div>
            )}

            {selectedAttempt?.topicReport?.length > 0 && (
  <div>
    <h4 className="fw-semibold mb-3">📊 Progress Summary by Tag</h4>
    <div className="row">
      {selectedAttempt.topicReport.map((tagData, i) => {
        const correct = tagData.correct;
        const total = tagData.total;
        const accuracy =
          total > 0 ? ((correct / total) * 100).toFixed(1) : "0.0";

        return (
          <div key={i} className="col-md-6 col-lg-4 mb-4">
            <div className="card shadow-sm h-100">
              <div className="card-body text-center">
                <h5 className="card-title text-primary fw-bold mb-2">
                  {tagData.tag}
                </h5>
                <div className="mb-2">
                  <span className={`badge ${
                    accuracy >= 80
                      ? "bg-success"
                      : accuracy >= 50
                      ? "bg-warning text-dark"
                      : "bg-danger"
                  }`}>
                    Accuracy: {accuracy}%
                  </span>
                </div>
                <div className="text-muted small">
                  Correct: <strong>{correct}</strong> / {total}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </div>
)}


<div className="container-fluid px-0">
            {/* EXISTING CONTENT UNCHANGED */}

            {selectedAttempt?.topicReport?.length > 0 && (
              <div className="mt-4">
                <h4 className="fw-bold mb-3">🌟 Detailed Topic Tree</h4>
                {selectedAttempt.topicReport.map((tag, i) => (
                  <div key={i} className="card mb-3 shadow-sm">
                    <div
                      className="card-header fw-semibold d-flex justify-content-between"
                      onClick={() => toggleSection(i)}
                      style={{ cursor: "pointer" }}
                    >
                      {tag.tag}
                      <span className={`badge ${
                        tag.accuracy >= 75
                          ? "bg-success"
                          : tag.accuracy >= 50
                          ? "bg-warning text-dark"
                          : "bg-danger"
                      }`}>
                        {tag.accuracy?.toFixed(1) || 0}%
                      </span>
                    </div>
                    <Collapse in={openSections[i]}>
                      <div className="card-body">
                        {renderDeepStructure(tag)}
                      </div>
                    </Collapse>
                  </div>
                ))}
              </div>
            )}

          </div>


          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
