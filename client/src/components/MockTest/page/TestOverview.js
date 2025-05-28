import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from '../context/AuthContext';

// const REACT_APP_API_URL = "https://mocktest-ljru.onrender.com";
const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

const ordinal = (n) => {
  const suffixes = ['First', 'Second', 'Third', 'Fourth', 'Fifth'];
  return suffixes[n - 1] || `${n}th`;
};

const TestOverview = () => {
  const { testId } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [test, setTest] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTestDetails();
  }, []);

  const fetchTestDetails = async () => {
    try {
      const testRes = await fetch(`${REACT_APP_API_URL}/api/admin/mock-tests/${testId}`);
      const testData = await testRes.json();

      if (!testData || !testData.title) {
        console.warn("❌ Test data not found or missing title");
        return;
      }

      const attemptRes = await fetch(`${REACT_APP_API_URL}/api/user/dashboard/${user.id}`);
      const result = await attemptRes.json();

      let allAttempts = [];
      let summaryData = null;

      if (Array.isArray(result)) {
        allAttempts = result;
      } else if (result && Array.isArray(result.attempts)) {
        allAttempts = result.attempts;
        summaryData = result.summary || null;
      }

      setSummary(summaryData);

      const userAttempts = allAttempts
        .filter((a) => a?.testTitle?.trim() === testData?.title?.trim())
        .sort((a, b) => new Date(b.completedAt || b.createdAt) - new Date(a.completedAt || a.createdAt));

      setTest(testData);
      setAttempts(userAttempts);
    } catch (err) {
      console.error('Error loading test details:', err);
      setTest(null);
      setAttempts([]);
    } finally {
      setLoading(false);
    }
  };
const totalMarks = test?.questions?.reduce((sum, q) => sum + (q.marks || 1), 0);

  const handleContinueInProgress = () => {
    navigate(`/exam/${testId}?fresh=true`);

  };

  const handleClearAttempts = () => {
    const toastId = toast.info(
      ({ closeToast }) => (
        <div>
          <p><strong>Confirm Reset</strong><br />Are you sure you want to clear all your attempts for this test?</p>
          <div className="mt-2 d-flex gap-2 justify-content-end">
            <button
              className="btn btn-danger btn-sm"
              onClick={async () => {
                try {
                  toast.dismiss(toastId); // dismiss current prompt
                  const res = await fetch(`${REACT_APP_API_URL}/api/userTestData/clear-attempts`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: user?.id, testId })
                  });
  
                  const result = await res.json();
                  if (res.ok) {
                    toast.success("✅ Attempts cleared successfully!");
                    setTimeout(() => window.location.reload(), 1000);
                  } else {
                    toast.error(result.error || "Failed to clear attempts.");
                  }
                } catch (err) {
                  console.error("❌ Clear attempt error:", err);
                  toast.error("Something went wrong.");
                }
              }}
            >
              Yes, Clear
            </button>
  
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => toast.dismiss(toastId)}
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { autoClose: false }
    );
  };

  const handleRetakeNewAttempt = async () => {
    try {
      await fetch(`${REACT_APP_API_URL}/api/userTestData/start-attempt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.id, testId }),
      });

      localStorage.removeItem(`timer-${testId}`);
      localStorage.removeItem(`pause-${testId}`);

      navigate(`/exam/${testId}`);
    } catch (err) {
      console.error("❌ Could not start fresh test:", err);
    }
  };

  const attemptCount = attempts.length;
  const hasInProgress = attempts.some((a) => a.status === 'in-progress');

  if (loading || !test) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  return (
    <div className="container mt-4">
      <div className="row mb-4">
        <div className="col-md-8">
          <h2 className="fw-bold">{test?.title || "Test"}</h2>
          <p className="text-muted">{test?.description || "Description not available."}</p>

          <div className="row text-center my-3">
            <div className="col border p-2"><strong>Live</strong><br /><small>Status</small></div>
            <div className="col border p-2"><strong>{totalMarks}</strong><br /><small>Marks</small></div>

            <div className="col border p-2"><strong>{test?.duration || 0}</strong><br /><small>Minutes</small></div>
            <div className="col border p-2"><strong>{test?.questions?.length || 0}</strong><br /><small>Questions</small></div>
          </div>

          

          {attempts.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-bordered table-striped mt-3">
                <thead className="table-light">
                  <tr>
                    <th>Attempt</th>
                    <th>Score</th>
                    <th>Accuracy</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {attempts.map((a) => (
                    <tr key={a._id}>
                      <td>{ordinal(a.attemptNumber)}</td>
                      <td>{a.score} / {a.totalMarks ?? '-'}</td>
<td>{parseFloat(a.yourAccuracy ?? 0).toFixed(2)}%</td>
<td>
  {a.completedAt
    ? new Date(a.completedAt).toLocaleString()
    : a.createdAt
    ? new Date(a.createdAt).toLocaleString() + " (In Progress)"
    : "-"}
</td>



<td>{a.status ?? '-'}</td>
<td>
  {a.status === 'in-progress' ? (
    <button className="btn btn-warning btn-sm" onClick={handleContinueInProgress}>
      Continue Test
    </button>
  ) : (
    // <button className="btn btn-outline-primary btn-sm" onClick={() => navigate(`/solution/${a._id}`)}>
    //   View Result
    // </button>
    // <button className="btn btn-outline-primary btn-sm" onClick={() => navigate(`/solution/${a._id}`)}>
    //   View Result
    // </button>
    <button className="btn btn-outline-primary btn-sm" onClick={() => navigate(`/full-report/${a._id}`)}>
  View Result
</button>

  )}
</td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted mt-3">You haven't attempted this test yet.</p>
          )}

  {hasInProgress ? (
  <>
    {/* <button
      className="btn btn-warning me-3 mt-3"
      onClick={handleContinueInProgress}
    >
      Continue Test
    </button> */}

    <button
      className="btn btn-primary mt-3"
      onClick={handleRetakeNewAttempt}
      disabled={attemptCount >= 5}
    >
      {attemptCount === 0 ? 'Start Test' : 'Retake Test'}
    </button>
  </>
) : (
  <button
    className="btn btn-primary mt-3"
    onClick={handleRetakeNewAttempt}
    disabled={attemptCount >= 5}
  >
    {attemptCount === 0 ? 'Start Test' : 'Retake Test'}
  </button>
)}

{attemptCount >= 5 && (
  <button
    className="btn btn-danger mt-3 ml-4"
    onClick={handleClearAttempts}
  >
    🔁 Reset All Attempts
  </button>
)}

</div>
        <div className="col-md-4">
          <div className="card shadow-sm">
            <img
              src={test?.wallpaper || "https://via.placeholder.com/300x180?text=Test+Cover"}
              className="card-img-top"
              alt="Test Banner"
              style={{ objectFit: "cover", height: "180px" }}
            />
            <div className="card-body">
              <p className="text-muted mb-2">📅 Valid for 148 days</p>
              <h6 className="fw-bold mb-3">What’s included:</h6>
              <ul className="list-unstyled mb-0">
                <li>✅ Live Test</li>
                <li>✅ {totalMarks} Marks</li>
                <li>✅ {test?.duration || 0} Minutes</li>
                <li>✅ {test?.questions?.length || 0} Questions</li>
                <li>✅ 5 Attempts</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestOverview;
