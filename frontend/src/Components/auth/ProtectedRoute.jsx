// frontend/src/Components/auth/ProtectedRoute.jsx
// frontend/src/Components/auth/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    // Check for the authentication token in localStorage
    const token = localStorage.getItem('token');

    if (!token) {
        // If no token is found, redirect the user to the login page
        return <Navigate to="/login" />;
    }

    // If a token is found, render the child component (the protected page)
    return children;
};

export default ProtectedRoute;