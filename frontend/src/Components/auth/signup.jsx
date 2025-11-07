import React, { useState } from 'react';

const Signup = ({ onSignedUp }) => {
  // Renamed 'username' to 'name' to match the backend schema
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Added for better UX

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Reset error message on new submission

    // 1. Frontend validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true); // Disable button and show loading state

    try {
      // 2. Prepare the data for the API
      const userData = {
        name,
        email,
        password,
      };

      // 3. Make the API call to your backend
      // Make sure the URL is correct for your setup.
      // You might need a proxy in package.json or use the full URL.
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      // 4. Handle the response
      const data = await response.json();

      if (!response.ok) {
        // If the server returns an error (e.g., email already exists)
        // Use the error message from the backend
        throw new Error(data.message || 'Something went wrong');
      }

      // If registration is successful
      console.log('Signup successful:', data);

      // Call the onSignedUp prop if it exists (e.g., to redirect or update state)
      if (onSignedUp) {
        onSignedUp();
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
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Sign up</h1>

        {/* Display backend errors here */}
        {error && <p className="text-sm text-center text-red-600 bg-red-100 p-2 rounded-md">{error}</p>}

        <div className="space-y-1">
          {/* Changed label and state to 'name' */}
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-md bg-white border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md bg-white border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md bg-white border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full rounded-md bg-white border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-md disabled:bg-indigo-400"
          disabled={loading} 
        >
          {loading ? 'Signing up...' : 'Sign up'}
        </button>

        <p className="text-sm text-gray-600 text-center">
          Already have an account?{' '}
          <a href="/login" className="text-indigo-600 hover:text-indigo-700 font-semibold">Log in</a>
        </p>
      </form>
    </div>
  );
};

export default Signup;