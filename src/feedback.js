import React, { useState, useEffect } from 'react';
import { fetchUserReservations, submitFeedback } from './api'; // Import centralized API functions
import './feedback.css';

const Feedback = () => {
  const [reservationId, setReservationId] = useState('');
  const [details, setDetails] = useState('');
  const [rating, setRating] = useState('');
  const [reservations, setReservations] = useState([]); // Initialize as an empty array
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetchUserReservations(token); // Removed unnecessary `null` argument
        setReservations(res?.data?.reservations || []); // Ensure reservations is always an array
        setError(null);
      } catch (err) {
        setError('Failed to fetch reservations.');
        setReservations([]); // Set to an empty array to avoid undefined issues
      }
    };

    fetchReservations();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await submitFeedback(
        { reservation_id: reservationId, details, rating },
        token
      );
      setSuccessMessage(response.data.message);
      setError(null);
      setReservationId('');
      setDetails('');
      setRating('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit feedback.');
      setSuccessMessage(null);
    }
  };

  return (
    <div className="feedback-container">
      <h2>Submit Your Feedback</h2>
      {error && <p className="error-message">{error}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}

      <form onSubmit={handleSubmit} className="feedback-form">
        <label htmlFor="reservation">Select Reservation:</label>
        <select
          id="reservation"
          value={reservationId}
          onChange={(e) => setReservationId(e.target.value)}
          required
        >
          <option value="">-- Select a Reservation --</option>
          {reservations.length > 0 ? (
            reservations.map((res) => (
              <option key={res._id} value={res._id}>
                {res.date} at {res.time} ({res.guestCount} guests)
              </option>
            ))
          ) : (
            <option disabled>No reservations available</option>
          )}
        </select>

        <label htmlFor="details">Feedback Details:</label>
        <textarea
          id="details"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder="Share your experience..."
          required
        ></textarea>

        <label htmlFor="rating">Rating (1-5):</label>
        <input
          id="rating"
          type="number"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          min="1"
          max="5"
          required
        />

        <button type="submit">Submit Feedback</button>
      </form>
    </div>
  );
};

export default Feedback;
