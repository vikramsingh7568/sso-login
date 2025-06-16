import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoutButton from '../components/LogoutButton';

const Home = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('sso_token');
  useEffect(() => {
    if (!token) {
      navigate('/', { replace: true });
    }
  }, [token, navigate]);

  if (!token) return null; // or a loading spinner

  return (
    <div className="p-8">
      <h1>🏠 Home Page</h1>
      <p>✅ Logged in with token:</p>
      <code>{token}</code>
      <br />
      <LogoutButton />
    </div>
  );
};

export default Home;
