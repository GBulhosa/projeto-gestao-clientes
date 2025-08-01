import React from 'react';
import { useAuth } from '../../context/useAuth';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute: React.FC = () => {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" />;
    }

    return <Outlet />;
};

export default ProtectedRoute;