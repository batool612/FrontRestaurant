import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AuthForm from './AuthForm';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Use dynamic routing to handle form switching */}
        <Route path="/" element={<AuthForm />} />
        <Route path="/signup" element={<AuthForm />} />
        <Route path="/login" element={<AuthForm />} />
      </Routes>
    </Router>
  );
};

export default App;
