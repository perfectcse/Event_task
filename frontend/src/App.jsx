// 📁 src/App.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import EventCard from './components/EventCard';
import EventForm from './components/EventForm';
import AdminLogin from './components/AdminLogin';
import Dashboard from './components/Dashboards';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem('token')
  );

  // 🔐 Set token for Axios
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [isAuthenticated]);

  // 📦 Fetch Events
  const fetchEvents = () => {
    axios
      .get('http://localhost:5000/api/events')
      .then((res) => setEvents(res.data))
      .catch((err) => console.error('Error fetching events:', err));
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchEvents();
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 🔐 Login Page
  if (!isAuthenticated) {
    return (
      <>
        <AdminLogin onLogin={() => setIsAuthenticated(true)} />
        <ToastContainer />
      </>
    );
  }

  // ✅ Authenticated Dashboard View
  return (
    <div className={`app-container ${darkMode ? 'dark' : ''}`}>
      <div className="header">
        <h1>📅 Event Task</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setDarkMode((prev) => !prev)}
            className="toggle-theme"
          >
            {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
          <button
            onClick={handleLogout}
            className="toggle-theme"
            style={{ background: '#ef4444' }}
          >
            🚪 Logout
          </button>
        </div>
      </div>

      {/* ✅ Dashboard Section */}
      <Dashboard />

      {/* 🔍 Search Field */}
      <input
        type="text"
        placeholder="🔍 Search by event title..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      {/* 🎯 Events Section */}
      <div className="events-wrapper">
        <EventForm onEventAdded={fetchEvents} />
        <hr style={{ width: '100%', margin: '20px 0' }} />
        {filteredEvents.length === 0 ? (
          <p>No events found</p>
        ) : (
          filteredEvents.map((event) => (
            <EventCard key={event._id} event={event} onDelete={fetchEvents} />
          ))
        )}
      </div>

      <ToastContainer />
    </div>
  );
}

export default App;
