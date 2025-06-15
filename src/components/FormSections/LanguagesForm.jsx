import React from 'react';
import { Languages } from 'lucide-react';

const LanguagesForm = ({ data, onChange }) => {
  return (
    <div className="form-section">
      <h3 className="form-section-title">
        <Languages className="form-section-icon indigo" />
        Languages
      </h3>
      <div className="form-fields">
        <p>Languages form coming soon...</p>
      </div>
    </div>
  );
};

export default LanguagesForm;