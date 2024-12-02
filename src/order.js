import React, { useState, useEffect } from 'react';
import { placeOrder, fetchMenuItems, fetchReservations } from './api';
import './order.css';

const Order = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [reservationId, setReservationId] = useState('');
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token'); // Fetch token from localStorage

  useEffect(() => {
    // Fetch menu items and reservations when the component mounts
    const fetchData = async () => {
      try {
        const menuResponse = await fetchMenuItems(token);
        const reservationResponse = await fetchReservations(token);

        setMenuItems(menuResponse.data.menuItems);
        setReservations(reservationResponse.data.reservations);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [token]);

  const handleAddItem = (itemId) => {
    setOrderItems((prev) => {
      const existingItem = prev.find((item) => item.item_id === itemId);
      if (existingItem) {
        return prev.map((item) =>
          item.item_id === itemId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        const item = menuItems.find((menuItem) => menuItem._id === itemId);
        return [...prev, { item_id: itemId, name: item.name, quantity: 1 }];
      }
    });
  };

  const handlePlaceOrder = async () => {
    try {
      const orderData = {
        reservation_id: reservationId,
        items: orderItems.map(({ item_id, quantity }) => ({ item_id, quantity })),
      };
      const response = await placeOrder(orderData, token);
      setMessage(response.data.message);
      setOrderItems([]); // Reset order items after successful order
    } catch (error) {
      setMessage('Failed to place order.');
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Order Page - View and Place Your Orders</h2>

      {message && <p>{message}</p>}

      {/* Reservation Selector */}
      <div>
        <h3>Select Reservation</h3>
        <select onChange={(e) => setReservationId(e.target.value)} value={reservationId}>
          <option value="">Select a reservation</option>
          {reservations.length === 0 ? (
            <option value="">No reservations available</option>
          ) : (
            reservations.map((reservation) => (
              <option key={reservation._id} value={reservation._id}>
                Table {reservation.table_number} - {new Date(reservation.time).toLocaleString()}
              </option>
            ))
          )}
        </select>
      </div>

      {/* Menu Items */}
      <div>
        <h3>Menu Items</h3>
        <ul>
          {menuItems.map((item) => (
            <li key={item._id} style={{ marginBottom: '15px' }}>
              <strong>{item.name}</strong> - ${item.price}
              <p style={{ fontStyle: 'italic', margin: '5px 0' }}>{item.description}</p>
              <button onClick={() => handleAddItem(item._id)}>Add</button>
            </li>
          ))}
        </ul>
      </div>

      {/* Current Order */}
      <div>
        <h3>Your Order</h3>
        <ul>
          {orderItems.map((item) => (
            <li key={item.item_id}>
              {item.name} - Quantity: {item.quantity}
            </li>
          ))}
        </ul>
        {orderItems.length > 0 && (
          <button onClick={handlePlaceOrder}>Place Order</button>
        )}
      </div>
    </div>
  );
};

export default Order;
