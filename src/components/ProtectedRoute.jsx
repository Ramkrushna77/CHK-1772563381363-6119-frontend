import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const userJson = localStorage.getItem('user');
    const user = userJson ? JSON.parse(userJson) : null;

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Redirect to their specific dashboard if they try to access something unauthorized
        if (user.role === 'doctor') return <Navigate to="/doctor-dashboard" replace />;
        if (user.role === 'admin') return <Navigate to="/admin-dashboard" replace />;
        return <Navigate to="/patient-dashboard" replace />;
    }

    return children;
};

export default ProtectedRoute;
