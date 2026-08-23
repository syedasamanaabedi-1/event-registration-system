import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";

function EventRegistrations() {
  const { id } = useParams();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const fetchRegistrations = async () => {
    try {
      const res = await API.get(`/events/${id}/registrations`);
      setRegistrations(res.data);
    } catch (err) {
      setError("Failed to load registrations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, [id]);

  const markAttendance = async (registrationId, status) => {
    setMessage("");
    try {
      await API.patch(`/registrations/${registrationId}/attendance`, {
        attendanceStatus: status,
      });
      setMessage("Attendance updated");
      fetchRegistrations();
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to update attendance");
    }
  };

  if (loading)
    return <p style={{ padding: "20px" }}>Loading registrations...</p>;
  if (error) return <p style={{ padding: "20px", color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Event Registrations</h2>

      {message && <p style={{ color: "blue" }}>{message}</p>}

      {registrations.length === 0 ? (
        <p>No registrations yet for this event.</p>
      ) : (
        <table
          border="1"
          cellPadding="10"
          style={{ borderCollapse: "collapse", width: "100%" }}
        >
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Booking Code</th>
              <th>Status</th>
              <th>Attendance</th>
              <th>Mark Attendance</th>
            </tr>
          </thead>
          <tbody>
            {registrations.map((r) => (
              <tr key={r._id}>
                <td>{r.attendee?.name}</td>
                <td>{r.attendee?.email}</td>
                <td>{r.bookingCode}</td>
                <td>{r.status}</td>
                <td>{r.attendanceStatus}</td>
                <td>
                  <button onClick={() => markAttendance(r._id, "present")}>
                    Present
                  </button>
                  <button onClick={() => markAttendance(r._id, "absent")}>
                    Absent
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default EventRegistrations;
