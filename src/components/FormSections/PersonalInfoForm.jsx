import React from 'react';
import { User } from 'lucide-react';

const PersonalInfoForm = ({ data, onChange }) => {
  const handleChange = (field, value) => {
    onChange({
      personalInfo: { ...data, [field]: value }
    });
  };

  return (
    <div className="form-section">
      <h3 className="form-section-title">
        <User className="form-section-icon blue" />
        Personal Information
      </h3>
      <div className="form-fields">
        {/* Basic Information */}
        <input
          type="text"
          placeholder="Full Name *"
          value={data?.fullName || ''}
          onChange={(e) => handleChange('fullName', e.target.value)}
          className="form-input"
          required
        />
        
        <input
          type="email"
          placeholder="Email Address *"
          value={data?.email || ''}
          onChange={(e) => handleChange('email', e.target.value)}
          className="form-input"
          required
        />
        
        <input
          type="url"
          placeholder="Website (Optional)"
          value={data?.website || ''}
          onChange={(e) => handleChange('website', e.target.value)}
          className="form-input"
        />
        
        <input
          type="tel"
          placeholder="Phone Number"
          value={data?.phone || ''}
          onChange={(e) => handleChange('phone', e.target.value)}
          className="form-input"
        />

        {/* Address Fields */}
        <div className="form-field-group">
          <input
            type="text"
            placeholder="Suburb"
            value={data?.suburb || ''}
            onChange={(e) => handleChange('suburb', e.target.value)}
            className="form-input"
          />
          <input
            type="text"
            placeholder="City"
            value={data?.city || ''}
            onChange={(e) => handleChange('city', e.target.value)}
            className="form-input"
          />
        </div>

        <div className="form-field-group">
          <input
            type="text"
            placeholder="Postal Code"
            value={data?.postalCode || ''}
            onChange={(e) => handleChange('postalCode', e.target.value)}
            className="form-input"
          />
          <input
            type="text"
            placeholder="Region/State"
            value={data?.region || ''}
            onChange={(e) => handleChange('region', e.target.value)}
            className="form-input"
          />
        </div>

        {/* Legal Status and Licenses */}
        <div className="form-field-group">
          <select
            value={data?.visaStatus || ''}
            onChange={(e) => handleChange('visaStatus', e.target.value)}
            className="form-select"
          >
            <option value="">Visa Status</option>
            <option value="Citizen">Citizen</option>
            <option value="Resident">Resident</option>
            <option value="Permanent Resident">Permanent Resident</option>
            <option value="Work Visa">Work Visa</option>
            <option value="Student Visa">Student Visa</option>
            <option value="Visitor Visa">Visitor Visa</option>
            <option value="Other">Other</option>
          </select>
          
          <select
            value={data?.driverLicense || ''}
            onChange={(e) => handleChange('driverLicense', e.target.value)}
            className="form-select"
          >
            <option value="">Driver License</option>
            
            {/* License Status */}
            <option value="No License">No License</option>
            <option value="Overseas License">Overseas License</option>
            <option value="Learners License">Learners License</option>
            <option value="Restricted License">Restricted License</option>
            
            {/* Full License Classes */}
            <option value="Full License - Class 1">Full License - Class 1 (Car)</option>
            <option value="Full License - Class 2">Full License - Class 2 (Medium Rigid)</option>
            <option value="Full License - Class 3">Full License - Class 3 (Medium Combination)</option>
            <option value="Full License - Class 4">Full License - Class 4 (Heavy Rigid)</option>
            <option value="Full License - Class 5">Full License - Class 5 (Heavy Combination)</option>
            
            {/* Motorcycle Classes */}
            <option value="Motorcycle License - Class 6L">Motorcycle License - Class 6L (Learner)</option>
            <option value="Motorcycle License - Class 6R">Motorcycle License - Class 6R (Restricted)</option>
            <option value="Motorcycle License - Class 6F">Motorcycle License - Class 6F (Full)</option>
            
            {/* Special Vehicle Classes */}
            <option value="Moped License">Moped License</option>
            <option value="Forklift License">Forklift License</option>
            <option value="Bus License - Passenger">Bus License - Passenger Service</option>
            <option value="Taxi License">Taxi License</option>
            
            {/* Commercial Endorsements */}
            <option value="Dangerous Goods Endorsement">Dangerous Goods Endorsement</option>
            <option value="Passenger Endorsement">Passenger Endorsement</option>
            <option value="Vehicle Recovery Endorsement">Vehicle Recovery Endorsement</option>
            <option value="Driving Instructor Endorsement">Driving Instructor Endorsement</option>
            
            {/* Multiple Licenses */}
            <option value="Multiple Classes">Multiple Classes</option>
            <option value="Other">Other</option>
          </select>
        </div>
        
        {/* Personal Statement */}
        <textarea
          placeholder="Personal Statement (Brief overview of your career and goals)"
          value={data?.summary || ''}
          onChange={(e) => handleChange('summary', e.target.value)}
          rows={4}
          className="form-textarea"
        />
      </div>
    </div>
  );
};

export default PersonalInfoForm;