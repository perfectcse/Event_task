// 📁 frontend/src/components/EventForm.jsx
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const EventForm = ({ onEventAdded }) => {
  const [formData, setFormData] = useState({
    title: '',
    venue: '',
    date: '',
    organizer: '',
    maxSeats: ''
  });

  const handleChange = e => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.name === 'maxSeats'
        ? parseInt(e.target.value)
        : e.target.value
    }));
  };

  const handleSubmit = e => {
    e.preventDefault();

    // Validation
    if (!formData.title || !formData.date || !formData.venue || !formData.organizer || !formData.maxSeats) {
      toast.error('Please fill all fields');
      return;
    }

    axios.post('http://localhost:5000/api/events', formData)
      .then(() => {
        toast.success('Event created');
        setFormData({ title: '', venue: '', date: '', organizer: '', maxSeats: '' });
        onEventAdded(); // 🔁 Refresh list
      })
      .catch(err => {
        toast.error(err.response?.data?.error || 'Create failed');
      });
  };

  return (
    <form onSubmit={handleSubmit} className="event-form">
      <h2>➕ Add New Event</h2>
      <input type="text" name="title" placeholder="Event Title" value={formData.title} onChange={handleChange} />
      <input type="text" name="venue" placeholder="Venue" value={formData.venue} onChange={handleChange} />
      <input type="date" name="date" value={formData.date} onChange={handleChange} />
      <input type="text" name="organizer" placeholder="Organizer" value={formData.organizer} onChange={handleChange} />
      <input type="number" name="maxSeats" placeholder="Max Seats" value={formData.maxSeats} onChange={handleChange} />
      <button type="submit">📤 Create Event</button>
    </form>
  );
};

export default EventForm;
