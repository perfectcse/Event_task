// 📁 src/components/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Dashboard.css';

function Dashboard() {
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalRegistered: 0,
    totalAvailableSeats: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/events')
      .then((res) => {
        const events = res.data;

        const totalEvents = events.length;
        const totalRegistered = events.reduce(
          (sum, event) => sum + event.registered,
          0
        );
        const totalMaxSeats = events.reduce(
          (sum, event) => sum + event.maxSeats,
          0
        );
        const totalAvailableSeats = totalMaxSeats - totalRegistered;

        setStats({ totalEvents, totalRegistered, totalAvailableSeats });
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching stats:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="dashboard-loading">Loading statistics...</p>;

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">📊 Event Dashboard</h2>
      <div className="dashboard-cards">
        <div className="dashboard-card blue">
          <h3>Total Events</h3>
          <p>{stats.totalEvents}</p>
        </div>
        <div className="dashboard-card green">
          <h3>Total Registered</h3>
          <p>{stats.totalRegistered}</p>
        </div>
        <div className="dashboard-card purple">
          <h3>Available Slots</h3>
          <p>{stats.totalAvailableSeats}</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
