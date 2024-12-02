import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './navbar';
import AuthForm from './AuthForm';
import Reservations from './reservations';
import Order from './order';
import Feedback from './feedback';
import EditMenu from './editmenu';
import ViewFeedback from './viewfeedback';
import ManageBookings from './managereservations';

const Home = () => {
  return (
    <>
      <Navbar />
      <h2>Welcome to the Restaurant Management System!</h2>
    </>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Default Login/Register Page */}
        <Route path="/" element={<AuthForm />} />
        
        {/* Home Page (Protected, requires authentication) */}
        <Route path="/home" element={<Home />} />
        
        {/* Customer Pages */}
        <Route path="/reservations" element={<Reservations />} />
        <Route path="/order" element={<Order />} />
        <Route path="/feedback" element={<Feedback />} />

        {/* Admin Pages */}
        <Route path="/edit-menu" element={<EditMenu />} />
        <Route path="/view-feedback" element={<ViewFeedback />} />
        <Route path="/manage-bookings" element={<ManageBookings />} />
        
        {/* Login and Signup Routes */}
        <Route path="/login" element={<AuthForm />} />
        <Route path="/signup" element={<AuthForm />} />
      </Routes>
    </Router>
  );
};

export default App;
