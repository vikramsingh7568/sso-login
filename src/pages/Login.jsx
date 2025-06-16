// pages/Login.jsx
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {

      // 1. On page load, check if URL has token (from auth server redirect)
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
          // 2. If token found, save token in localStorage for app usage
      localStorage.setItem('sso_token', token);
         // 3. Navigate to protected home page
      navigate('/home');
    } else {
         // 4. If no token, redirect to auth server /authorize to check SSO session cookie
      // Provide redirect_uri as current app origin so auth server knows where to send token after login
      const currentUrl = window.location.origin + '/';
      console.log('curernt url',currentUrl)
      const redirectUrl = `http://localhost:3000/authorize?redirect_uri=${encodeURIComponent(currentUrl)}`;
      console.log('redirecr url',redirectUrl)
      window.location.href = redirectUrl;
    }
  }, [location, navigate]);
 // Simple UI showing redirect/loading state
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-md p-10 text-center max-w-md w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Single Sign-On Login</h2>
        <p className="text-gray-600 mb-6">Redirecting you to the authentication server...</p>
        <div className="animate-pulse">
          <svg className="w-10 h-10 mx-auto text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" />
          </svg>
          <p className="text-sm text-gray-500 mt-2">Please wait...</p>
        </div>
        <p className="mt-6 text-sm text-blue-500">
          If not redirected, <a href="http://localhost:3000" className="underline">click here</a>.
        </p>
      </div>
    </div>
  );
};

export default Login;
