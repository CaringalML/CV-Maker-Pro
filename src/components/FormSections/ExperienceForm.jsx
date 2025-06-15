import React, { useState } from 'react';
import { Briefcase, Plus, Trash2, ChevronDown } from 'lucide-react';
import ConfirmationDialog from '../Common/ConfirmationDialog';

const ExperienceForm = ({ data, onChange }) => {
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    experienceId: null,
    experienceName: ''
  });

  const addExperience = () => {
    const newExp = {
      id: Date.now(),
      position: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    };
    onChange({
      experience: [...(data || []), newExp]
    });
  };

  const updateExperience = (id, field, value) => {
    const updated = (data || []).map(exp =>
      exp.id === id ? { ...exp, [field]: value } : exp
    );
    onChange({ experience: updated });
  };

  const removeExperience = (id) => {
    const updated = (data || []).filter(exp => exp.id !== id);
    onChange({ experience: updated });
  };

  const handleDeleteClick = (exp) => {
    const experienceName = exp.position && exp.company 
      ? `${exp.position} at ${exp.company}`
      : exp.position || exp.company || 'this experience';
    
    setConfirmDialog({
      isOpen: true,
      experienceId: exp.id,
      experienceName: experienceName
    });
  };

  const handleConfirmDelete = () => {
    if (confirmDialog.experienceId) {
      removeExperience(confirmDialog.experienceId);
    }
  };

  const handleCloseDialog = () => {
    setConfirmDialog({
      isOpen: false,
      experienceId: null,
      experienceName: ''
    });
  };

  const handleCurrentJobChange = (id, isChecked) => {
    const updated = (data || []).map(exp =>
      exp.id === id 
        ? { 
            ...exp, 
            current: isChecked, 
            endDate: isChecked ? '' : exp.endDate 
          }
        : exp
    );
    onChange({ experience: updated });
  };

  const handleDescriptionChange = (id, value) => {
    // Auto-format with bullet points
    const lines = value.split('\n');
    const formattedLines = lines.map(line => {
      const trimmedLine = line.trim();
      if (trimmedLine && !trimmedLine.startsWith('•') && !trimmedLine.startsWith('-') && !trimmedLine.startsWith('*')) {
        return `• ${trimmedLine}`;
      }
      return line;
    });
    
    const formattedValue = formattedLines.join('\n');
    updateExperience(id, 'description', formattedValue);
  };

  const handleDescriptionKeyDown = (e, id) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const currentValue = e.target.value;
      const cursorPosition = e.target.selectionStart;
      const beforeCursor = currentValue.slice(0, cursorPosition);
      const afterCursor = currentValue.slice(cursorPosition);
      
      // Add new line with bullet point
      const newValue = beforeCursor + '\n• ' + afterCursor;
      updateExperience(id, 'description', newValue);
      
      // Set cursor position after the bullet point
      setTimeout(() => {
        e.target.setSelectionRange(cursorPosition + 3, cursorPosition + 3);
      }, 0);
    }
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

    // Get display text for dropdowns
    const monthDisplayText = selectedMonth || 'Month';
    const yearDisplayText = selectedYear || 'Year';

    return (
      <div className="simple-date-container">
        <label className="simple-date-label">{label}</label>
        <div className={`simple-date-dropdowns ${disabled ? 'disabled' : ''}`}>
          {/* Month Dropdown */}
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

          {/* Year Dropdown */}
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
          <Briefcase className="form-section-icon orange" />
          Professional Experience
        </h3>
        <button onClick={addExperience} className="form-add-btn">
          <Plus className="form-add-icon" />
          Add Experience
        </button>
      </div>

      {(data || []).length === 0 ? (
        <div className="empty-state">
          <Briefcase className="empty-icon" />
          <p>No work experience added yet</p>
          <p className="empty-subtitle">Click "Add Experience" to start building your work history</p>
        </div>
      ) : (
        <div className="form-items">
          {(data || []).map(exp => (
            <div key={exp.id} className="form-item">
              <div className="form-item-content">
                <div className="form-fields">
                  {/* Position and Company */}
                  <div className="form-field-group">
                    <input
                      type="text"
                      placeholder="Job Title/Position *"
                      value={exp.position}
                      onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                      className="form-input"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Company Name *"
                      value={exp.company}
                      onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                      className="form-input"
                      required
                    />
                  </div>

                  {/* Location */}
                  <input
                    type="text"
                    placeholder="Location (City, Country)"
                    value={exp.location}
                    onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                    className="form-input"
                  />

                  {/* Date Range */}
                  <div className="simple-date-range">
                    <DateDropdowns
                      value={exp.startDate}
                      onChange={(value) => updateExperience(exp.id, 'startDate', value)}
                      label="Start Date"
                    />
                    <DateDropdowns
                      value={exp.endDate}
                      onChange={(value) => updateExperience(exp.id, 'endDate', value)}
                      label="End Date"
                      disabled={exp.current}
                    />
                  </div>

                  {/* Current Job Checkbox */}
                  <div className="form-checkbox-group">
                    <label className="form-checkbox-label">
                      <input
                        type="checkbox"
                        checked={exp.current || false}
                        onChange={(e) => handleCurrentJobChange(exp.id, e.target.checked)}
                        className="form-checkbox"
                      />
                      <span className="checkbox-text">I currently work here</span>
                    </label>
                  </div>

                  {/* Job Description with Auto Bullets */}
                  <div className="job-description-container">
                    <label className="job-description-label">
                      Job Description & Key Achievements
                    </label>
                    <textarea
                      placeholder="• Describe your main responsibilities&#10;• Highlight key accomplishments&#10;• Include quantifiable results where possible&#10;• Use action verbs (Led, Managed, Developed, etc.)&#10;&#10;Press Enter to create new bullet points automatically"
                      value={exp.description}
                      onChange={(e) => handleDescriptionChange(exp.id, e.target.value)}
                      onKeyDown={(e) => handleDescriptionKeyDown(e, exp.id)}
                      rows={8}
                      className="form-textarea job-description-textarea"
                    />
                    <div className="job-description-help">
                      <span className="help-icon">💡</span>
                      <span className="help-text">
                        Each new line will automatically get a bullet point. Press Enter to add new achievements.
                      </span>
                    </div>
                  </div>

                  {/* Preview Duration */}
                  {(exp.startDate || exp.endDate) && (
                    <div className="duration-preview">
                      <span className="duration-label">Duration: </span>
                      <span className="duration-text">
                        {formatDuration(exp.startDate, exp.endDate, exp.current)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Remove Button */}
              <button
                onClick={() => handleDeleteClick(exp)}
                className="form-remove-btn"
                title="Remove this experience"
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
        title="Delete Work Experience"
        message={`Are you sure you want to delete "${confirmDialog.experienceName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="delete"
      />
    </div>
  );
};

export default ExperienceForm;