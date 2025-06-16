// pages/Home.jsx
import React from 'react';
import LogoutButton from '../components/LogoutButton';

const Home = () => {
  const token = localStorage.getItem('sso_token');

  return (
    <div className="p-8">
      <h1>🏠 Home Page</h1>
      {token ? (
        <>
          <p>✅ Logged in with token:</p>
          <code>{token}</code>
          <br />
          <LogoutButton />
        </>
      ) : (
        <p>❌ Not logged in</p>
      )}
    </div>
  );
};

export default Home;
