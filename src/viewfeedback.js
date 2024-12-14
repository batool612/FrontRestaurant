import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './viewfeedback.css';

const ViewFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch feedback data (only for admin)
    axios.get('http://localhost:4000/api/v1/view', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
    .then((res) => setFeedbacks(res.data.feedbacks))
    .catch((err) => setError('Failed to fetch feedback.'));
  }, []);

  return (
    <div className="feedback-container">
      <h2>Feedback</h2>
      {error && <p className="error">{error}</p>}

      {feedbacks.length === 0 ? (
        <p>No feedback available.</p>
      ) : (
        <table className="feedback-table">
          <thead>
            <tr>
              <th>Reservation ID</th>
              <th>Details</th>
              <th>Rating</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {feedbacks.map((feedback, index) => (
              <tr key={index}>
                <td>{feedback.reservation_id}</td>
                <td>{feedback.details}</td>
                <td>{feedback.rating}</td>
                <td>{new Date(feedback.date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ViewFeedback;
