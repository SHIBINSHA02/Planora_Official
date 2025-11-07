// frontend/src/Components/auth/login.jsx
import React, { useState } from 'react';

const Login = ({ onLoggedIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

    
      const responseBody = await response.text();

    
      if (!response.ok || !responseBody) {
       
        let errorMessage = 'Login failed. Please try again.';
        try {
          const errorJson = JSON.parse(responseBody);
          errorMessage = errorJson.message || errorMessage;
        } catch (parseError) {
         
          console.error("Could not parse error response:", responseBody);
        }
        throw new Error(errorMessage);
      }

  
      const data = JSON.parse(responseBody);

    
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

   
      if (onLoggedIn) {
        onLoggedIn();
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Login</h1>
        {error && (
          <div className="text-sm text-center text-red-600 bg-red-100 p-2 rounded-md">
            {error}
          </div>
        )}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
            required
          />
        </div>
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-md disabled:bg-indigo-400"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;