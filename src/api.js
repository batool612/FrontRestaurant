import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000/api/v1';

// Place Order
export const placeOrder = async (data, token) => {
  return await axios.post(`${API_BASE_URL}/orders/place`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Edit Order
export const editOrder = async (orderId, data, token) => {
  return await axios.put(`${API_BASE_URL}/orders/edit/${orderId}`, data, {
    headers: { Authorization: `Bearer ${token}` },

  });
};

// Cancel Order
export const cancelOrder = async (orderId, token) => {
  return await axios.patch(`${API_BASE_URL}/orders/cancel/${orderId}`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Fetch Menu Items (requires token for authentication)
export const fetchMenuItems = async (token) => {
  return await axios.get(`${API_BASE_URL}/menu`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Fetch all reservations (requires token for authentication)
export const fetchReservations = async (token) => {
  return await axios.get(`${API_BASE_URL}/reservations`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Update reservation status (requires token for authentication)

export const manageReservation = async (reservationId, status, token) => {
    return await axios.put(`${API_BASE_URL}/manage/${reservationId}`, 
        { status }, 
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );
};