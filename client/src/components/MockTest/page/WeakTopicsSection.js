import React, { useEffect, useState, useContext } from "react";
import {
  Card, Spinner, Alert, Button, Badge, Tab, Tabs, Collapse,
} from "react-bootstrap";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import { AuthContext } from "../context/AuthContext";

const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

const WeakTopicsSection = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [allTags, setAllTags] = useState([]);
  const [openDetails, setOpenDetails] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchWeakTags = async () => {
      try {
        const res = await fetch(`${REACT_APP_API_URL}/api/analysis/weak-tags/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setAllTags(data.weakTags || []);
      } catch (err) {
        console.error("Failed to fetch weak tags:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) fetchWeakTags();
    else setLoading(false);
  }, [user]);

  if (loading) {
    return (
      <Card className="p-4 mt-4 text-center">
        <Spinner animation="border" size="sm" className="me-2" />
        Loading topic analysis...
      </Card>
    );
  }

  if (!allTags.length) {
    return (
      <Card className="p-4 mt-4 shadow-sm text-center">
        <h5 className="mb-3">📈 Topic Strength Analysis</h5>
        <Alert variant="success">
          No weak topics found. You're doing great!
        </Alert>
      </Card>
    );
  }

  const renderDeepStructure = (tag) => (
    <ul className="small text-muted">
      {tag.subtags.map((sub, idx) => (
        <li key={idx} className="mb-2">
          <strong>Subtag:</strong> {sub.subtag}
          <ul>
            {sub.approaches.map((app, i) => (
              <li key={i}>
                <strong>Approach:</strong> {app.approach}
                <ul>
                  {app.domains.map((dom, j) => (
                    <li key={j}>
                      <strong>Domain:</strong> {dom.performanceDomain}
                      <ul>
                        {dom.difficulties.map((diff, k) => (
                          <li key={k}>
                            {diff.difficulty} — {diff.correct}/{diff.total} (
                            <span
                              className={`badge ${
                                diff.accuracy < 50
                                  ? "bg-danger"
                                  : diff.accuracy < 75
                                  ? "bg-warning text-dark"
                                  : "bg-success"
                              }`}
                            >
                              {diff.accuracy}%
                            </span>
                            )
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );

  const renderTagCard = (tag) => {
    const wrong = tag.total - tag.correct;
    const weakness = 100 - tag.accuracy;

    return (
      <Card
        key={tag.tag}
        className="mb-3 shadow-sm"
        style={{
          borderLeft: `5px solid ${
            weakness >= 50
              ? "#e74c3c"
              : weakness >= 40
              ? "#f39c12"
              : "#2ecc71"
          }`,
        }}
      >
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h6 className="mb-0">{tag.tag}</h6>
            <Badge
              bg={
                weakness >= 50
                  ? "danger"
                  : weakness >= 40
                  ? "warning"
                  : "success"
              }
            >
              {weakness}% {weakness >= 50 ? "Revise" : weakness >= 40 ? "Review" : "Good"}
            </Badge>
          </div>
          <small className="text-muted">
            Total: {tag.total} | ✅ Correct: {tag.correct} | ❌ Wrong: {wrong}
          </small>
          {renderDeepStructure(tag)}
        </Card.Body>
      </Card>
    );
  };

  return (
    <Card className="p-4 mt-4 shadow-sm">
      <h5 className="mb-3">Topic Performance Overview</h5>

      <Tabs defaultActiveKey="weak" id="topic-tabs" className="mb-4">
        <Tab eventKey="weak" title="Weak Topics">
          {allTags.filter(t => t.accuracy < 75).length === 0 ? (
            <Alert variant="success">No weak topics found.</Alert>
          ) : (
            allTags.filter(t => t.accuracy < 75).map(renderTagCard)
          )}
        </Tab>

        <Tab eventKey="all" title="All Topics">
          {allTags.map(renderTagCard)}
        </Tab>
      </Tabs>

      <div className="text-center mt-3">
        <Button
          variant="outline-secondary"
          size="sm"
          onClick={() => setOpenDetails(!openDetails)}
          aria-controls="details-collapse"
          aria-expanded={openDetails}
        >
          {openDetails ? "Hide Chart" : "Show Chart"}
        </Button>
      </div>

      <Collapse in={openDetails}>
        <div id="details-collapse" className="mt-4">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={allTags}
              margin={{ top: 10, right: 30, left: 20, bottom: 80 }}
            >
              <XAxis
                dataKey="tag"
                interval={0}
                angle={-45}
                textAnchor="end"
                height={120}
                tick={{ fontSize: 11 }}
              />
              <YAxis />
              <Tooltip />
              <Bar dataKey={(d) => 100 - d.accuracy}>
                {allTags.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      100 - entry.accuracy >= 50
                        ? "#e74c3c"
                        : 100 - entry.accuracy >= 40
                        ? "#f39c12"
                        : "#2ecc71"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Collapse>
    </Card>
  );
};

export default WeakTopicsSection;
