import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './managereservations.css';

const ManageReservation = () => {
  const [reservations, setReservations] = useState([]);
  const [status, setStatus] = useState('');
  const [selectedReservationId, setSelectedReservationId] = useState(null);
  const [error, setError] = useState(null);

  // Fetch all reservations (Admin only)
  useEffect(() => {
    axios.get('http://localhost:4000/api/v1/reservations', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
    .then((res) => setReservations(res.data))
    .catch((err) => setError('Failed to fetch reservations.'));
  }, []);

  // Handle reservation status update
  const handleStatusChange = async (reservationId) => {
    try {
      const response = await axios.put(
        `http://localhost:4000/api/v1/manage/${reservationId}`,
        { status },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      alert('Reservation status updated successfully!');
      setReservations(reservations.map(reservation => 
        reservation._id === reservationId ? { ...reservation, status } : reservation
      ));
      setStatus('');
      setSelectedReservationId(null);
    } catch (err) {
      setError('Failed to update reservation status');
    }
  };

  return (
    <div className="manage-reservation-container">
      <h2>Manage Reservations</h2>
      {error && <p className="error">{error}</p>}

      <div className="reservation-list">
        {reservations.length === 0 ? (
          <p>No reservations available.</p>
        ) : (
          <table className="reservation-table">
            <thead>
              <tr>
                <th>Reservation ID</th>
                <th>Name</th>
                <th>Status</th>
                <th>Change Status</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((reservation) => (
                <tr key={reservation._id}>
                  <td>{reservation._id}</td>
                  <td>{reservation.name}</td>
                  <td>{reservation.status}</td>
                  <td>
                    <button
                      onClick={() => setSelectedReservationId(reservation._id)}
                    >
                      Change Status
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selectedReservationId && (
        <div className="status-update-form">
          <h3>Update Status</h3>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">Select Status</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Pending">Pending</option>
          </select>
          <button
            onClick={() => handleStatusChange(selectedReservationId)}
            disabled={!status}
          >
            Update Status
          </button>
        </div>
      )}
    </div>
  );
};

export default ManageReservation;
