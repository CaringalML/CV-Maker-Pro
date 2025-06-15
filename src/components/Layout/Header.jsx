import React, { useState } from 'react';
import { Plus, Download, User, LogOut, Save, Cloud, CloudOff } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-hot-toast';
import './Header.css';

const Header = ({ onCreateVersion, onExportPDF, isExporting, onForceSave, saving, isOnline = true }) => {
  const { user, signOut } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSignOut = async () => {
    try {
      const result = await signOut();
      if (result.success) {
        toast.success('Signed out successfully');
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  // Close menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.user-menu-container')) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="header">
      <div className="header-container">
        <div className="header-content">
          {/* Logo and Title */}
          <div className="header-brand">
            <div className="header-logo">
              <div className="logo-icon">
                <Plus className="logo-icon-svg" />
              </div>
              <h1 className="header-title">CV Maker Pro</h1>
            </div>
            
            {/* Connection Status */}
            <div className={`connection-status ${isOnline ? 'online' : 'offline'}`}>
              {isOnline ? (
                <>
                  <Cloud className="connection-icon" />
                  <span>Synced</span>
                </>
              ) : (
                <>
                  <CloudOff className="connection-icon" />
                  <span>Offline</span>
                </>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="header-actions">
            {/* Save Button */}
            <button
              onClick={onForceSave}
              disabled={saving}
              className="btn btn-save"
              title="Force save current CV"
            >
              <Save className="btn-icon" />
              {saving ? 'Saving...' : 'Save'}
            </button>

            {/* New Version Button */}
            <button
              onClick={onCreateVersion}
              className="btn btn-secondary"
              title="Create new CV version"
            >
              <Plus className="btn-icon" />
              New CV
            </button>

            {/* Export PDF Button */}
            <button
              onClick={onExportPDF}
              disabled={isExporting}
              className="btn btn-primary"
              title="Export current CV as PDF"
            >
              <Download className="btn-icon" />
              {isExporting ? 'Exporting...' : 'Export PDF'}
            </button>

            {/* User Menu */}
            <div className="user-menu-container">
              <button
                onClick={toggleUserMenu}
                className="user-avatar-btn"
                title={`Signed in as ${user?.displayName || user?.email}`}
              >
                {user?.photoURL ? (
                  <img 
                    src={user.photoURL} 
                    alt="Profile" 
                    className="user-avatar-img"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="user-avatar-placeholder">
                    <User className="user-avatar-icon" />
                  </div>
                )}
              </button>

              {showUserMenu && (
                <div className="user-menu">
                  <div className="user-menu-header">
                    <div className="user-info">
                      <div className="user-name">{user?.displayName || 'User'}</div>
                      <div className="user-email">{user?.email}</div>
                    </div>
                  </div>
                  
                  <div className="user-menu-divider"></div>
                  
                  <div className="user-menu-items">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        // Could add profile editing functionality here
                        toast.info('Profile settings coming soon!');
                      }}
                      className="user-menu-item"
                    >
                      <User className="user-menu-icon" />
                      Profile Settings
                    </button>
                    
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        handleSignOut();
                      }}
                      className="user-menu-item user-menu-item-danger"
                    >
                      <LogOut className="user-menu-icon" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;