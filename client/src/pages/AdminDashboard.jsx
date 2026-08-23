import { useState, useEffect } from "react";
import API from "../api/axios";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get("/dashboard/admin");
        setStats(res.data);
      } catch (err) {
        setError("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <p style={{ padding: "20px" }}>Loading dashboard...</p>;
  if (error) return <p style={{ padding: "20px", color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Admin Dashboard</h2>

      <div
        style={{
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
          marginBottom: "30px",
        }}
      >
        <div
          style={{
            border: "1px solid #ccc",
            padding: "20px",
            borderRadius: "8px",
            minWidth: "150px",
          }}
        >
          <h3>{stats.pendingApprovals}</h3>
          <p>Pending Approvals</p>
        </div>
        <div
          style={{
            border: "1px solid #ccc",
            padding: "20px",
            borderRadius: "8px",
            minWidth: "150px",
          }}
        >
          <h3>{stats.totalEvents}</h3>
          <p>Total Events</p>
        </div>
        <div
          style={{
            border: "1px solid #ccc",
            padding: "20px",
            borderRadius: "8px",
            minWidth: "150px",
          }}
        >
          <h3>{stats.totalUsers}</h3>
          <p>Attendees Registered</p>
        </div>
        <div
          style={{
            border: "1px solid #ccc",
            padding: "20px",
            borderRadius: "8px",
            minWidth: "150px",
          }}
        >
          <h3>{stats.totalRegistrations}</h3>
          <p>Total Registrations</p>
        </div>
      </div>

      <h3>Events by Status</h3>
      <table border="1" cellPadding="10" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Status</th>
            <th>Count</th>
          </tr>
        </thead>
        <tbody>
          {stats.eventsByStatus.map((item) => (
            <tr key={item._id}>
              <td>{item._id}</td>
              <td>{item.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminDashboard;
