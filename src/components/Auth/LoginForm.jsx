import React, { useState } from 'react';
import { LogIn, Chrome, Shield, Users, Zap } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import './Auth.css';

const LoginForm = () => {
  const { signInWithGoogle, loading, error, clearError } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleGoogleSignIn = async () => {
    if (loading || isSigningIn) return;
    
    setIsSigningIn(true);
    clearError();
    
    try {
      const result = await signInWithGoogle();
      if (!result.success) {
        console.error('Sign-in failed:', result.message);
      }
    } catch (err) {
      console.error('Unexpected sign-in error:', err);
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="login-background-pattern"></div>
      </div>
      
      <div className="login-content">
        {/* Left Side - Branding */}
        <div className="login-branding">
          <div className="login-logo">
            <div className="logo-icon">
              <LogIn className="logo-icon-svg" />
            </div>
            <h1 className="logo-text">CV Maker Pro</h1>
          </div>
          
          <div className="login-tagline">
            <h2>Create Professional CVs with Confidence</h2>
            <p>Build stunning resumes with our modern, cloud-based platform. Your data is automatically saved and synced across all your devices.</p>
          </div>

          <div className="login-features">
            <div className="feature-item">
              <div className="feature-icon">
                <Shield className="feature-icon-svg" />
              </div>
              <div className="feature-text">
                <h3>Secure & Private</h3>
                <p>Your data is encrypted and stored securely in the cloud</p>
              </div>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon">
                <Users className="feature-icon-svg" />
              </div>
              <div className="feature-text">
                <h3>Multiple Versions</h3>
                <p>Create and manage different CV versions for different roles</p>
              </div>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon">
                <Zap className="feature-icon-svg" />
              </div>
              <div className="feature-text">
                <h3>Export to PDF</h3>
                <p>Generate professional PDFs ready for job applications</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="login-form-container">
          <div className="login-form">
            <div className="login-form-header">
              <h2>Welcome Back</h2>
              <p>Sign in to access your CV collection and continue building your professional profile.</p>
            </div>

            {error && (
              <div className="login-error">
                <p>{error}</p>
                <button 
                  onClick={clearError}
                  className="error-dismiss"
                  aria-label="Dismiss error"
                >
                  ×
                </button>
              </div>
            )}

            <div className="login-form-content">
              <button
                onClick={handleGoogleSignIn}
                disabled={loading || isSigningIn}
                className="google-signin-btn"
              >
                <Chrome className="google-icon" />
                <span>
                  {isSigningIn ? 'Signing in...' : 'Continue with Google'}
                </span>
              </button>

              <div className="login-divider">
                <span>Quick & Secure Authentication</span>
              </div>

              <div className="login-benefits">
                <div className="benefit-item">
                  <div className="benefit-check">✓</div>
                  <span>No password required</span>
                </div>
                <div className="benefit-item">
                  <div className="benefit-check">✓</div>
                  <span>Instant access to your CVs</span>
                </div>
                <div className="benefit-item">
                  <div className="benefit-check">✓</div>
                  <span>Automatic cloud backup</span>
                </div>
              </div>
            </div>

            <div className="login-form-footer">
              <p className="privacy-note">
                By signing in, you agree to our terms of service and privacy policy. 
                We only use your Google account for authentication and will never access your personal Google data.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;