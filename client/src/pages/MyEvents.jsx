import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";

function MyEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMyEvents = async () => {
    try {
      const res = await API.get("/dashboard/organizer");
      // We'll fetch events separately since dashboard doesn't return full event list
      const eventsRes = await API.get("/events/my/events");
      setEvents(eventsRes.data);
    } catch (err) {
      setError("Failed to load your events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyEvents();
  }, []);

  if (loading) return <p style={{ padding: "20px" }}>Loading your events...</p>;
  if (error) return <p style={{ padding: "20px", color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>My Events</h2>
        <Link to="/organizer/create-event">
          <button>+ Create New Event</button>
        </Link>
      </div>

      {events.length === 0 ? (
        <p>You haven't created any events yet.</p>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
            marginTop: "20px",
          }}
        >
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
              <Link to={`/organizer/events/${event._id}/registrations`}>
                View Registrations
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyEvents;
