import React, { useRef, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Header from '../components/Layout/Header';
import VersionManager from '../components/VersionManager/VersionManager';
import PersonalInfoForm from '../components/FormSections/PersonalInfoForm';
import ExperienceForm from '../components/FormSections/ExperienceForm';
import EducationForm from '../components/FormSections/EducationForm';
import CertificationsForm from '../components/FormSections/CertificationsForm';
import SkillsForm from '../components/FormSections/SkillsForm';
import LanguagesForm from '../components/FormSections/LanguagesForm';
import CVPreview from '../components/CVPreview/CVPreview';
import { useCVData } from '../hooks/useCVData';
import { exportToPDF } from '../utils/pdfExport';
import { Loader2, Wifi, WifiOff } from 'lucide-react';
import '../components/FormSections/FormSections.css';
import './CVMaker.css';

const CVMaker = ({ isOnline = true }) => {
  const cvRef = useRef();
  const [isExporting, setIsExporting] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  const {
    versions,
    currentVersionId,
    currentVersion,
    currentData,
    loading,
    saving,
    error,
    setCurrentVersionId,
    updateCurrentVersion,
    createNewVersion,
    duplicateVersion,
    deleteVersion,
    renameVersion,
    forceSave,
    clearError,
    isAuthenticated
  } = useCVData();

  // Show connection status changes
  useEffect(() => {
    if (isOnline) {
      toast.success('Connection restored', { icon: '🌐' });
    } else {
      toast.error('You are offline', { icon: '📡' });
    }
  }, [isOnline]);

  // Update last saved timestamp
  useEffect(() => {
    if (currentVersion?.updatedAt) {
      setLastSaved(new Date(currentVersion.updatedAt));
    }
  }, [currentVersion?.updatedAt]);

  const handleExportPDF = async () => {
    if (!currentData.personalInfo?.fullName) {
      toast.error('Please add your name before exporting');
      return;
    }

    setIsExporting(true);
    try {
      const filename = `${currentData.personalInfo.fullName}_${currentVersion?.name || 'CV'}.pdf`;
      await exportToPDF(cvRef, filename);
      toast.success('CV exported successfully!');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleForceSave = async () => {
    try {
      await forceSave();
      setLastSaved(new Date());
    } catch (error) {
      // Error is already handled in the hook
    }
  };

  // Show error message if there's a persistent error
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError();
      }, 10000); // Clear error after 10 seconds

      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  if (!isAuthenticated) {
    return null; // AuthGuard will handle this
  }

  if (loading) {
    return (
      <div className="cv-maker-loading">
        <div className="loading-content">
          <Loader2 className="loading-spinner spinning" />
          <h2>Loading your CVs...</h2>
          <p>Please wait while we fetch your data from the cloud</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cv-maker">
      <Header
        onCreateVersion={createNewVersion}
        onExportPDF={handleExportPDF}
        isExporting={isExporting}
        onForceSave={handleForceSave}
        saving={saving}
        isOnline={isOnline}
      />

      {/* Error Banner */}
      {error && (
        <div className="error-banner">
          <div className="error-content">
            <span>⚠️ {error}</span>
            <button 
              onClick={clearError}
              className="error-dismiss"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <div className="cv-maker-container">
        <div className="cv-maker-content">
          {/* Left Sidebar */}
          <div className="cv-maker-sidebar">
            <VersionManager
              versions={versions}
              currentVersionId={currentVersionId}
              onVersionSelect={setCurrentVersionId}
              onVersionRename={renameVersion}
              onVersionDuplicate={duplicateVersion}
              onVersionDelete={deleteVersion}
            />

            {/* Form Panel */}
            <div className="cv-maker-form">
              <div className="cv-maker-form-header">
                <h2 className="cv-maker-form-title">Edit CV</h2>
                {lastSaved && (
                  <div className="last-saved">
                    <span>Last saved: {lastSaved.toLocaleTimeString()}</span>
                    {!isOnline && <WifiOff className="offline-icon" />}
                    {isOnline && <Wifi className="online-icon" />}
                  </div>
                )}
              </div>
              
              <div className="form-sections">
                <PersonalInfoForm
                  data={currentData.personalInfo}
                  onChange={updateCurrentVersion}
                />

                <ExperienceForm
                  data={currentData.experience}
                  onChange={updateCurrentVersion}
                />

                <EducationForm
                  data={currentData.education}
                  onChange={updateCurrentVersion}
                />

                <CertificationsForm
                  data={currentData.certifications}
                  onChange={updateCurrentVersion}
                />

                <SkillsForm
                  data={currentData.skills}
                  onChange={updateCurrentVersion}
                />

                <LanguagesForm
                  data={currentData.languages}
                  onChange={updateCurrentVersion}
                />
              </div>
            </div>
          </div>

          {/* Right Preview */}
          <div className="cv-maker-preview">
            <div className="cv-maker-preview-header">
              <h2 className="cv-maker-preview-title">
                Preview - {currentVersion?.name || 'Untitled CV'}
              </h2>
              <div className="preview-actions">
                {saving && (
                  <div className="saving-indicator">
                    <Loader2 className="saving-spinner spinning" />
                    <span>Saving...</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* CV Preview with ref for PDF export */}
            <div className="cv-preview-container">
              <CVPreview
                ref={cvRef}
                data={currentData}
                versionName={currentVersion?.name}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Offline indicator */}
      {!isOnline && (
        <div className="offline-banner">
          <WifiOff className="offline-banner-icon" />
          <span>You're offline. Changes will sync when connection is restored.</span>
        </div>
      )}
    </div>
  );
};

export default CVMaker;