import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

useEffect(() => {
  const params = new URLSearchParams(location.search);
  const token = params.get('token');

  // ✅ If token exists in URL, save it and go to /home
  if (token) {
    localStorage.setItem('sso_token', 'token');
    navigate('/home', { replace: true });
    return;
  }

  // ✅ If token already exists in localStorage
  const existingToken = localStorage.getItem('sso_token');
  if (existingToken) {
    navigate('/home', { replace: true });
    return;
  }

  if(!existingToken){
  // 🔁 If no token anywhere, call /authorize
  const currentUrl = window.location.origin + '/';
  const redirectUrl = `http://localhost:3000/authorize?redirect_uri=${encodeURIComponent(currentUrl)}`;
  window.location.href = redirectUrl;
  }
}, [location, navigate]);




  const handleLogin = async (e) => {
    e.preventDefault();

    const redirectUri = new URLSearchParams(location.search).get('redirect_uri') || 'http://localhost:5174';

    try {
      const res = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, redirect_uri: redirectUri }),
      });

      const data = await res.json();

      if (data.success) {
        window.location.href = data.redirect;  // redirect with token
      } else {
        setErrorMsg(data.message || 'Login failed');
      }
    } catch (err) {
      setErrorMsg('Server error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-md shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">Login to Continue</h2>
        {errorMsg && <p className="text-red-600 text-sm mb-4">{errorMsg}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            id="email"
            name="email"
            type="email"
            className="w-full px-4 py-2 border border-gray-300 rounded"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            id="password"
            name="password"
            type="password"
            className="w-full px-4 py-2 border border-gray-300 rounded"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthLogin;
