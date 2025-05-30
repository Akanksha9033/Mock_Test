// import React from "react";
// import { useContext, useState } from "react";
// import { AuthContext } from "../context/AuthContext";
// import { useNavigate } from "react-router-dom";
// import "bootstrap/dist/css/bootstrap.min.css";
// import TeacherSidebar from "./TeacherSidebar";
// import { FaUpload } from "react-icons/fa";

// // const REACT_APP_API_URL = "https://mocktest-ljru.onrender.com";
// const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

// const TeacherDashboard = () => {
//   const { user } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const [file, setFile] = useState(null);
//   const [materialName, setMaterialName] = useState("");
//   const [publishDate, setPublishDate] = useState("");
//   const [topicName, setTopicName] = useState("");
//   const [showModal, setShowModal] = useState(false);
//   const [searchUserId, setSearchUserId] = useState("");
//   const [userResults, setUserResults] = useState([]);
//   const [showResultModal, setShowResultModal] = useState(false);

//   const fetchUserResults = async () => {
//     if (!searchUserId.trim()) {
//       alert("Please enter a Student Name.");
//       return;
//     }
  
//     try {
//       const res = await fetch(`${REACT_APP_API_URL}/api/name/search?name=${encodeURIComponent(searchUserId)}`);
//       if (!res.ok) throw new Error("Failed to fetch results");
//       const data = await res.json();
//       setUserResults(data);
//       setShowResultModal(true);
//     } catch (err) {
//       console.error(err);
//       alert("Could not fetch student results.");
//     }
//   };
  

//   const openZoomMeeting = () => {
//     const zoomMeetingURL = "https://zoom.us/j/123456789?pwd=abcdef12345";
//     window.open(zoomMeetingURL, "_blank");
//   };

//   const handleFileUpload = (e) => {
//     setFile(e.target.files[0]);
//   };

//   const handleSubmitUpload = () => {
//     if (!materialName || !publishDate || !topicName || !file) {
//       alert("Please fill in all fields and select a file to upload.");
//       return;
//     }

//     alert("Study Material uploaded successfully!");
//     setShowModal(false);
//     setMaterialName("");
//     setPublishDate("");
//     setTopicName("");
//     setFile(null);
//   };

//   return (
//     <div className="d-flex vh-100">
//       <TeacherSidebar />

//       <div className="container mt-5 text-center" style={{ marginLeft: "250px", padding: "20px" }}>
//         <div
//           className="profile-container position-fixed"
//           style={{
//             top: "20px",
//             right: "20px",
//             zIndex: 1050,
//             cursor: "pointer",
//           }}
//         >
//           <div
//             className="profile-image"
//             style={{
//               position: "relative",
//               width: "50px",
//               height: "50px",
//               borderRadius: "50%",
//               backgroundColor: "#ccc",
//               overflow: "hidden",
//             }}
//             onClick={() => navigate("/profile")}
//           >
//             <img
//               src={user?.profilePhoto || "https://via.placeholder.com/50/000000/FFFFFF/?text=👨‍🏫"}
//               alt="Profile"
//               style={{
//                 width: "100%",
//                 height: "100%",
//                 objectFit: "cover",
//                 borderRadius: "50%",
//               }}
//             />
//           </div>
//         </div>

//         <h1 className="mb-4" style={{ color: "#4748ac" }}>
//           Welcome to Your Dashboard, {user?.name || "Teacher"}!
//         </h1>
//         <p className="mb-5" style={{ fontSize: "18px", color: "#555" }}>
//           Manage your classes, track student progress, and schedule online sessions here.
//         </p>

//         <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
//           <div className="col">
//             <div className="card shadow-sm border-light" style={{ borderRadius: "10px" }}>
//               <div className="card-body">
//                 <h5 className="card-title" style={{ color: "#4748ac" }}>Create Mock Tests</h5>
//                 <p className="card-text" style={{ color: "#666" }}>
//                   Design and publish your mock tests to help students prepare.
//                 </p>
//                 <button
//                   className="btn btn-primary"
//                   onClick={() => navigate("/create-mock-test")}
//                   style={{ backgroundColor: "#4748ac", borderRadius: "5px", width: "100%", padding: "10px" }}
//                 >
//                   Create Test
//                 </button>
//               </div>
//             </div>
//           </div>

//           <div className="col">
//             <div className="card shadow-sm border-light" style={{ borderRadius: "10px" }}>
//               <div className="card-body">
//                 <h5 className="card-title" style={{ color: "#4748ac" }}>Schedule Zoom Meeting</h5>
//                 <p className="card-text" style={{ color: "#666" }}>
//                   Schedule an online class via Zoom with your students for interactive sessions.
//                 </p>
//                 <button
//                   className="btn btn-success"
//                   onClick={openZoomMeeting}
//                   style={{ backgroundColor: "#28a745", borderRadius: "5px", width: "100%", padding: "10px" }}
//                 >
//                   Start Zoom Meeting
//                 </button>
//               </div>
//             </div>
//           </div>

//           <div className="col">
//             <div className="card shadow-sm border-light" style={{ borderRadius: "10px" }}>
//               <div className="card-body">
//                 <h5 className="card-title" style={{ color: "#4748ac" }}>Upload Study Material</h5>
//                 <p className="card-text" style={{ color: "#666" }}>
//                   Click here to upload your study materials like PDFs, documents, or slides for students.
//                 </p>
//                 <button
//                   className="btn btn-info"
//                   onClick={() => setShowModal(true)}
//                   style={{ borderRadius: "5px", width: "100%", padding: "10px" }}
//                 >
//                   <FaUpload style={{ marginRight: "10px" }} />
//                   Upload Material
//                 </button>
//               </div>
//             </div>
//           </div>

//           <div className="col">
//             <div className="card shadow-sm border-light" style={{ borderRadius: "10px" }}>
//               <div className="card-body">
//                 <h5 className="card-title" style={{ color: "#4748ac" }}>View Student Reports</h5>
//                 <p className="card-text" style={{ color: "#666" }}>
//                   Enter a student User ID to view their test results.
//                 </p>
//                 <input
//                   type="text"
//                   className="form-control mb-2"
//                   placeholder="Enter Student Name"
//                   value={searchUserId}
//                   onChange={(e) => setSearchUserId(e.target.value)}
//                 />
//                 <button className="btn btn-warning" onClick={fetchUserResults} style={{ width: "100%" }}>
//                   Fetch Report
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>

//         {showModal && (
//           <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
//             <div className="modal-dialog">
//               <div className="modal-content">
//                 <div className="modal-header">
//                   <h5 className="modal-title" style={{ color: "#4748ac" }}>Upload Study Material Details</h5>
//                   <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
//                 </div>
//                 <div className="modal-body">
//                   <form>
//                     <div className="mb-3">
//                       <label htmlFor="materialName" className="form-label">Material Name</label>
//                       <input type="text" className="form-control" id="materialName" value={materialName} onChange={(e) => setMaterialName(e.target.value)} />
//                     </div>
//                     <div className="mb-3">
//                       <label htmlFor="publishDate" className="form-label">Date of Publish</label>
//                       <input type="date" className="form-control" id="publishDate" value={publishDate} onChange={(e) => setPublishDate(e.target.value)} />
//                     </div>
//                     <div className="mb-3">
//                       <label htmlFor="topicName" className="form-label">Topic Name</label>
//                       <input type="text" className="form-control" id="topicName" value={topicName} onChange={(e) => setTopicName(e.target.value)} />
//                     </div>
//                     <div className="mb-3">
//                       <label htmlFor="fileUpload" className="form-label">Choose File</label>
//                       <input type="file" className="form-control" id="fileUpload" onChange={handleFileUpload} />
//                     </div>
//                   </form>
//                 </div>
//                 <div className="modal-footer">
//                   <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
//                   <button className="btn btn-primary" onClick={handleSubmitUpload}>Submit</button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {showResultModal && (
//           <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
//             <div className="modal-dialog modal-lg">
//               <div className="modal-content">
//                 <div className="modal-header">
//                   <h5 className="modal-title" style={{ color: "#4748ac" }}>Student Test Reports</h5>
//                   <button type="button" className="btn-close" onClick={() => setShowResultModal(false)}></button>
//                 </div>
//                 <div className="modal-body" style={{ maxHeight: "400px", overflowY: "auto" }}>
//                   {userResults.length === 0 ? (
//                     <p>No reports found for this user.</p>
//                   ) : (
//                     <table className="table table-bordered">
//                       <thead>
//                         <tr>
//                           <th>Topic</th>
//                           <th>Correct</th>
//                           <th>Total</th>
//                           <th>Accuracy</th>
//                         </tr>
//                       </thead>

//                       <tbody>
//                       {userResults
//                         .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
//                         .map((result, index) => (
//                           <React.Fragment key={index}>
//                             <tr style={{ backgroundColor: '#f8f9fa' }}>
//                               <td colSpan="4">
//                                 <strong>Attempt {index + 1}</strong> | 
//                                 <strong> Date:</strong> {new Date(result.completedAt).toLocaleDateString()} | 
//                                 <strong> Score:</strong> {result.score} | 
//                                 <strong> Accuracy:</strong> {result.yourAccuracy}%
//                               </td>
//                             </tr>
//                             {result.topicReport?.length > 0 ? (
//                               result.topicReport.map((topic, i) => (
//                                 <tr key={`${index}-${i}`}>
//                                   <td>{result.testTitle || "N/A"} - {topic.tag}</td>
//                                   <td>{topic.correct}</td>
//                                   <td>{topic.total}</td>
//                                   <td>{((topic.correct / topic.total) * 100).toFixed(2)}%</td>
//                                 </tr>
//                               ))
//                             ) : (
//                               <tr>
//                                 <td colSpan="4" className="text-muted">No topic-wise data</td>
//                               </tr>
//                             )}
//                           </React.Fragment>
//                         ))}
//                     </tbody>

//                     </table>
//                   )}
//                 </div>
//                 <div className="modal-footer">
//                   <button className="btn btn-secondary" onClick={() => setShowResultModal(false)}>Close</button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         <style>
//           {`
//             .profile-image:hover + .profile-tooltip {
//               visibility: visible;
//               opacity: 1;
//             }

//             .profile-tooltip {
//               visibility: hidden;
//               opacity: 0;
//             }
//           `}
//         </style>
//       </div>
//     </div>
//   );
// };

// export default TeacherDashboard;


import React from "react";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import TeacherSidebar from "./TeacherSidebar";
import { FaUpload } from "react-icons/fa";

// const REACT_APP_API_URL = "https://mocktest-ljru.onrender.com";
const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

const TeacherDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [materialName, setMaterialName] = useState("");
  const [publishDate, setPublishDate] = useState("");
  const [topicName, setTopicName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [searchUserId, setSearchUserId] = useState("");
  const [userResults, setUserResults] = useState([]);
  const [showResultModal, setShowResultModal] = useState(false);

  const fetchUserResults = async () => {
    if (!searchUserId.trim()) {
      alert("Please enter a Student Name.");
      return;
    }
  
    try {
      const res = await fetch(`${REACT_APP_API_URL}/api/name/search?name=${encodeURIComponent(searchUserId)}`);
      if (!res.ok) throw new Error("Failed to fetch results");
      const data = await res.json();
      setUserResults(data);
      setShowResultModal(true);
    } catch (err) {
      console.error(err);
      alert("Could not fetch student results.");
    }
  };
  

  const openZoomMeeting = () => {
    const zoomMeetingURL = "https://zoom.us/j/123456789?pwd=abcdef12345";
    window.open(zoomMeetingURL, "_blank");
  };

  const handleFileUpload = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmitUpload = () => {
    if (!materialName || !publishDate || !topicName || !file) {
      alert("Please fill in all fields and select a file to upload.");
      return;
    }

    alert("Study Material uploaded successfully!");
    setShowModal(false);
    setMaterialName("");
    setPublishDate("");
    setTopicName("");
    setFile(null);
  };

  return (
    <div className="d-flex vh-100">
      <TeacherSidebar />

      <div className="container mt-5 text-center" style={{ marginLeft: "250px", padding: "20px" }}>
        <div
          className="profile-container position-fixed"
          style={{
            top: "20px",
            right: "20px",
            zIndex: 1050,
            cursor: "pointer",
          }}
        >
          <div
            className="profile-image"
            style={{
              position: "relative",
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              backgroundColor: "#ccc",
              overflow: "hidden",
            }}
            onClick={() => navigate("/profile")}
          >
            <img
              src={user?.profilePhoto || "https://via.placeholder.com/50/000000/FFFFFF/?text=👨‍🏫"}
              alt="Profile"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "50%",
              }}
            />
          </div>
        </div>

        <h1 className="mb-4" style={{ color: "#4748ac" }}>
          Welcome to Your Dashboard, {user?.name || "Teacher"}!
        </h1>
        <p className="mb-5" style={{ fontSize: "18px", color: "#555" }}>
          Manage your classes, track student progress, and schedule online sessions here.
        </p>

        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          <div className="col">
            <div className="card shadow-sm border-light" style={{ borderRadius: "10px" }}>
              <div className="card-body">
                <h5 className="card-title" style={{ color: "#4748ac" }}>Create Mock Tests</h5>
                <p className="card-text" style={{ color: "#666" }}>
                  Design and publish your mock tests to help students prepare.
                </p>
                <button
                  className="btn btn-primary"
                  onClick={() => navigate("/create-mock-test")}
                  style={{ backgroundColor: "#4748ac", borderRadius: "5px", width: "100%", padding: "10px" }}
                >
                  Create Test
                </button>
              </div>
            </div>
          </div>

          <div className="col">
            <div className="card shadow-sm border-light" style={{ borderRadius: "10px" }}>
              <div className="card-body">
                <h5 className="card-title" style={{ color: "#4748ac" }}>Schedule Zoom Meeting</h5>
                <p className="card-text" style={{ color: "#666" }}>
                  Schedule an online class via Zoom with your students for interactive sessions.
                </p>
                <button
                  className="btn btn-success"
                  onClick={openZoomMeeting}
                  style={{ backgroundColor: "#28a745", borderRadius: "5px", width: "100%", padding: "10px" }}
                >
                  Start Zoom Meeting
                </button>
              </div>
            </div>
          </div>

          <div className="col">
            <div className="card shadow-sm border-light" style={{ borderRadius: "10px" }}>
              <div className="card-body">
                <h5 className="card-title" style={{ color: "#4748ac" }}>Upload Study Material</h5>
                <p className="card-text" style={{ color: "#666" }}>
                  Click here to upload your study materials like PDFs, documents, or slides for students.
                </p>
                <button
                  className="btn btn-info"
                  onClick={() => setShowModal(true)}
                  style={{ borderRadius: "5px", width: "100%", padding: "10px" }}
                >
                  <FaUpload style={{ marginRight: "10px" }} />
                  Upload Material
                </button>
              </div>
            </div>
          </div>

          <div className="col">
            <div className="card shadow-sm border-light" style={{ borderRadius: "10px" }}>
              <div className="card-body">
                <h5 className="card-title" style={{ color: "#4748ac" }}>View Student Reports</h5>
                <p className="card-text" style={{ color: "#666" }}>
                  Enter a student User ID to view their test results.
                </p>
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Enter Student Name"
                  value={searchUserId}
                  onChange={(e) => setSearchUserId(e.target.value)}
                />
                <button className="btn btn-warning" onClick={fetchUserResults} style={{ width: "100%" }}>
                  Fetch Report
                </button>
              </div>
            </div>
          </div>
        </div>

        {showModal && (
          <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" style={{ color: "#4748ac" }}>Upload Study Material Details</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body">
                  <form>
                    <div className="mb-3">
                      <label htmlFor="materialName" className="form-label">Material Name</label>
                      <input type="text" className="form-control" id="materialName" value={materialName} onChange={(e) => setMaterialName(e.target.value)} />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="publishDate" className="form-label">Date of Publish</label>
                      <input type="date" className="form-control" id="publishDate" value={publishDate} onChange={(e) => setPublishDate(e.target.value)} />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="topicName" className="form-label">Topic Name</label>
                      <input type="text" className="form-control" id="topicName" value={topicName} onChange={(e) => setTopicName(e.target.value)} />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="fileUpload" className="form-label">Choose File</label>
                      <input type="file" className="form-control" id="fileUpload" onChange={handleFileUpload} />
                    </div>
                  </form>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
                  <button className="btn btn-primary" onClick={handleSubmitUpload}>Submit</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showResultModal && (
          <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" style={{ color: "#4748ac" }}>Student Test Reports</h5>
                  <button type="button" className="btn-close" onClick={() => setShowResultModal(false)}></button>
                </div>
                <div className="modal-body" style={{ maxHeight: "400px", overflowY: "auto" }}>
                  {userResults.length === 0 ? (
                    <p>No reports found for this user.</p>
                  ) : (
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>Topic</th>
                          <th>Correct</th>
                          <th>Total</th>
                          <th>Accuracy</th>
                        </tr>
                      </thead>

                      <tbody>
                      {userResults
                        .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
                        .map((result, index) => (
                          <React.Fragment key={index}>
                            <tr style={{ backgroundColor: '#f8f9fa' }}>
                              <td colSpan="4">
                                <strong>Attempt {index + 1}</strong> | 
                                <strong> Date:</strong> {new Date(result.completedAt).toLocaleDateString()} | 
                                <strong> Score:</strong> {result.score} | 
                                <strong> Accuracy:</strong> {result.yourAccuracy}%
                              </td>
                            </tr>
                            {result.topicReport?.length > 0 ? (
                              result.topicReport.map((topic, i) => (
                                <tr key={`${index}-${i}`}>
                                  <td>{result.testTitle || "N/A"} - {topic.tag}</td>
                                  <td>{topic.correct}</td>
                                  <td>{topic.total}</td>
                                  <td>{((topic.correct / topic.total) * 100).toFixed(2)}%</td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="4" className="text-muted">No topic-wise data</td>
                              </tr>
                            )}
                          </React.Fragment>
                        ))}
                    </tbody>

                    </table>
                  )}
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setShowResultModal(false)}>Close</button>
                </div>
              </div>
            </div>
          </div>
        )}

        <style>
          {`
            .profile-image:hover + .profile-tooltip {
              visibility: visible;
              opacity: 1;
            }

            .profile-tooltip {
              visibility: hidden;
              opacity: 0;
            }
          `}
        </style>
      </div>
    </div>
  );
};

export default TeacherDashboard;
