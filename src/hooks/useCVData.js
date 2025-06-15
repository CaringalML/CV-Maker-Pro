import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import cvService from '../services/cvService';
import { useAuth } from './useAuth';

export const useCVData = () => {
  const { user, isAuthenticated } = useAuth();
  const [versions, setVersions] = useState([]);
  const [currentVersionId, setCurrentVersionId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Load CVs when user authenticates
  useEffect(() => {
    if (isAuthenticated && user) {
      loadUserCVs();
    } else {
      setVersions([]);
      setCurrentVersionId(null);
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  // Auto-save setup
  useEffect(() => {
    if (!currentVersionId || !isAuthenticated) return;

    const currentCV = versions.find(v => v.id === currentVersionId);
    if (!currentCV) return;

    // Set up auto-save every 30 seconds
    const cleanup = cvService.setupAutoSave(currentCV, 30000);
    
    return cleanup;
  }, [currentVersionId, versions, isAuthenticated]);

  const loadUserCVs = async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const userCVs = await cvService.loadUserCVs();
      setVersions(userCVs);
      
      // Set current version to the first CV or most recently updated
      if (userCVs.length > 0) {
        const mostRecent = userCVs.reduce((latest, cv) => 
          new Date(cv.updatedAt) > new Date(latest.updatedAt) ? cv : latest
        );
        setCurrentVersionId(mostRecent.id);
      }
      
      toast.success(`Loaded ${userCVs.length} CV${userCVs.length !== 1 ? 's' : ''}`);
    } catch (err) {
      console.error('Error loading CVs:', err);
      setError(err.message);
      toast.error('Failed to load your CVs');
    } finally {
      setLoading(false);
    }
  };

  const saveCV = async (cvData, showToast = true) => {
    if (!isAuthenticated) {
      toast.error('Please sign in to save your CV');
      return;
    }
    
    setSaving(true);
    
    try {
      await cvService.saveCV(cvData);
      
      // Update local state
      setVersions(prev => 
        prev.map(v => v.id === cvData.id ? cvData : v)
      );
      
      if (showToast) {
        toast.success('CV saved successfully');
      }
    } catch (err) {
      console.error('Error saving CV:', err);
      setError(err.message);
      toast.error('Failed to save CV');
    } finally {
      setSaving(false);
    }
  };

const createNewVersion = async () => {
  if (!isAuthenticated) {
    toast.error('Please sign in to create a new CV');
    return;
  }

  try {
    // Get custom name from user
    const customName = prompt('Enter CV name (e.g., "Software Developer CV", "Marketing Resume"):', 'My CV');
    
    if (!customName || customName.trim() === '') {
      toast.error('CV name is required');
      return;
    }

    const newCV = cvService.createDefaultCV();
    // Custom naming: [Custom Name]_v[number]
    newCV.name = `${customName.trim()}_v1`;
    
    await cvService.saveCV(newCV);
    
    setVersions(prev => [newCV, ...prev]);
    setCurrentVersionId(newCV.id);
    
    toast.success('New CV created successfully');
    return newCV;
  } catch (err) {
    console.error('Error creating new CV:', err);
    setError(err.message);
    toast.error('Failed to create new CV');
  }
};

const duplicateVersion = async (versionId) => {
  if (!isAuthenticated) {
    toast.error('Please sign in to duplicate CV');
    return;
  }

  try {
    const originalCV = versions.find(v => v.id === versionId);
    if (!originalCV) {
      throw new Error('Original CV not found');
    }

    // Extract base name and increment version
    const originalName = originalCV.name;
    let baseName = originalName;
    let newVersion = 1;

    // Check if the name has version format: "Name_v1"
    const versionMatch = originalName.match(/^(.+)_v(\d+)$/);
    if (versionMatch) {
      baseName = versionMatch[1]; // Extract base name
      // Find highest version number for this base name
      const sameBaseVersions = versions.filter(v => v.name.startsWith(baseName + '_v'));
      const versionNumbers = sameBaseVersions.map(v => {
        const match = v.name.match(/_v(\d+)$/);
        return match ? parseInt(match[1]) : 0;
      });
      newVersion = Math.max(...versionNumbers, 0) + 1;
    } else {
      // If no version format, ask user for new name
      const customName = prompt('Enter name for duplicated CV:', originalName + ' Copy');
      if (!customName || customName.trim() === '') {
        toast.error('CV name is required');
        return;
      }
      baseName = customName.trim();
    }

    const newName = `${baseName}_v${newVersion}`;
    const duplicatedCV = await cvService.duplicateCV(versionId, newName);
    
    setVersions(prev => [duplicatedCV, ...prev]);
    setCurrentVersionId(duplicatedCV.id);
    
    toast.success('CV duplicated successfully');
    return duplicatedCV;
  } catch (err) {
    console.error('Error duplicating CV:', err);
    setError(err.message);
    toast.error('Failed to duplicate CV');
  }
};

  const deleteVersion = async (versionId) => {
    if (!isAuthenticated) {
      toast.error('Please sign in to delete CV');
      return;
    }

    if (versions.length === 1) {
      toast.error('Cannot delete the last CV');
      return;
    }

    try {
      await cvService.deleteCV(versionId);
      
      const updatedVersions = versions.filter(v => v.id !== versionId);
      setVersions(updatedVersions);
      
      // If we deleted the current version, switch to another
      if (currentVersionId === versionId && updatedVersions.length > 0) {
        setCurrentVersionId(updatedVersions[0].id);
      }
      
      toast.success('CV deleted successfully');
    } catch (err) {
      console.error('Error deleting CV:', err);
      setError(err.message);
      toast.error('Failed to delete CV');
    }
  };

  const renameVersion = async (versionId, newName) => {
    if (!isAuthenticated) {
      toast.error('Please sign in to rename CV');
      return;
    }

    try {
      const cvToUpdate = versions.find(v => v.id === versionId);
      if (!cvToUpdate) {
        throw new Error('CV not found');
      }

      const updatedCV = {
        ...cvToUpdate,
        name: newName,
        updatedAt: new Date().toISOString()
      };

      await cvService.saveCV(updatedCV);
      
      setVersions(prev => 
        prev.map(v => v.id === versionId ? updatedCV : v)
      );
      
      toast.success('CV renamed successfully');
    } catch (err) {
      console.error('Error renaming CV:', err);
      setError(err.message);
      toast.error('Failed to rename CV');
    }
  };

  const updateCurrentVersion = async (newData, autoSave = true) => {
    if (!currentVersionId || !isAuthenticated) return;

    const currentCV = versions.find(v => v.id === currentVersionId);
    if (!currentCV) return;

    const updatedCV = {
      ...currentCV,
      data: { ...currentCV.data, ...newData },
      updatedAt: new Date().toISOString()
    };

    // Update local state immediately for better UX
    setVersions(prev => 
      prev.map(v => v.id === currentVersionId ? updatedCV : v)
    );

    // Auto-save to Firebase (debounced)
    if (autoSave) {
      // Clear existing timeout
      if (updateCurrentVersion.timeoutId) {
        clearTimeout(updateCurrentVersion.timeoutId);
      }

      // Set new timeout for debounced save
      updateCurrentVersion.timeoutId = setTimeout(async () => {
        try {
          await cvService.saveCV(updatedCV);
        } catch (err) {
          console.error('Auto-save failed:', err);
          // Don't show toast for auto-save failures to avoid spam
        }
      }, 2000); // Save after 2 seconds of inactivity
    }
  };

  const forceSave = async () => {
    if (!currentVersionId || !isAuthenticated) return;

    const currentCV = versions.find(v => v.id === currentVersionId);
    if (!currentCV) return;

    await saveCV(currentCV, true);
  };

  const getCurrentVersion = () => {
    return versions.find(v => v.id === currentVersionId) || null;
  };

  const getCurrentData = () => {
    const currentVersion = getCurrentVersion();
    return currentVersion?.data || {};
  };

  const clearError = () => {
    setError(null);
  };

  // Real-time sync (optional - can be enabled for collaborative features)
  const enableRealTimeSync = () => {
    if (!isAuthenticated) return;

    const unsubscribe = cvService.subscribeToCVs((updatedCVs) => {
      setVersions(updatedCVs);
      
      // If current version doesn't exist anymore, switch to first available
      if (currentVersionId && !updatedCVs.find(v => v.id === currentVersionId)) {
        if (updatedCVs.length > 0) {
          setCurrentVersionId(updatedCVs[0].id);
        }
      }
    });

    return unsubscribe;
  };

  return {
    // State
    versions,
    currentVersionId,
    loading,
    saving,
    error,
    
    // Computed values
    currentVersion: getCurrentVersion(),
    currentData: getCurrentData(),
    
    // Actions
    setCurrentVersionId,
    updateCurrentVersion,
    createNewVersion,
    duplicateVersion,
    deleteVersion,
    renameVersion,
    saveCV,
    forceSave,
    loadUserCVs,
    clearError,
    enableRealTimeSync,
    
    // Utilities
    isAuthenticated
  };
};