import React, { useState } from 'react';
import { GraduationCap, Plus, Trash2, ChevronDown, BookOpen, Award } from 'lucide-react';
import ConfirmationDialog from '../Common/ConfirmationDialog';

const EducationForm = ({ data, onChange }) => {
  const [expandedItems, setExpandedItems] = useState({});
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    type: 'education', // 'education', 'project', 'certificate'
    itemId: null,
    parentId: null, // For projects and certificates
    itemName: '',
    title: '',
    message: ''
  });

  const addEducation = () => {
    const newEdu = {
      id: Date.now(),
      level: '',
      degree: '',
      institution: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      gpa: '',
      description: '',
      projects: [],
      certificates: []
    };
    onChange({
      education: [...(data || []), newEdu]
    });
  };

  const updateEducation = (id, field, value) => {
    const updated = (data || []).map(edu =>
      edu.id === id ? { ...edu, [field]: value } : edu
    );
    onChange({ education: updated });
  };

  const removeEducation = (id) => {
    const updated = (data || []).filter(edu => edu.id !== id);
    onChange({ education: updated });
  };

  const handleEducationDeleteClick = (edu) => {
    const educationName = edu.degree && edu.institution 
      ? `${edu.degree} at ${edu.institution}`
      : edu.degree || edu.institution || 'this education';
    
    setConfirmDialog({
      isOpen: true,
      type: 'education',
      itemId: edu.id,
      parentId: null,
      itemName: educationName,
      title: 'Delete Education',
      message: `Are you sure you want to delete "${educationName}"? This action cannot be undone and will also remove all associated projects and certificates.`
    });
  };

  const handleCurrentStudyChange = (id, isChecked) => {
    const updated = (data || []).map(edu =>
      edu.id === id 
        ? { 
            ...edu, 
            current: isChecked, 
            endDate: isChecked ? '' : edu.endDate 
          }
        : edu
    );
    onChange({ education: updated });
  };

  const toggleExpanded = (id) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Add project to education
  const addProject = (eduId) => {
    const updated = (data || []).map(edu =>
      edu.id === eduId 
        ? { 
            ...edu, 
            projects: [...(edu.projects || []), {
              id: Date.now(),
              name: '',
              description: '',
              technologies: '',
              link: ''
            }]
          }
        : edu
    );
    onChange({ education: updated });
  };

  const updateProject = (eduId, projectId, field, value) => {
    const updated = (data || []).map(edu =>
      edu.id === eduId 
        ? {
            ...edu,
            projects: (edu.projects || []).map(project =>
              project.id === projectId ? { ...project, [field]: value } : project
            )
          }
        : edu
    );
    onChange({ education: updated });
  };

  const removeProject = (eduId, projectId) => {
    const updated = (data || []).map(edu =>
      edu.id === eduId 
        ? {
            ...edu,
            projects: (edu.projects || []).filter(project => project.id !== projectId)
          }
        : edu
    );
    onChange({ education: updated });
  };

  const handleProjectDeleteClick = (eduId, project) => {
    const projectName = project.name || 'this project';
    
    setConfirmDialog({
      isOpen: true,
      type: 'project',
      itemId: project.id,
      parentId: eduId,
      itemName: projectName,
      title: 'Delete Project',
      message: `Are you sure you want to delete "${projectName}"? This action cannot be undone.`
    });
  };

  // Add certificate to education
  const addCertificate = (eduId) => {
    const updated = (data || []).map(edu =>
      edu.id === eduId 
        ? { 
            ...edu, 
            certificates: [...(edu.certificates || []), {
              id: Date.now(),
              name: '',
              issuer: '',
              date: '',
              credentialId: '',
              link: ''
            }]
          }
        : edu
    );
    onChange({ education: updated });
  };

  const updateCertificate = (eduId, certId, field, value) => {
    const updated = (data || []).map(edu =>
      edu.id === eduId 
        ? {
            ...edu,
            certificates: (edu.certificates || []).map(cert =>
              cert.id === certId ? { ...cert, [field]: value } : cert
            )
          }
        : edu
    );
    onChange({ education: updated });
  };

  const removeCertificate = (eduId, certId) => {
    const updated = (data || []).map(edu =>
      edu.id === eduId 
        ? {
            ...edu,
            certificates: (edu.certificates || []).filter(cert => cert.id !== certId)
          }
        : edu
    );
    onChange({ education: updated });
  };

  const handleCertificateDeleteClick = (eduId, certificate) => {
    const certificateName = certificate.name || 'this certificate';
    
    setConfirmDialog({
      isOpen: true,
      type: 'certificate',
      itemId: certificate.id,
      parentId: eduId,
      itemName: certificateName,
      title: 'Delete Certificate',
      message: `Are you sure you want to delete "${certificateName}"? This action cannot be undone.`
    });
  };

  const handleConfirmDelete = () => {
    const { type, itemId, parentId } = confirmDialog;

    switch (type) {
      case 'education':
        removeEducation(itemId);
        break;
      case 'project':
        removeProject(parentId, itemId);
        break;
      case 'certificate':
        removeCertificate(parentId, itemId);
        break;
      default:
        console.error('Unknown delete type:', type);
    }
  };

  const handleCloseDialog = () => {
    setConfirmDialog({
      isOpen: false,
      type: 'education',
      itemId: null,
      parentId: null,
      itemName: '',
      title: '',
      message: ''
    });
  };

  const formatDuration = (startDate, endDate, current) => {
    if (!startDate) return '';
    
    const start = startDate;
    const end = current ? 'Present' : (endDate || 'Present');
    
    return `${start} - ${end}`;
  };

  // Generate months and years
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  const educationLevels = [
    { value: 'Doctor', label: 'Doctorate (PhD, MD, JD, etc.)' },
    { value: 'Masters', label: 'Masters Degree' },
    { value: 'Postgraduate', label: 'Postgraduate Diploma/Certificate' },
    { value: 'Tertiary', label: 'Bachelor\'s Degree/Tertiary' },
    { value: 'Secondary', label: 'Secondary/High School' }
  ];

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

  return (
    <div className="form-section">
      <div className="form-section-header">
        <h3 className="form-section-title">
          <GraduationCap className="form-section-icon green" />
          Education
        </h3>
        <button onClick={addEducation} className="form-add-btn">
          <Plus className="form-add-icon" />
          Add Education
        </button>
      </div>

      {(data || []).length === 0 ? (
        <div className="empty-state">
          <GraduationCap className="empty-icon" />
          <p>No education added yet</p>
          <p className="empty-subtitle">Click "Add Education" to start building your academic background</p>
        </div>
      ) : (
        <div className="form-items">
          {(data || []).map(edu => (
            <div key={edu.id} className="form-item">
              <div className="form-item-content">
                <div className="form-fields">
                  {/* Education Level */}
                  <div className="form-field-group">
                    <select
                      value={edu.level}
                      onChange={(e) => updateEducation(edu.id, 'level', e.target.value)}
                      className="form-select"
                    >
                      <option value="">Select Education Level *</option>
                      {educationLevels.map(level => (
                        <option key={level.value} value={level.value}>
                          {level.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Degree and Institution */}
                  <div className="form-field-group">
                    <input
                      type="text"
                      placeholder="Degree/Qualification Title *"
                      value={edu.degree}
                      onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                      className="form-input"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Institution/School Name *"
                      value={edu.institution}
                      onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                      className="form-input"
                      required
                    />
                  </div>

                  {/* Location and GPA */}
                  <div className="form-field-group">
                    <input
                      type="text"
                      placeholder="Location (City, Country)"
                      value={edu.location}
                      onChange={(e) => updateEducation(edu.id, 'location', e.target.value)}
                      className="form-input"
                    />
                    <input
                      type="text"
                      placeholder="GPA/Grade (Optional)"
                      value={edu.gpa}
                      onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                      className="form-input"
                    />
                  </div>

                  {/* Date Range */}
                  <div className="simple-date-range">
                    <DateDropdowns
                      value={edu.startDate}
                      onChange={(value) => updateEducation(edu.id, 'startDate', value)}
                      label="Start Date"
                    />
                    <DateDropdowns
                      value={edu.endDate}
                      onChange={(value) => updateEducation(edu.id, 'endDate', value)}
                      label="End Date"
                      disabled={edu.current}
                    />
                  </div>

                  {/* Current Study Checkbox */}
                  <div className="form-checkbox-group">
                    <label className="form-checkbox-label">
                      <input
                        type="checkbox"
                        checked={edu.current || false}
                        onChange={(e) => handleCurrentStudyChange(edu.id, e.target.checked)}
                        className="form-checkbox"
                      />
                      <span className="checkbox-text">I currently study here</span>
                    </label>
                  </div>

                  {/* Description */}
                  <textarea
                    placeholder="Description (Key subjects, achievements, honors, etc.)"
                    value={edu.description}
                    onChange={(e) => updateEducation(edu.id, 'description', e.target.value)}
                    rows={3}
                    className="form-textarea"
                  />

                  {/* Diploma/Document Link */}
                  <div className="diploma-link-container">
                    <label className="diploma-link-label">
                      📜 Diploma/Certificate Link (Optional)
                    </label>
                    <input
                      type="url"
                      placeholder="Link to diploma, transcript, or official document (e.g., Google Drive, Dropbox)"
                      value={edu.diplomaLink || ''}
                      onChange={(e) => updateEducation(edu.id, 'diplomaLink', e.target.value)}
                      className="form-input diploma-link-input"
                    />
                    <div className="diploma-link-help">
                      <span className="help-icon">💡</span>
                      <span className="help-text">
                        Upload your diploma to Google Drive/Dropbox and paste the shareable link here. Employers can verify your qualification directly.
                      </span>
                    </div>
                  </div>

                  {/* Expandable Projects & Certificates Section */}
                  <div className="education-extras">
                    <button
                      type="button"
                      onClick={() => toggleExpanded(edu.id)}
                      className="education-expand-btn"
                    >
                      <span>Projects & Certificates</span>
                      <ChevronDown 
                        className={`education-expand-icon ${expandedItems[edu.id] ? 'rotated' : ''}`} 
                        size={16} 
                      />
                    </button>

                    {expandedItems[edu.id] && (
                      <div className="education-extras-content">
                        {/* Projects Section */}
                        <div className="education-subsection">
                          <div className="education-subsection-header">
                            <h4 className="education-subsection-title">
                              <BookOpen size={14} />
                              Projects
                            </h4>
                            <button
                              type="button"
                              onClick={() => addProject(edu.id)}
                              className="education-subsection-add-btn"
                            >
                              <Plus size={12} />
                              Add Project
                            </button>
                          </div>

                          {(edu.projects || []).map(project => (
                            <div key={project.id} className="education-subitem">
                              <div className="education-subitem-content">
                                <div className="education-subitem-field">
                                  <label className="education-subitem-label">Project Name</label>
                                  <input
                                    type="text"
                                    placeholder="Enter project name"
                                    value={project.name}
                                    onChange={(e) => updateProject(edu.id, project.id, 'name', e.target.value)}
                                    className="form-input education-subitem-input"
                                  />
                                </div>
                                <div className="education-subitem-field">
                                  <label className="education-subitem-label">Project Description</label>
                                  <textarea
                                    placeholder="Describe the project, its goals, and your role"
                                    value={project.description}
                                    onChange={(e) => updateProject(edu.id, project.id, 'description', e.target.value)}
                                    rows={2}
                                    className="form-textarea education-subitem-textarea"
                                  />
                                </div>
                                <div className="education-subitem-field">
                                  <label className="education-subitem-label">Technologies Used</label>
                                  <input
                                    type="text"
                                    placeholder="e.g., React, Node.js, MongoDB"
                                    value={project.technologies}
                                    onChange={(e) => updateProject(edu.id, project.id, 'technologies', e.target.value)}
                                    className="form-input education-subitem-input"
                                  />
                                </div>
                                <div className="education-subitem-field">
                                  <label className="education-subitem-label">Project Link</label>
                                  <input
                                    type="url"
                                    placeholder="github.com/user/project or demo URL"
                                    value={project.link}
                                    onChange={(e) => updateProject(edu.id, project.id, 'link', e.target.value)}
                                    className="form-input education-subitem-input"
                                  />
                                </div>
                              </div>
                              <button
                                onClick={() => handleProjectDeleteClick(edu.id, project)}
                                className="form-remove-btn-inline"
                                title="Remove project"
                              >
                                <Trash2 className="form-remove-icon" />
                              </button>
                            </div>
                          ))}
                        </div>

                        {/* Certificates Section */}
                        <div className="education-subsection">
                          <div className="education-subsection-header">
                            <h4 className="education-subsection-title">
                              <Award size={14} />
                              Certificates
                            </h4>
                            <button
                              type="button"
                              onClick={() => addCertificate(edu.id)}
                              className="education-subsection-add-btn"
                            >
                              <Plus size={12} />
                              Add Certificate
                            </button>
                          </div>

                          {(edu.certificates || []).map(cert => (
                            <div key={cert.id} className="education-subitem">
                              <div className="education-subitem-content">
                                <div className="education-subitem-field">
                                  <label className="education-subitem-label">Certificate Name</label>
                                  <input
                                    type="text"
                                    placeholder="e.g., AWS Certified Cloud Practitioner"
                                    value={cert.name}
                                    onChange={(e) => updateCertificate(edu.id, cert.id, 'name', e.target.value)}
                                    className="form-input education-subitem-input"
                                  />
                                </div>
                                <div className="education-subitem-field">
                                  <label className="education-subitem-label">Issuing Organization</label>
                                  <input
                                    type="text"
                                    placeholder="e.g., Amazon Web Services"
                                    value={cert.issuer}
                                    onChange={(e) => updateCertificate(edu.id, cert.id, 'issuer', e.target.value)}
                                    className="form-input education-subitem-input"
                                  />
                                </div>
                                <div className="education-subitem-field">
                                  <label className="education-subitem-label">Issue Date</label>
                                  <input
                                    type="text"
                                    placeholder="Jan 2023 or 01/2023"
                                    value={cert.date}
                                    onChange={(e) => updateCertificate(edu.id, cert.id, 'date', e.target.value)}
                                    className="form-input education-subitem-input"
                                  />
                                </div>
                                <div className="education-subitem-field">
                                  <label className="education-subitem-label">Credential ID</label>
                                  <input
                                    type="text"
                                    placeholder="Certificate ID or badge number"
                                    value={cert.credentialId}
                                    onChange={(e) => updateCertificate(edu.id, cert.id, 'credentialId', e.target.value)}
                                    className="form-input education-subitem-input"
                                  />
                                </div>
                                <div className="education-subitem-field">
                                  <label className="education-subitem-label">Certificate Link</label>
                                  <input
                                    type="url"
                                    placeholder="Verification URL or badge link"
                                    value={cert.link}
                                    onChange={(e) => updateCertificate(edu.id, cert.id, 'link', e.target.value)}
                                    className="form-input education-subitem-input"
                                  />
                                </div>
                              </div>
                              <button
                                onClick={() => handleCertificateDeleteClick(edu.id, cert)}
                                className="form-remove-btn-inline"
                                title="Remove certificate"
                              >
                                <Trash2 className="form-remove-icon" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Preview Duration */}
                  {(edu.startDate || edu.endDate) && (
                    <div className="duration-preview">
                      <span className="duration-label">Duration: </span>
                      <span className="duration-text">
                        {formatDuration(edu.startDate, edu.endDate, edu.current)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Remove Button - Now with confirmation */}
              <button
                onClick={() => handleEducationDeleteClick(edu)}
                className="form-remove-btn"
                title="Remove this education"
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
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText="Delete"
        cancelText="Cancel"
        type="delete"
      />
    </div>
  );
};

export default EducationForm;