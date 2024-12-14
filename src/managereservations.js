import React, { useState, useEffect } from 'react';
import { fetchAllReservations, manageReservation } from './api'; // Import API functions
import './managereservations.css';

const ManageReservation = () => {
    const [reservations, setReservations] = useState([]);
    const [status, setStatus] = useState('');
    const [selectedReservationId, setSelectedReservationId] = useState(null);
    const [error, setError] = useState(null);

    // Fetch all reservations (Admin only)
    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetchAllReservations(token); // Call the API function
                if (response.data && response.data.reservations) {
                    setReservations(response.data.reservations);
                } else {
                    throw new Error('Unexpected response structure');
                }
                setError(null);
            } catch (err) {
                console.error('Error fetching reservations:', err.message);
                setError('Failed to fetch reservations.');
            }
        };

        fetchReservations();
    }, []);

    // Handle reservation status update
    const handleStatusChange = async (reservationId) => {
        if (!status) {
            setError('Please select a status before updating.');
            return;
        }
        try {
            const token = localStorage.getItem('token');
            await manageReservation(reservationId, status, token); // Call the API function
            alert('Reservation status updated successfully!');
            setReservations(
                reservations.map((reservation) =>
                    reservation._id === reservationId ? { ...reservation, status } : reservation
                )
            );
            setStatus('');
            setSelectedReservationId(null);
            setError(null);
        } catch (err) {
            console.error('Error updating reservation status:', err.message);
            setError('Failed to update reservation status.');
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
                                <th>Status</th>
                                <th>Change Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reservations.map((reservation) => (
                                <tr key={reservation._id}>
                                    <td>{reservation._id}</td>
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
                        <option value="active">active</option>
                        <option value="canceled">canceled</option>
                        <option value="completed">completed</option>
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
