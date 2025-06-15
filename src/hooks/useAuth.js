import { useState, useEffect } from 'react';
import authService from '../services/authService';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    
    // Wait for auth initialization
    const initializeAuth = async () => {
      try {
        const currentUser = await authService.waitForAuthInitialization();
        setUser(currentUser);
        setError(null);
      } catch (err) {
        console.error('Auth initialization error:', err);
        setError('Failed to initialize authentication');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Set up auth state listener
    const unsubscribe = authService.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
      setError(null);
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await authService.signInWithGoogle();
      
      if (!result.success) {
        setError(result.message);
        return result;
      }
      
      // User state will be updated via the auth state listener
      return result;
    } catch (err) {
      const errorMessage = 'An unexpected error occurred during sign-in';
      setError(errorMessage);
      console.error('Sign-in error:', err);
      return {
        success: false,
        message: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await authService.signOut();
      
      if (!result.success) {
        setError(result.message);
        return result;
      }
      
      // User state will be updated via the auth state listener
      return result;
    } catch (err) {
      const errorMessage = 'An unexpected error occurred during sign-out';
      setError(errorMessage);
      console.error('Sign-out error:', err);
      return {
        success: false,
        message: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    signInWithGoogle,
    signOut,
    clearError,
    // Utility methods
    getUserProfile: authService.getUserProfile.bind(authService),
    updateUserProfile: authService.updateUserProfile.bind(authService)
  };
};