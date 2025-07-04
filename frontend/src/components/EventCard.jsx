// 📁 frontend/src/components/EventCard.jsx
import axios from 'axios';
import { toast } from 'react-toastify';
import './EventCard.css'; // Optional: styling

const EventCard = ({ event, onDelete }) => {
  const handleDelete = () => {
    axios.delete(`http://localhost:5000/api/events/${event._id}`)
      .then(() => {
        toast.success('🗑️ Event deleted');
        onDelete(); // reload list
      })
      .catch(err => {
        toast.error(err.response?.data?.error || 'Delete failed');
      });
  };

  const handleRegister = () => {
    axios.post(`http://localhost:5000/api/events/${event._id}/register`)
      .then(() => {
        toast.success('🎟️ Registered successfully');
        onDelete(); // reload to update count
      })
      .catch(err => {
        toast.error(err.response?.data?.error || 'Registration failed');
      });
  };

  return (
    <div className="event-card">
      <h3>{event.title}</h3>
      <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
      <p><strong>Venue:</strong> {event.venue}</p>
      <p><strong>Organizer:</strong> {event.organizer}</p>
      <p><strong>Seats:</strong> {event.registered}/{event.maxSeats}</p>
      <div className="event-buttons">
        <button onClick={handleRegister} className="btn-register">🎟️ Register</button>
        <button onClick={handleDelete} className="btn-delete">🗑️ Delete</button>
      </div>
    </div>
  );
};

export default EventCard;
