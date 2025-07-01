import React, { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import TeacherSidebar from "./TeacherSidebar";
import { FaUpload, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Line, Bar } from "react-chartjs-2";

const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

const TeacherDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const sidebarRef = useRef();

  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);
  const [file, setFile] = useState(null);
  const [materialName, setMaterialName] = useState("");
  const [publishDate, setPublishDate] = useState("");
  const [topicName, setTopicName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [searchUserId, setSearchUserId] = useState("");
  const [userResults, setUserResults] = useState([]);
  const [showResultModal, setShowResultModal] = useState(false);
  const [showStudentListModal, setShowStudentListModal] = useState(false);
  const [studentList, setStudentList] = useState([]);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target) && window.innerWidth < 768) {
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

  const fetchStudentList = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${REACT_APP_API_URL}/api/students/institute`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to fetch students");
      const data = await res.json();
      setStudentList(data.students || []);
      setShowStudentListModal(true);
    } catch (err) {
      alert("Error fetching students");
    }
  };

  const fetchStudentReport = async (studentName) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${REACT_APP_API_URL}/api/name/search?name=${encodeURIComponent(studentName)}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to fetch report");
      const data = await res.json();
      setUserResults(data);
      setShowStudentListModal(false);
      setShowResultModal(true);
    } catch (err) {
      alert("Error fetching student report");
    }
  };

  const openZoomMeeting = () => {
    window.open("https://zoom.us/j/123456789?pwd=abcdef12345", "_blank");
  };

  const handleSubmitUpload = () => {
    if (!materialName || !publishDate || !topicName || !file) {
      alert("Fill all fields");
      return;
    }
    alert("Material uploaded");
    setShowModal(false);
    setMaterialName("");
    setPublishDate("");
    setTopicName("");
    setFile(null);
  };

  const getAccuracyLineChart = () => ({
    labels: userResults.map((r, i) => `Attempt ${i + 1}`),
    datasets: [
      {
        label: "Accuracy (%)",
        data: userResults.map((r) => parseFloat(r.yourAccuracy)),
        borderColor: "#007bff",
        backgroundColor: "rgba(0,123,255,0.2)",
        fill: true
      }
    ]
  });

  const getTopicBarChart = () => {
    const topicSums = {};
    userResults.forEach(r => {
      r.topicReport?.forEach(t => {
        if (!topicSums[t.tag]) topicSums[t.tag] = { correct: 0, total: 0 };
        topicSums[t.tag].correct += t.correct;
        topicSums[t.tag].total += t.total;
      });
    });
    const labels = Object.keys(topicSums);
    const data = labels.map(tag => ((topicSums[tag].correct / topicSums[tag].total) * 100).toFixed(2));
    return {
      labels,
      datasets: [{
        label: "Average Topic Accuracy (%)",
        data,
        backgroundColor: "rgba(40,167,69,0.5)",
        borderColor: "#28a745",
        borderWidth: 1
      }]
    };
  };

  return (
    <div className="d-flex min-vh-100">
      {isSidebarOpen && (
        <div
          ref={sidebarRef}
          style={{
            width: "250px",
            position: window.innerWidth < 768 ? "fixed" : "relative",
            zIndex: 1040,
            background: "#fff",
            height: "100vh"
          }}
        >
          <TeacherSidebar isCollapsed={false} setIsCollapsed={() => {}} />
        </div>
      )}
      {isSidebarOpen && window.innerWidth < 768 && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 250,
            width: "100%",
            height: "100vh",
            background: "rgba(0,0,0,0.4)",
            zIndex: 1030
          }}
        />
      )}
      <div
        className="position-fixed"
        style={{
          top: "20px",
          left: isSidebarOpen ? (window.innerWidth < 768 ? "260px" : "250px") : "10px",
          zIndex: 1100,
          transition: "left 0.3s ease",
          marginTop: "50px",
          marginLeft: "10px"
        }}
      >
        {isSidebarOpen ? (
          <FaChevronLeft onClick={toggleSidebar} style={toggleIconStyle} />
        ) : (
          <FaChevronRight onClick={toggleSidebar} style={toggleIconStyle} />
        )}
      </div>
      <div className="flex-grow-1 p-3">
        <h1 className="mb-4 text-center" style={{ color: "#4748ac" }}>
          Welcome to Your Dashboard, {user?.name || "Teacher"}!
        </h1>

        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          <DashboardCard title="Create Mock Tests" button="Create Test" color="primary" onClick={() => navigate("/create-mock-test")} />
          <DashboardCard title="Schedule Zoom Meeting" button="Start Zoom Meeting" color="success" onClick={openZoomMeeting} />
          <DashboardCard title="Upload Study Material" button={<><FaUpload className="me-2" /> Upload Material</>} color="info" onClick={() => setShowModal(true)} />
          <DashboardCard title="View Students" button="Show Students" color="warning" onClick={fetchStudentList} />
        </div>

        {showModal && (
          <Modal title="Upload Study Material" onClose={() => setShowModal(false)} onSubmit={handleSubmitUpload}>
            <input type="text" className="form-control mb-2" placeholder="Material Name" value={materialName} onChange={(e) => setMaterialName(e.target.value)} />
            <input type="date" className="form-control mb-2" value={publishDate} onChange={(e) => setPublishDate(e.target.value)} />
            <input type="text" className="form-control mb-2" placeholder="Topic Name" value={topicName} onChange={(e) => setTopicName(e.target.value)} />
            <input type="file" className="form-control" onChange={(e) => setFile(e.target.files[0])} />
          </Modal>
        )}

        {showStudentListModal && (
          <Modal title="Students in Your Institute" onClose={() => setShowStudentListModal(false)}>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Name</th><th>Total Attempts</th><th>Last Attempt</th><th>Avg Score</th><th>Avg Accuracy</th>
                </tr>
              </thead>
              <tbody>
                {studentList.map((s, i) => (
                  <tr key={i}>
                    <td>
                      <button
                        className="btn btn-link p-0"
                        onClick={() => fetchStudentReport(s.studentName)}
                        style={{ textDecoration: "underline", color: "#007bff", fontWeight: "bold" }}
                      >
                        {s.studentName}
                      </button>
                    </td>
                    <td>{s.totalAttempts}</td>
                    <td>{s.lastAttemptDate ? new Date(s.lastAttemptDate).toLocaleDateString() : "N/A"}</td>
                    <td>{s.avgScore ? s.avgScore.toFixed(2) : "N/A"}</td>
                    <td>{s.avgAccuracy ? s.avgAccuracy.toFixed(2) + "%" : "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Modal>
        )}

        {showResultModal && (
          <Modal title="Student Test Reports" onClose={() => setShowResultModal(false)}>
            <div style={{ maxHeight: "400px", overflowY: "auto" }}>
              {userResults.length === 0 ? (
                <p>No reports found</p>
              ) : (
                <>
                  <Line data={getAccuracyLineChart()} className="mb-4" />
                  <Bar data={getTopicBarChart()} className="mb-4" />
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Test</th><th>Topic</th><th>Correct</th><th>Total</th><th>Accuracy</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userResults.map((result, idx) => (
                        <React.Fragment key={idx}>
                          <tr className="table-light">
                            <td colSpan="5">
                              <strong>Attempt {idx + 1}</strong> | <strong>Date:</strong> {new Date(result.completedAt).toLocaleDateString()} | <strong>Score:</strong> {result.score} | <strong>Accuracy:</strong> {result.yourAccuracy}%
                            </td>
                          </tr>
                          {result.topicReport?.length ? (
                            result.topicReport.map((topic, i) => (
                              <tr key={`${idx}-${i}`}>
                                <td>{result.testTitle || "N/A"}</td>
                                <td>{topic.tag}</td>
                                <td>{topic.correct}</td>
                                <td>{topic.total}</td>
                                <td>{((topic.correct / topic.total) * 100).toFixed(2)}%</td>
                              </tr>
                            ))
                          ) : (
                            <tr><td colSpan="5" className="text-muted">No topic data</td></tr>
                          )}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </>
              )}
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
};

const DashboardCard = ({ title, button, color, onClick }) => (
  <div className="col">
    <div className="card shadow-sm border-light rounded">
      <div className="card-body">
        <h5 className="card-title" style={{ color: "#4748ac" }}>{title}</h5>
        <button className={`btn btn-${color} w-100`} onClick={onClick}>
          {button}
        </button>
      </div>
    </div>
  </div>
);

const Modal = ({ title, onClose, onSubmit, children }) => (
  <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
    <div className="modal-dialog modal-lg">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title text-primary">{title}</h5>
          <button className="btn-close" onClick={onClose}></button>
        </div>
        <div className="modal-body">{children}</div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Close</button>
          {onSubmit && <button className="btn btn-primary" onClick={onSubmit}>Submit</button>}
        </div>
      </div>
    </div>
  </div>
);

const toggleIconStyle = {
  fontSize: "28px",
  color: "#333",
  backgroundColor: "#fff",
  padding: "6px",
  borderRadius: "50%",
  boxShadow: "0 0 6px rgba(0,0,0,0.2)",
  cursor: "pointer"
};

export default TeacherDashboard;
