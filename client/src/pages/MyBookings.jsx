import { useState, useEffect } from 'react';
import API from '../api/axios';

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const fetchBookings = async () => {
    try {
      const res = await API.get('/dashboard/attendee');
      setBookings(res.data.recentActivity || []);
    } catch (err) {
      setError('Failed to load your bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (registrationId) => {
    setMessage('');
    try {
      await API.patch(`/registrations/${registrationId}/cancel`);
      setMessage('Booking cancelled successfully');
      fetchBookings();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Cancellation failed');
    }
  };

  if (loading) return <p style={{ padding: '20px' }}>Loading your bookings...</p>;
  if (error) return <p style={{ padding: '20px', color: 'red' }}>{error}</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>My Bookings</h2>

      {message && <p style={{ color: message.includes('success') ? 'green' : 'red' }}>{message}</p>}

      {bookings.length === 0 ? (
        <p>You have no bookings yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {bookings.map((b) => (
            <div key={b._id} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
              <h3>{b.event?.title}</h3>
              <p><strong>City:</strong> {b.event?.city}</p>
              <p><strong>Date:</strong> {new Date(b.event?.startAt).toLocaleString()}</p>
              <p><strong>Booking Code:</strong> {b.bookingCode}</p>
              <p><strong>Status:</strong> {b.status}</p>
              <p><strong>Attendance:</strong> {b.attendanceStatus}</p>

              {b.status === 'confirmed' && (
                <button onClick={() => handleCancel(b._id)}>Cancel Booking</button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyBookings;