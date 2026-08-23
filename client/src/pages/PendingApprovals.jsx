import { useState, useEffect } from "react";
import API from "../api/axios";

function PendingApprovals() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const fetchPendingEvents = async () => {
    try {
      // Fetch all events, filter pending/approved on frontend since we don't have a dedicated admin endpoint yet
      const res = await API.get("/events/admin/all");
      setEvents(res.data);
    } catch (err) {
      setError("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingEvents();
  }, []);

  const handleApprove = async (eventId) => {
    setMessage("");
    try {
      await API.patch(`/events/${eventId}/approve`);
      setMessage("Event approved");
      fetchPendingEvents();
    } catch (err) {
      setMessage(err.response?.data?.message || "Approval failed");
    }
  };

  const handlePublish = async (eventId) => {
    setMessage("");
    try {
      await API.patch(`/events/${eventId}/publish`);
      setMessage("Event published");
      fetchPendingEvents();
    } catch (err) {
      setMessage(err.response?.data?.message || "Publish failed");
    }
  };

  if (loading) return <p style={{ padding: "20px" }}>Loading events...</p>;
  if (error) return <p style={{ padding: "20px", color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Manage Events</h2>

      {message && <p style={{ color: "blue" }}>{message}</p>}

      {events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          {events.map((event) => (
            <div
              key={event._id}
              style={{
                border: "1px solid #ccc",
                padding: "15px",
                borderRadius: "8px",
              }}
            >
              <h3>{event.title}</h3>
              <p>
                <strong>Status:</strong> {event.status}
              </p>
              <p>
                <strong>City:</strong> {event.city}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(event.startAt).toLocaleString()}
              </p>

              {event.status === "pending" && (
                <button onClick={() => handleApprove(event._id)}>
                  Approve
                </button>
              )}

              {event.status === "approved" && (
                <button onClick={() => handlePublish(event._id)}>
                  Publish
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PendingApprovals;
