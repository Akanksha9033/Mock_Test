// import React, { useEffect, useState, useContext } from 'react';
// import axios from 'axios';
// import { Line, Bar, Pie, Radar } from 'react-chartjs-2';
// import { Chart as ChartJS } from 'chart.js/auto';

// import StudentSidebar from './StudentSidebar';
// import { AuthContext } from '../context/AuthContext';

// const REACT_APP_API_URL = "https://mocktest-ljru.onrender.com";

// const StudentDashboard = () => {
//   const { user } = useContext(AuthContext);
//   const [attempts, setAttempts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [chartData, setChartData] = useState(null);
//   const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

//   useEffect(() => {
//     const handleResize = () => {
//       setSidebarCollapsed(window.innerWidth < 768);
//     };
//     handleResize();
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   useEffect(() => {
//     if (!user?.id) return;

//     const fetchDashboard = async () => {
//       try {
//         const response = await axios.get(`${REACT_APP_API_URL}/api/user/dashboard/${user.id}`);
//         const attemptsData = response.data || [];

//         setAttempts(attemptsData);

//         const scores = attemptsData.map(a => a.score || 0);
//         const dates = attemptsData.map(a => new Date(a.completedAt).toLocaleDateString());

//         setChartData({
//           labels: dates,
//           datasets: [
//             {
//               label: 'Scores Over Time',
//               data: scores,
//               fill: false,
//               borderColor: 'rgba(75, 192, 192, 1)',
//               tension: 0.1
//             }
//           ]
//         });
//       } catch (error) {
//         console.error('Error fetching dashboard:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDashboard();
//   }, [user?.id]);

//   const avgAccuracy = (
//     attempts.reduce((acc, a) => acc + (a.yourAccuracy || 0), 0) / (attempts.length || 1)
//   ).toFixed(2);
//   const avgScore = (
//     attempts.reduce((acc, a) => acc + (a.average || 0), 0) / (attempts.length || 1)
//   ).toFixed(2);

//   return (
//     <div style={{ display: 'flex', flexDirection: 'row' }}>
//       {!sidebarCollapsed && (
//         <div style={{ width: '250px', transition: 'width 0.3s' }}>
//           <StudentSidebar />
//         </div>
//       )}
//       <div
//         style={{
//           flexGrow: 1,
//           padding: '1rem',
//           transition: 'margin-left 0.3s',
//           width: sidebarCollapsed ? '100%' : 'calc(100% - 250px)',
//         }}
//       >
//         {loading ? (
//           <p>Loading dashboard...</p>
//         ) : (
//           <div className="container-fluid">
//             <h2 className="mb-4">📊 Student Dashboard</h2>

//             {/* Overview Cards */}
//             <div className="row g-4">
//               <div className="col-md-3">
//                 <div className="card shadow-sm">
//                   <div className="card-body">
//                     <h6>Total Score</h6>
//                     <h4>{attempts[0]?.totalCombinedScore || 0}/{attempts[0]?.totalCombinedMarks || 0}</h4>
//                   </div>
//                 </div>
//               </div>
//               <div className="col-md-3">
//                 <div className="card shadow-sm">
//                   <div className="card-body">
//                     <h6>Accuracy</h6>
//                     <h4>{avgAccuracy}%</h4>
//                   </div>
//                 </div>
//               </div>
//               <div className="col-md-3">
//                 <div className="card shadow-sm">
//                   <div className="card-body">
//                     <h6>Rank</h6>
//                     <h4>#{attempts[0]?.rank || '-'}</h4>
//                   </div>
//                 </div>
//               </div>
//               <div className="col-md-3">
//                 <div className="card shadow-sm">
//                   <div className="card-body">
//                     <h6>Average Score</h6>
//                     <h4>{avgScore}</h4>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Line Chart */}
//             {chartData && (
//               <div className="card my-4 shadow-sm" style={{ height: '350px' }}>
//                 <div className="card-body h-100">
//                   <h5 className="card-title">📈 Score Progress Over Time</h5>
//                   <div style={{ height: '100%' }}>
//                     <Line
//                       data={chartData}
//                       options={{ responsive: true, maintainAspectRatio: false }}
//                     />
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Pie Chart */}
//             {attempts[0] && (
//               <div className="card my-4 shadow-sm" style={{ height: '300px' }}>
//                 <div className="card-body h-100">
//                   <h5 className="card-title">🥧 Score Breakdown</h5>
//                   <div style={{ height: '100%' }}>
//                     <Pie
//                       data={{
//                         labels: ['Correct', 'Incorrect', 'Skipped'],
//                         datasets: [
//                           {
//                             data: [
//                               attempts[0].correct || 0,
//                               attempts[0].incorrect || 0,
//                               attempts[0].skipped || 0
//                             ],
//                             backgroundColor: ['#4caf50', '#f44336', '#ff9800'],
//                             hoverOffset: 4
//                           }
//                         ]
//                       }}
//                       options={{ responsive: true, maintainAspectRatio: false }}
//                     />
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Bar Chart */}
//             <div className="card my-4 shadow-sm" style={{ height: '350px' }}>
//               <div className="card-body h-100">
//                 <h5 className="card-title">📊 Difficulty Stats</h5>
//                 <div style={{ height: '100%' }}>
//                   <Bar
//                     data={{
//                       labels: ['Easy', 'Medium', 'Intense'],
//                       datasets: [
//                         {
//                           label: 'Correct',
//                           data: [
//                             attempts[0]?.difficultyScore?.Easy || 0,
//                             attempts[0]?.difficultyScore?.Medium || 0,
//                             attempts[0]?.difficultyScore?.Intense || 0
//                           ],
//                           backgroundColor: '#4caf50'
//                         },
//                         {
//                           label: 'Incorrect',
//                           data: [
//                             (attempts[0]?.difficultyStats?.Easy || 0) - (attempts[0]?.difficultyScore?.Easy || 0),
//                             (attempts[0]?.difficultyStats?.Medium || 0) - (attempts[0]?.difficultyScore?.Medium || 0),
//                             (attempts[0]?.difficultyStats?.Intense || 0) - (attempts[0]?.difficultyScore?.Intense || 0)
//                           ],
//                           backgroundColor: '#f44336'
//                         }
//                       ]
//                     }}
//                     options={{
//                       responsive: true,
//                       maintainAspectRatio: false,
//                       scales: {
//                         x: { stacked: true },
//                         y: { stacked: true }
//                       }
//                     }}
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Topic Report */}
//             <div className="card shadow-sm mb-5">
//               <div className="card-body">
//                 <h5 className="card-title">📘 Topic Report</h5>
//                 {attempts[0]?.topicReport?.length > 0 ? (
//                   <ul className="list-group">
//                     {attempts[0].topicReport.map((topic, index) => (
//                       <li key={index} className="list-group-item d-flex justify-content-between">
//                         {topic.tag}
//                         <span className="badge bg-primary">{topic.correct}/{topic.total}</span>
//                       </li>
//                     ))}
//                   </ul>
//                 ) : (
//                   <p>No topic data available.</p>
//                 )}
//               </div>
//             </div>

//             {/* Radar Chart */}
//             {attempts[0]?.topicReport?.length > 0 && (
//               <div className="card my-4 shadow-sm" style={{ height: '350px' }}>
//                 <div className="card-body h-100">
//                   <h5 className="card-title">🧭 Topic Mastery Overview</h5>
//                   <div style={{ height: '100%' }}>
//                     <Radar
//                       data={{
//                         labels: attempts[0].topicReport.map(t => t.tag),
//                         datasets: [
//                           {
//                             label: 'Correct Answers',
//                             data: attempts[0].topicReport.map(t => t.correct),
//                             backgroundColor: 'rgba(54, 162, 235, 0.2)',
//                             borderColor: 'rgba(54, 162, 235, 1)',
//                             borderWidth: 1
//                           },
//                           {
//                             label: 'Total Questions',
//                             data: attempts[0].topicReport.map(t => t.total),
//                             backgroundColor: 'rgba(255, 206, 86, 0.2)',
//                             borderColor: 'rgba(255, 206, 86, 1)',
//                             borderWidth: 1
//                           }
//                         ]
//                       }}
//                       options={{
//                         responsive: true,
//                         maintainAspectRatio: false,
//                         scales: {
//                           r: {
//                             suggestedMin: 0
//                           }
//                         }
//                       }}
//                     />
//                   </div>
//                 </div>
//               </div>
//             )}

//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default StudentDashboard;



import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Line, Bar, Pie, Radar } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
 
import StudentSidebar from './StudentSidebar';
import { AuthContext } from '../context/AuthContext';
 
// const REACT_APP_API_URL = "https://mocktest-ljru.onrender.com";
const REACT_APP_API_URL = process.env.REACT_APP_API_URL;
 
const StudentDashboard = () => {
  const { user } = useContext(AuthContext);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // 🔄 toggled from sidebar
 
  useEffect(() => {
    const handleResize = () => {
      setSidebarCollapsed(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
 
  useEffect(() => {
  if (!user?.id) return;

  const fetchDashboard = async () => {
    try {
      const response = await axios.get(`${REACT_APP_API_URL}/api/user/dashboard/${user.id}`);
      const { attempts: attemptsData = [] } = response.data || {};

      setAttempts(attemptsData);

      const scores = attemptsData.map(a => a.score || 0);
      const dates = attemptsData.map(a => new Date(a.completedAt).toLocaleDateString());

      setChartData({
        labels: dates,
        datasets: [
          {
            label: 'Scores Over Time',
            data: scores,
            fill: false,
            borderColor: 'rgba(75, 192, 192, 1)',
            tension: 0.1
          }
        ]
      });
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchDashboard();
}, [user?.id]);

// ✅ Keep this logic unchanged but guarded against non-array
const avgAccuracy = (
  (Array.isArray(attempts) ? attempts : []).reduce((acc, a) => acc + (a.yourAccuracy || 0), 0) /
  (attempts.length || 1)
).toFixed(2);

const avgScore = (
  (Array.isArray(attempts) ? attempts : []).reduce((acc, a) => acc + (a.average || 0), 0) /
  (attempts.length || 1)
).toFixed(2);

 
  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      {/* Sidebar with toggle communication */}
      <div style={{ width: sidebarCollapsed ? '60px' : '250px', transition: 'width 0.3s ease' }}>
        <StudentSidebar onToggleCollapse={setSidebarCollapsed} />
      </div>
 
      {/* Main Content Area */}
      <div
        style={{
          flexGrow: 1,
          padding: '1rem',
          transition: 'width 0.3s ease',
          width: sidebarCollapsed ? 'calc(100% - 60px)' : 'calc(100% - 250px)',
        }}
      >
        {loading ? (
          <p>Loading dashboard...</p>
        ) : (
          <div className="container-fluid">
            <h2 className="mb-4">📊 Student Dashboard</h2>
 
            {/* Overview Cards */}
            <div className="row g-4">
              <div className="col-md-3">
                <div className="card shadow-sm">
                  <div className="card-body">
                    <h6>Total Score</h6>
                    <h4>{attempts[0]?.totalCombinedScore || 0}/{attempts[0]?.totalCombinedMarks || 0}</h4>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card shadow-sm">
                  <div className="card-body">
                    <h6>Accuracy</h6>
                    <h4>{avgAccuracy}%</h4>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card shadow-sm">
                  <div className="card-body">
                    <h6>Rank</h6>
                    <h4>#{attempts[0]?.rank || '-'}</h4>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card shadow-sm">
                  <div className="card-body">
                    <h6>Average Score</h6>
                    <h4>{avgScore}</h4>
                  </div>
                </div>
              </div>
            </div>
 
            {/* Line Chart */}
            {chartData && (
              <div className="card my-4 shadow-sm" style={{ height: '350px' }}>
                <div className="card-body h-100">
                  <h5 className="card-title">📈 Score Progress Over Time</h5>
                  <div style={{ height: '100%' }}>
                    <Line
                      data={chartData}
                      options={{ responsive: true, maintainAspectRatio: false }}
                    />
                  </div>
                </div>
              </div>
            )}
 
            {/* Pie Chart */}
            {attempts[0] && (
              <div className="card my-4 shadow-sm" style={{ height: '300px' }}>
                <div className="card-body h-100">
                  <h5 className="card-title">🥧 Score Breakdown</h5>
                  <div style={{ height: '100%' }}>
                    <Pie
                      data={{
                        labels: ['Correct', 'Incorrect', 'Skipped'],
                        datasets: [
                          {
                            data: [
                              attempts[0].correct || 0,
                              attempts[0].incorrect || 0,
                              attempts[0].skipped || 0
                            ],
                            backgroundColor: ['#4caf50', '#f44336', '#ff9800'],
                            hoverOffset: 4
                          }
                        ]
                      }}
                      options={{ responsive: true, maintainAspectRatio: false }}
                    />
                  </div>
                </div>
              </div>
            )}
 
            {/* Bar Chart */}
            <div className="card my-4 shadow-sm" style={{ height: '350px' }}>
              <div className="card-body h-100">
                <h5 className="card-title">📊 Difficulty Stats</h5>
                <div style={{ height: '100%' }}>
                  <Bar
                    data={{
                      labels: ['Easy', 'Medium', 'Intense'],
                      datasets: [
                        {
                          label: 'Correct',
                          data: [
                            attempts[0]?.difficultyScore?.Easy || 0,
                            attempts[0]?.difficultyScore?.Medium || 0,
                            attempts[0]?.difficultyScore?.Intense || 0
                          ],
                          backgroundColor: '#4caf50'
                        },
                        {
                          label: 'Incorrect',
                          data: [
                            (attempts[0]?.difficultyStats?.Easy || 0) - (attempts[0]?.difficultyScore?.Easy || 0),
                            (attempts[0]?.difficultyStats?.Medium || 0) - (attempts[0]?.difficultyScore?.Medium || 0),
                            (attempts[0]?.difficultyStats?.Intense || 0) - (attempts[0]?.difficultyScore?.Intense || 0)
                          ],
                          backgroundColor: '#f44336'
                        }
                      ]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        x: { stacked: true },
                        y: { stacked: true }
                      }
                    }}
                  />
                </div>
              </div>
            </div>
 
            {/* Topic Report */}
            <div className="card shadow-sm mb-5">
              <div className="card-body">
                <h5 className="card-title">📘 Topic Report</h5>
                {attempts[0]?.topicReport?.length > 0 ? (
                  <ul className="list-group">
                    {attempts[0].topicReport.map((topic, index) => (
                      <li key={index} className="list-group-item d-flex justify-content-between">
                        {topic.tag}
                        <span className="badge bg-primary">{topic.correct}/{topic.total}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No topic data available.</p>
                )}
              </div>
            </div>
 
            {/* Radar Chart */}
            {attempts[0]?.topicReport?.length > 0 && (
              <div className="card my-4 shadow-sm" style={{ height: '350px' }}>
                <div className="card-body h-100">
                  <h5 className="card-title">🧭 Topic Mastery Overview</h5>
                  <div style={{ height: '100%' }}>
                    <Radar
                      data={{
                        labels: attempts[0].topicReport.map(t => t.tag),
                        datasets: [
                          {
                            label: 'Correct Answers',
                            data: attempts[0].topicReport.map(t => t.correct),
                            backgroundColor: 'rgba(54, 162, 235, 0.2)',
                            borderColor: 'rgba(54, 162, 235, 1)',
                            borderWidth: 1
                          },
                          {
                            label: 'Total Questions',
                            data: attempts[0].topicReport.map(t => t.total),
                            backgroundColor: 'rgba(255, 206, 86, 0.2)',
                            borderColor: 'rgba(255, 206, 86, 1)',
                            borderWidth: 1
                          }
                        ]
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          r: {
                            suggestedMin: 0
                          }
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>          
        )}
      </div>      
    </div>    
  );
};
 
export default StudentDashboard;