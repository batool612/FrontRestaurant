import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios for API requests
import './AuthForm.css'; // Import your custom CSS for styling

const AuthForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(location.pathname === '/signup');
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState(null);

  // Update form type (sign up or login) based on the URL
  useEffect(() => {
    setIsSignUp(location.pathname === '/signup');
  }, [location]);

  // Handle input field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission for both login and signup
  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isSignUp ? 'signup' : 'login';
    const payload = isSignUp
      ? formData
      : { email: formData.email, password: formData.password };

    try {
      // Send POST request to backend API
      const response = await axios.post(`http://localhost:4000/api/v1/${endpoint}`, payload);

      if (response.data.token) {
        // If login is successful and a token is returned, save the token
        localStorage.setItem('token', response.data.token);
        alert(`${isSignUp ? 'Sign-up' : 'Login'} Successful`);
        navigate('/'); // Redirect to home or dashboard
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      setError('Something went wrong! Please try again.');
      console.error(error);
    }
  };

  // Switch between the login and signup forms
  const switchForm = () => {
    navigate(isSignUp ? '/login' : '/signup');
  };

  return (
    <div className="auth-container">
      <h2>{isSignUp ? 'Sign Up' : 'Login'}</h2>
      <form onSubmit={handleSubmit}>
        {isSignUp && (
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        )}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">{isSignUp ? 'Sign Up' : 'Login'}</button>
        {error && <p className="error">{error}</p>}
      </form>
      <button className="switch-button" onClick={switchForm}>
        Switch to {isSignUp ? 'Login' : 'Sign Up'}
      </button>
    </div>
  );
};

export default AuthForm;
