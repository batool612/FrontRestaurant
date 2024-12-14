import React, { useState, useEffect } from 'react';
import { viewFeedback } from './api'; // Import the centralized API function
import './viewfeedback.css';

const ViewFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const token = localStorage.getItem('token'); // Retrieve token from localStorage
        const response = await viewFeedback(token); // Fetch feedback using API function
        setFeedbacks(response.data.feedbacks); // Set feedbacks in state
      } catch (err) {
        setError('Failed to fetch feedback.');
      }
    };

    fetchFeedbacks();
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
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {feedbacks.map((feedback, index) => (
              <tr key={index}>
                <td>{feedback.reservation_id}</td>
                <td>{feedback.details}</td>
                <td>{feedback.rating}</td>
                <td>{new Date(feedback.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ViewFeedback;
