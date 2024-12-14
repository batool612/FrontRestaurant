import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000/api/v1';

// Common function for handling requests
const request = (method, url, data = {}, token = '') =>
  axios({
    method,
    url: `${API_BASE_URL}${url}`,
    data,
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

// Feedback API
export const submitFeedback = async (data, token) => request('post', '/feedback/submit', data, token);
export const viewFeedback = async (token) => request('get', '/feedback/view', {}, token);

// Menu Items API
export const addMenuItem = async (data, token) => request('post', '/menu/add', data, token);
export const editMenuItem = async (itemId, data, token) => request('put', `/menu/edit/${itemId}`, data, token);
export const deleteMenuItem = async (itemId, token) => request('delete', `/menu/delete/${itemId}`, {}, token);
export const fetchMenuItems = async (token) => request('get', '/menu', {}, token);

// Reservation API
export const createReservation = async (data, token) => request('post', '/reservations/create', data, token);
export const editReservation = async (reservationId, data, token) => request('put', `/reservations/edit/${reservationId}`, data, token);
export const cancelReservation = async (reservationId, token) => request('patch', `/reservations/cancel/${reservationId}`, {}, token);
export const fetchUserReservations = async (token) => request('get', '/reservations/view', {}, token);
export const fetchAllReservations = async (token) => request('get', '/reservations/reservations', {}, token); // Admin only

// Order API
export const placeOrder = async (data, token) => request('post', '/orders/place', data, token);
export const editOrder = async (orderId, data, token) => request('put', `/orders/edit/${orderId}`, data, token);
export const cancelOrder = async (orderId, token) => request('patch', `/orders/cancel/${orderId}`, {}, token);

// Reservation Management (Admin)
export const manageReservation = async (reservationId, status, token) =>
  request('put', `/reservations/manage/${reservationId}`, { status }, token);
// Table API
export const fetchAvailableTables = async (token) => request('get', '/reservations/tables', {}, token); // Get available tables
