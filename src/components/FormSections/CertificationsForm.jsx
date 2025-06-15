import React, { useState } from 'react';
import { Award, Plus, Trash2, ChevronDown, Link } from 'lucide-react';
import ConfirmationDialog from '../Common/ConfirmationDialog';

const CertificationsForm = ({ data, onChange }) => {
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    certificationId: null,
    certificationName: ''
  });

  const addCertification = () => {
    const newCert = {
      id: Date.now(),
      name: '',
      issuingOrganization: '',
      location: '',
      issueDate: '',
      expiryDate: '',
      neverExpires: false,
      credentialId: '',
      verificationLink: '',
      description: ''
    };
    onChange({
      certifications: [...(data || []), newCert]
    });
  };

  const updateCertification = (id, field, value) => {
    const updated = (data || []).map(cert =>
      cert.id === id ? { ...cert, [field]: value } : cert
    );
    onChange({ certifications: updated });
  };

  const removeCertification = (id) => {
    const updated = (data || []).filter(cert => cert.id !== id);
    onChange({ certifications: updated });
  };

  const handleDeleteClick = (cert) => {
    setConfirmDialog({
      isOpen: true,
      certificationId: cert.id,
      certificationName: cert.name || 'this certification'
    });
  };

  const handleConfirmDelete = () => {
    if (confirmDialog.certificationId) {
      removeCertification(confirmDialog.certificationId);
    }
  };

  const handleCloseDialog = () => {
    setConfirmDialog({
      isOpen: false,
      certificationId: null,
      certificationName: ''
    });
  };

  const handleNeverExpiresChange = (id, isChecked) => {
    const updated = (data || []).map(cert =>
      cert.id === id 
        ? { 
            ...cert, 
            neverExpires: isChecked, 
            expiryDate: isChecked ? '' : cert.expiryDate 
          }
        : cert
    );
    onChange({ certifications: updated });
  };

  const formatDuration = (issueDate, expiryDate, neverExpires) => {
    if (!issueDate) return '';
    
    if (neverExpires) {
      return `${issueDate} - No Expiration`;
    }
    
    if (expiryDate) {
      return `${issueDate} - ${expiryDate}`;
    }
    
    return `Issued: ${issueDate}`;
  };

  // Generate months and years
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear + 5 - i); // Next 5 years + past 25 years

  const DateDropdowns = ({ value, onChange, disabled = false, label }) => {
    // Parse existing value
    const parts = (value || '').split(' ');
    const selectedMonth = parts[0] || '';
    const selectedYear = parts[1] || '';

    const handleMonthChange = (month) => {
      const newValue = [month, selectedYear].filter(Boolean).join(' ');
      onChange(newValue);
    };

    const handleYearChange = (year) => {
      const newValue = [selectedMonth, year].filter(Boolean).join(' ');
      onChange(newValue);
    };

    const monthDisplayText = selectedMonth || 'Month';
    const yearDisplayText = selectedYear || 'Year';

    return (
      <div className="simple-date-container">
        <label className="simple-date-label">{label}</label>
        <div className={`simple-date-dropdowns ${disabled ? 'disabled' : ''}`}>
          <div className="simple-dropdown">
            <select
              value={selectedMonth}
              onChange={(e) => handleMonthChange(e.target.value)}
              disabled={disabled}
              className={`simple-dropdown-select ${selectedMonth ? 'has-value' : ''}`}
            >
              <option value="">{monthDisplayText}</option>
              {months.map(month => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
            <div className="simple-dropdown-icon">
              <ChevronDown size={16} />
            </div>
          </div>

          <div className="simple-dropdown">
            <select
              value={selectedYear}
              onChange={(e) => handleYearChange(e.target.value)}
              disabled={disabled}
              className={`simple-dropdown-select ${selectedYear ? 'has-value' : ''}`}
            >
              <option value="">{yearDisplayText}</option>
              {years.map(year => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <div className="simple-dropdown-icon">
              <ChevronDown size={16} />
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Common certification providers for autocomplete suggestions
  const commonProviders = [
    'Amazon Web Services (AWS)',
    'Microsoft',
    'Google Cloud',
    'Cisco',
    'CompTIA',
    'Oracle',
    'Salesforce',
    'Adobe',
    'PMI (Project Management Institute)',
    'ISACA',
    'ISC2',
    'Red Hat',
    'VMware',
    'IBM',
    'Scrum Alliance',
    'Scaled Agile',
    'ITIL',
    'PMP',
    'Six Sigma',
    'Coursera',
    'edX',
    'Udacity',
    'Pluralsight'
  ];

  return (
    <div className="form-section">
      <div className="form-section-header">
        <h3 className="form-section-title">
          <Award className="form-section-icon purple" />
          Professional Certifications & Industry Credentials
        </h3>
        <button onClick={addCertification} className="form-add-btn">
          <Plus className="form-add-icon" />
          Add Certification
        </button>
      </div>

      {(data || []).length === 0 ? (
        <div className="empty-state">
          <Award className="empty-icon" />
          <p>No certifications added yet</p>
          <p className="empty-subtitle">Add professional certifications, industry credentials, and licenses</p>
        </div>
      ) : (
        <div className="form-items">
          {(data || []).map(cert => (
            <div key={cert.id} className="form-item">
              <div className="form-item-content">
                <div className="form-fields">
                  {/* Certification Name */}
                  <div className="form-field-group">
                    <input
                      type="text"
                      placeholder="Certification Name *"
                      value={cert.name}
                      onChange={(e) => updateCertification(cert.id, 'name', e.target.value)}
                      className="form-input"
                      required
                    />
                  </div>

                  {/* Issuing Organization and Location */}
                  <div className="form-field-group">
                    <input
                      type="text"
                      placeholder="Issuing Organization *"
                      value={cert.issuingOrganization}
                      onChange={(e) => updateCertification(cert.id, 'issuingOrganization', e.target.value)}
                      className="form-input"
                      list={`providers-${cert.id}`}
                      required
                    />
                    <datalist id={`providers-${cert.id}`}>
                      {commonProviders.map(provider => (
                        <option key={provider} value={provider} />
                      ))}
                    </datalist>
                    
                    <input
                      type="text"
                      placeholder="Location (Optional)"
                      value={cert.location}
                      onChange={(e) => updateCertification(cert.id, 'location', e.target.value)}
                      className="form-input"
                    />
                  </div>

                  {/* Date Range */}
                  <div className="simple-date-range">
                    <DateDropdowns
                      value={cert.issueDate}
                      onChange={(value) => updateCertification(cert.id, 'issueDate', value)}
                      label="Issue Date"
                    />
                    <DateDropdowns
                      value={cert.expiryDate}
                      onChange={(value) => updateCertification(cert.id, 'expiryDate', value)}
                      label="Expiry Date"
                      disabled={cert.neverExpires}
                    />
                  </div>

                  {/* Never Expires Checkbox */}
                  <div className="form-checkbox-group">
                    <label className="form-checkbox-label">
                      <input
                        type="checkbox"
                        checked={cert.neverExpires || false}
                        onChange={(e) => handleNeverExpiresChange(cert.id, e.target.checked)}
                        className="form-checkbox"
                      />
                      <span className="checkbox-text">This certification never expires</span>
                    </label>
                  </div>

                  {/* Credential ID and Verification Link */}
                  <div className="form-field-group">
                    <input
                      type="text"
                      placeholder="Credential ID (Optional)"
                      value={cert.credentialId}
                      onChange={(e) => updateCertification(cert.id, 'credentialId', e.target.value)}
                      className="form-input"
                    />
                    <input
                      type="url"
                      placeholder="Verification Link (Optional)"
                      value={cert.verificationLink}
                      onChange={(e) => updateCertification(cert.id, 'verificationLink', e.target.value)}
                      className="form-input"
                    />
                  </div>

                  {/* Description */}
                  <textarea
                    placeholder="Description (What this certification validates, key competencies, etc.)"
                    value={cert.description}
                    onChange={(e) => updateCertification(cert.id, 'description', e.target.value)}
                    rows={3}
                    className="form-textarea"
                  />

                  {/* Verification Link Help */}
                  {cert.verificationLink && (
                    <div className="verification-link-help">
                      <Link className="help-icon" size={14} />
                      <span className="help-text">
                        Employers can click this link to verify your certification online
                      </span>
                    </div>
                  )}

                  {/* Preview Duration */}
                  {(cert.issueDate || cert.expiryDate) && (
                    <div className="duration-preview">
                      <span className="duration-label">Validity: </span>
                      <span className="duration-text">
                        {formatDuration(cert.issueDate, cert.expiryDate, cert.neverExpires)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Remove Button */}
              <button
                onClick={() => handleDeleteClick(cert)}
                className="form-remove-btn"
                title="Remove this certification"
              >
                <Trash2 className="form-remove-icon" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={confirmDialog.isOpen}
        onClose={handleCloseDialog}
        onConfirm={handleConfirmDelete}
        title="Delete Certification"
        message={`Are you sure you want to delete "${confirmDialog.certificationName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="delete"
      />
    </div>
  );
};

export default CertificationsForm;