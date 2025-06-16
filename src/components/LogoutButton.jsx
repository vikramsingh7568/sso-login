// components/LogoutButton.jsx
import React from 'react';

const LogoutButton = () => {
  const logout = () => {
    // 1. Clear local token
    localStorage.removeItem('sso_token');

    // 2. Call logout on auth server to clear cookie
    fetch('http://localhost:3000/logout', {
      method: 'POST',
      credentials: 'include', // important to send cookie
    }).finally(() => {
      // 3. Redirect to logout handler page on auth server
      // Replace ports with your frontend app ports
      window.location.href = 'http://localhost:3000/logout?redirect_uris=http://localhost:5173,http://localhost:5174';
    });
  };

  return (
    <button
      onClick={logout}
      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
