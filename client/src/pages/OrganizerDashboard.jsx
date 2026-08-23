import { useState, useEffect } from "react";
import API from "../api/axios";

function OrganizerDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get("/dashboard/organizer");
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
      <h2>Organizer Dashboard</h2>

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
          <h3>{stats.upcomingEvents}</h3>
          <p>Upcoming Events</p>
        </div>
        <div
          style={{
            border: "1px solid #ccc",
            padding: "20px",
            borderRadius: "8px",
            minWidth: "150px",
          }}
        >
          <h3>{stats.pastEvents}</h3>
          <p>Past Events</p>
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
        <div
          style={{
            border: "1px solid #ccc",
            padding: "20px",
            borderRadius: "8px",
            minWidth: "150px",
          }}
        >
          <h3>{stats.attendancePercentage}%</h3>
          <p>Attendance Rate</p>
        </div>
      </div>

      <h3>Registrations Per Event</h3>
      {stats.registrationsPerEvent.length === 0 ? (
        <p>No registrations yet.</p>
      ) : (
        <table
          border="1"
          cellPadding="10"
          style={{ borderCollapse: "collapse", width: "100%" }}
        >
          <thead>
            <tr>
              <th>Event</th>
              <th>Registrations</th>
            </tr>
          </thead>
          <tbody>
            {stats.registrationsPerEvent.map((item) => (
              <tr key={item._id}>
                <td>{item.eventTitle}</td>
                <td>{item.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default OrganizerDashboard;
