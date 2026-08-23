import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

function EventDetails() {
  const { id } = useParams();
  const { user } = useAuth();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const fetchEvent = async () => {
    try {
      const res = await API.get(`/events/${id}`);
      setEvent(res.data);
    } catch (err) {
      setError('Failed to load event');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const handleRegister = async () => {
    setMessage('');
    try {
      const res = await API.post(`/events/${id}/register`);
      setMessage(`Registered successfully! Booking Code: ${res.data.bookingCode}`);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Registration failed');
    }
  };

  if (loading) return <p style={{ padding: '20px' }}>Loading event...</p>;
  if (error) return <p style={{ padding: '20px', color: 'red' }}>{error}</p>;
  if (!event) return null;

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>{event.title}</h2>
      <p>{event.description}</p>
      <p><strong>Venue:</strong> {event.venue}, {event.city}</p>
      <p><strong>Start:</strong> {new Date(event.startAt).toLocaleString()}</p>
      <p><strong>End:</strong> {new Date(event.endAt).toLocaleString()}</p>
      <p><strong>Capacity:</strong> {event.capacity}</p>
      <p><strong>Registration Deadline:</strong> {new Date(event.registrationDeadline).toLocaleString()}</p>

      {message && <p style={{ color: message.includes('success') ? 'green' : 'red' }}>{message}</p>}

      {user?.role === 'attendee' && (
        <button onClick={handleRegister} style={{ padding: '10px 20px' }}>
          Register for this Event
        </button>
      )}

      {!user && <p>Please <a href="/login">login</a> to register.</p>}
    </div>
  );
}

export default EventDetails;