// App.jsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';

import Login from './pages/Login';
import Home from './pages/Home';

// Define custom hook inside the same file
function useLogoutSync() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('logout') === 'true') {
      localStorage.removeItem('sso_token');
      navigate('/'); // redirect to login page or root
    }
  }, [location, navigate]);
}

// Wrapper component to use hooks inside Router
function AppWrapper() {
  useLogoutSync();

  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;
