import React, { useState } from 'react';
import { Edit3, Copy, Trash2, FileText } from 'lucide-react';
import './VersionManager.css';

const VersionManager = ({
  versions,
  currentVersionId,
  onVersionSelect,
  onVersionRename,
  onVersionDuplicate,
  onVersionDelete
}) => {
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');

  const startEditing = (version) => {
    setEditingId(version.id);
    setEditingName(version.name);
  };

  const saveEditing = () => {
    if (editingName.trim() && editingId) {
      onVersionRename(editingId, editingName.trim());
    }
    setEditingId(null);
    setEditingName('');
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingName('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      saveEditing();
    } else if (e.key === 'Escape') {
      cancelEditing();
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return 'Invalid date';
    }
  };

  return (
    <div className="version-manager">
      <div className="version-manager-header">
        <h2 className="version-manager-title">
          <FileText className="version-manager-icon" />
          Your CVs
        </h2>
        <div className="cv-count">
          {versions.length} CV{versions.length !== 1 ? 's' : ''}
        </div>
      </div>

      <div className="version-list">
        {versions.length === 0 ? (
          <div className="empty-state">
            <FileText className="empty-icon" />
            <p>No CVs found</p>
            <p className="empty-subtitle">Create your first CV to get started</p>
          </div>
        ) : (
          versions.map(version => (
            <div
              key={version.id}
              className={`version-item ${
                currentVersionId === version.id ? 'version-item-active' : ''
              }`}
              onClick={() => editingId !== version.id && onVersionSelect(version.id)}
            >
              <div className="version-info">
                {editingId === version.id ? (
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onBlur={saveEditing}
                    onKeyDown={handleKeyPress}
                    className="version-name-input"
                    autoFocus
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <h3 className="version-name">{version.name}</h3>
                )}
                
                <div className="version-meta">
                  <span className="version-date">
                    Updated {formatDate(version.updatedAt)}
                  </span>
                  {version.isDefault && (
                    <span className="version-badge">Default</span>
                  )}
                </div>
              </div>

              <div className="version-actions">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    startEditing(version);
                  }}
                  className="version-action-btn"
                  title="Rename CV"
                >
                  <Edit3 className="version-action-icon" />
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onVersionDuplicate(version.id);
                  }}
                  className="version-action-btn"
                  title="Duplicate CV"
                >
                  <Copy className="version-action-icon" />
                </button>
                
                {versions.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm(`Are you sure you want to delete "${version.name}"? This action cannot be undone.`)) {
                        onVersionDelete(version.id);
                      }
                    }}
                    className="version-action-btn version-action-delete"
                    title="Delete CV"
                  >
                    <Trash2 className="version-action-icon" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {versions.length > 0 && (
        <div className="version-manager-footer">
          <div className="version-stats">
            <span className="stat-item">
              Total: {versions.length}
            </span>
            <span className="stat-divider">•</span>
            <span className="stat-item">
              Active: {currentVersionId ? 1 : 0}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default VersionManager;