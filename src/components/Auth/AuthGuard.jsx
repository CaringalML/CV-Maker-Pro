import React from 'react';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import LoginForm from './LoginForm';

const AuthGuard = ({ children }) => {
  const { user, loading, isAuthenticated } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="auth-loading">
        <div className="auth-loading-content">
          <div className="loading-spinner">
            <Loader2 className="loading-icon" />
          </div>
          <h2>Loading CV Maker...</h2>
          <p>Please wait while we initialize your account</p>
        </div>
      </div>
    );
  }

  // Show login form if not authenticated
  if (!isAuthenticated || !user) {
    return <LoginForm />;
  }

  // Render children if authenticated
  return children;
};

export default AuthGuard;