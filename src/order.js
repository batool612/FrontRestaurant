import React, { useState, useEffect } from 'react';
import { placeOrder, fetchMenuItems, fetchUserReservations } from './api'; // Import API functions
import './order.css';

const Order = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [reservationId, setReservationId] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true); // State to track loading status
  const token = localStorage.getItem('token'); // Fetch token from localStorage

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Start loading
      try {
        const menuResponse = await fetchMenuItems(token); // Fetch menu items
        const reservationResponse = await fetchUserReservations(token); // Fetch user reservations
  
        console.log("Menu items:", menuResponse.data.menuItems);
        console.log("Reservations:", reservationResponse.data.reservations);
  
        setMenuItems(menuResponse.data.menuItems); // Set menu items in state
        setReservations(reservationResponse.data.reservations); // Set reservations in state
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false); // End loading
      }
    };
  
    fetchData();
  }, [token]);

  // Function to handle adding items to the order
  const handleAddItem = (itemName) => {
    setOrderItems((prev) => {
      const existingItem = prev.find((item) => item.name === itemName);
      if (existingItem) {
        return prev.map((item) =>
          item.name === itemName
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        const item = menuItems.find((menuItem) => menuItem.name === itemName);
        return [...prev, { name: itemName, quantity: 1 }];
      }
    });
  };

  // Function to handle removing items from the order
  const handleRemoveItem = (itemName) => {
    setOrderItems((prev) => prev.filter((item) => item.name !== itemName));
  };

  // Function to handle placing the order
  const handlePlaceOrder = async () => {
    if (!reservationId) {
      setMessage('Please select a reservation before placing the order.');
      return; // Exit the function if no reservation is selected
    }

    try {
      const orderData = {
        reservation_id: reservationId,
        items: orderItems.map(({ name, quantity }) => ({ name, quantity })), // Use item names
      };
      const response = await placeOrder(orderData, token); // Place the order
      setMessage(response.data.message); // Show success message
      setOrderItems([]); // Reset order items
    } catch (error) {
      setMessage('Failed to place order.'); // Show error message
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Order Page - View and Place Your Orders</h2>

      {message && <p>{message}</p>}

      {loading ? (
        <p>Loading...</p> // Show loading message while fetching data
      ) : (
        <>
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
              {menuItems.length === 0 ? (
                <li>No menu items available</li>
              ) : (
                menuItems.map((item) => (
                  <li key={item._id} style={{ marginBottom: '15px' }}>
                    <strong>{item.name}</strong> - ${item.price}
                    <p style={{ fontStyle: 'italic', margin: '5px 0' }}>{item.description}</p>
                    <button onClick={() => handleAddItem(item.name)}>Add</button>
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* Current Order */}
          <div>
            <h3>Your Order</h3>
            <ul>
              {orderItems.length === 0 ? (
                <li>No items selected yet</li>
              ) : (
                orderItems.map((item, index) => (
                  <li key={index}>
                    {item.name} - Quantity: {item.quantity}
                    <button onClick={() => handleRemoveItem(item.name)}>Remove</button>
                  </li>
                ))
              )}
            </ul>
            {orderItems.length > 0 && (
              <button onClick={handlePlaceOrder} disabled={!reservationId}>
                Place Order
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Order;
