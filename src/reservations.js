import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './reservations.css';

const Reservations = () => {
  const [slots, setSlots] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [newReservation, setNewReservation] = useState({ date: '', time: '', guestCount: '' });
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch available slots
    axios.get('http://localhost:4000/api/v1/slots') // Replace with your slots API endpoint
      .then((res) => setSlots(res.data))
      .catch((err) => setError('Failed to fetch available slots'));

    // Fetch user reservations
    axios.get('http://localhost:4000/api/v1/view', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
      .then((res) => setReservations(res.data))
      .catch((err) => setError('Failed to fetch reservations'));
  }, []);

  const handleReservation = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4000/api/v1/reservations', newReservation, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      alert('Reservation made successfully!');
      setReservations([...reservations, response.data]);
    } catch (err) {
      setError('Failed to make reservation');
    }
  };

  return (
    <div>
      <h2>Reservations</h2>
      {error && <p className="error">{error}</p>}

      <form onSubmit={handleReservation}>
        <select
          name="date"
          onChange={(e) => setNewReservation({ ...newReservation, date: e.target.value })}
          required
        >
          <option value="">Select Date</option>
          {slots.map((slot, index) => (
            <option key={index} value={slot.date}>
              {slot.date} - {slot.time}
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Guest Count"
          onChange={(e) => setNewReservation({ ...newReservation, guestCount: e.target.value })}
          required
        />
        <button type="submit">Reserve</button>
      </form>

      <h3>Your Reservations</h3>
      <ul>
        {reservations.map((res, index) => (
          <li key={index}>
            {res.date} at {res.time} for {res.guestCount} guests
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Reservations;
