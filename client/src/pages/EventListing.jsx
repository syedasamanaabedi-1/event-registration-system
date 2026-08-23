import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';

function EventListing() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await API.get('/events');
        setEvents(res.data.events);
      } catch (err) {
        setError('Failed to load events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) return <p style={{ padding: '20px' }}>Loading events...</p>;
  if (error) return <p style={{ padding: '20px', color: 'red' }}>{error}</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Upcoming Events</h2>

      {events.length === 0 ? (
        <p>No events available right now.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {events.map((event) => (
            <div key={event._id} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
              <h3>{event.title}</h3>
              <p>{event.description}</p>
              <p><strong>Venue:</strong> {event.venue}, {event.city}</p>
              <p><strong>Date:</strong> {new Date(event.startAt).toLocaleString()}</p>
              <Link to={`/events/${event._id}`}>View Details</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default EventListing;