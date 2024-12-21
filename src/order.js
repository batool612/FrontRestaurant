import React, { useState, useEffect } from 'react';
import { placeOrder, fetchMenuItems, fetchUserReservations } from './api';
import './order.css';

const Order = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [reservationId, setReservationId] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  // Calculate the total price based on order items
  const totalPrice = orderItems.reduce((total, orderItem) => {
    const menuItem = menuItems.find((item) => item.name === orderItem.name);
    return total + (menuItem ? menuItem.price * orderItem.quantity : 0);
  }, 0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const menuResponse = await fetchMenuItems(token);
        const reservationResponse = await fetchUserReservations(token);

        setMenuItems(menuResponse.data.menuItems);
        setReservations(
          reservationResponse.data.reservations.filter(
            (reservation) => reservation.status !== 'canceled' && reservation.status !== 'completed'
          )
        );
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

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
        return [...prev, { name: itemName, quantity: 1 }];
      }
    });
  };

  const handleRemoveItem = (itemName) => {
    setOrderItems((prev) => prev.filter((item) => item.name !== itemName));
  };

  const handlePlaceOrder = async () => {
    if (!reservationId) {
      setMessage('Please select a reservation before placing the order.');
      return;
    }

    try {
      const orderData = {
        reservation_id: reservationId,
        items: orderItems.map(({ name, quantity }) => ({ name, quantity })),
      };
      const response = await placeOrder(orderData, token);
      setMessage(response.data.message);
      setOrderItems([]);
    } catch (error) {
      setMessage('Failed to place order.');
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Order Page - View and Place Your Orders</h2>

      {message && <p>{message}</p>}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
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
              <>
                <p><strong>Total Price:</strong> ${totalPrice.toFixed(2)}</p>
                <button onClick={handlePlaceOrder} disabled={!reservationId}>
                  Place Order
                </button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Order;
