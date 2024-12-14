import React, { useState, useEffect } from 'react';
import { fetchUserReservations, createReservation, fetchAvailableTables } from './api'; // Import API functions
import './reservations.css';

const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const [availableTables, setAvailableTables] = useState([]); // State for available tables
  const [newReservation, setNewReservation] = useState({
    table_number: '',
    time: '',
  });
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token'); // Retrieve token from localStorage

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user reservations
        const reservationsResponse = await fetchUserReservations(token);
        setReservations(reservationsResponse.data.reservations);

        // Fetch available tables
        const tablesResponse = await fetchAvailableTables(token);
        setAvailableTables(tablesResponse.data.tables);

        setError(null); // Clear any previous errors
      } catch (err) {
        setError('Failed to fetch reservations or available tables.');
        console.error('Error:', err.response || err.message);
      }
    };

    fetchData();
  }, [token]);

  const handleReservation = async (e) => {
    e.preventDefault();
    try {
      const response = await createReservation(newReservation, token); // Create a new reservation
      alert('Reservation made successfully!');
      setReservations([...reservations, response.data.reservation]); // Add the new reservation to the state
      setNewReservation({ table_number: '', time: '' }); // Reset the form
      setError(null);
    } catch (err) {
      console.error('Error creating reservation:', err.response || err.message);
      setError(err.response?.data?.error || 'Failed to make reservation.');
    }
  };

  return (
    <div>
      <h2>Reservations</h2>
      {error && <p className="error">{error}</p>}

      {/* Reservation Form */}
      <form onSubmit={handleReservation}>
        {/* Table Selector */}
        <select
          name="table_number"
          value={newReservation.table_number}
          onChange={(e) =>
            setNewReservation({ ...newReservation, table_number: e.target.value })
          }
          required
        >
          <option value="">Select Table</option>
          {availableTables.map((table) => (
            <option key={table._id} value={table.table_number}>
              Table {table.table_number}
            </option>
          ))}
        </select>

        {/* Date and Time Input */}
        <input
          type="datetime-local"
          value={newReservation.time}
          onChange={(e) =>
            setNewReservation({ ...newReservation, time: e.target.value })
          }
          required
        />
        <button type="submit">Reserve</button>
      </form>

      {/* User Reservations */}
      <h3>Your Reservations</h3>
      <ul>
        {reservations.map((res, index) => (
          <li key={index}>
            Table {res.table_number} at {new Date(res.time).toLocaleString()} for {res.guestCount || 0} guests
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Reservations;
