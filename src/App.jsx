import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';

import Home from './pages/Home';
import AuthLogin from './pages/AuthLogin';
import Login from './pages/Login';

// Logout sync hook
function useLogoutSync() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('logout') === 'true') {
      localStorage.removeItem('sso_token');
      navigate('/', { replace: true });
    }
  }, [location, navigate]);
}

function AppWrapper() {
  const navigate = useNavigate();
  const location = useLocation();

  useLogoutSync();

  useEffect(() => {
    const token = localStorage.getItem('sso_token');
    if (token && location.pathname === '/') {
      navigate('/home', { replace: true });
    }
  }, [location, navigate]);

  return (
    <>
      <Routes>
        <Route path="/" element={<AuthLogin />} />
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
