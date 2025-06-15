import React, { useState, useEffect, useMemo } from 'react';
import { Award, Trash2, Code, Users } from 'lucide-react';
import ConfirmationDialog from '../Common/ConfirmationDialog';

const SkillsForm = ({ data, onChange }) => {
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    skillId: null,
    skillName: ''
  });
  
  // Add local state to force re-renders
  const [localSkills, setLocalSkills] = useState([]);

  // Transform data to handle both old string array format and new object format
  const skills = useMemo(() => {
    const transformedData = Array.isArray(data) 
      ? data.map((skill, index) => {
          if (typeof skill === 'string') {
            return {
              id: `skill-${index}-${Date.now() + index}`,
              name: skill,
              category: 'Technical' // Default for legacy string skills
            };
          }
          return {
            ...skill,
            id: skill.id || `skill-${index}-${Date.now() + index}`,
            category: skill.category || 'Technical' // Preserve existing category or default
          };
        })
      : (data || []);
    return transformedData;
  }, [data]);

  // Update local state when the memoized skills array changes
  useEffect(() => {
    setLocalSkills(skills);
  }, [skills]);

  // Debug: Log the current data and transformed skills
  console.log('Raw data received:', data);
  console.log('Transformed skills:', skills);
  console.log('Local skills state:', localSkills);

  const addSkill = (category = 'Technical') => {
    const newSkill = {
      id: Date.now() + Math.random(), // Make ID more unique
      name: '',
      category: category // Ensure category is properly set
    };
    
    console.log('Adding new skill with category:', category, newSkill);
    const updatedSkills = [...localSkills, newSkill];
    console.log('Updated skills array:', updatedSkills);
    
    // Update local state immediately
    setLocalSkills(updatedSkills);
    
    // Call parent onChange
    onChange({ skills: updatedSkills });
  };

  const updateSkill = (id, field, value) => {
    console.log('Updating skill:', { id, field, value });
    const updated = localSkills.map(skill =>
      skill.id === id ? { ...skill, [field]: value } : skill
    );
    console.log('Updated skills after update:', updated);
    
    // Update local state immediately
    setLocalSkills(updated);
    
    // Call parent onChange
    onChange({ skills: updated });
  };

  const removeSkill = (id) => {
    console.log('Removing skill with id:', id);
    console.log('Current localSkills before removal:', localSkills);
    const updated = localSkills.filter(skill => skill.id !== id);
    console.log('Updated skills after removal:', updated);
    
    // Update local state immediately
    setLocalSkills(updated);
    
    // Call parent onChange
    console.log('Calling onChange with skills update...');
    onChange({ skills: updated });
  };

  const handleDeleteClick = (skill) => {
    console.log('Delete clicked for skill:', skill); // Debug log
    setConfirmDialog({
      isOpen: true,
      skillId: skill.id,
      skillName: skill.name || 'this skill'
    });
  };

  const handleConfirmDelete = () => {
    console.log('handleConfirmDelete called'); // Debug log
    console.log('confirmDialog state:', confirmDialog); // Debug log
    
    if (confirmDialog.skillId) {
      console.log('About to remove skill with ID:', confirmDialog.skillId); // Debug log
      removeSkill(confirmDialog.skillId);
      
      // Close the dialog after successful deletion
      setConfirmDialog({
        isOpen: false,
        skillId: null,
        skillName: ''
      });
      console.log('Dialog closed after deletion'); // Debug log
    } else {
      console.log('No skillId found in confirmDialog'); // Debug log
    }
  };

  const handleCloseDialog = () => {
    console.log('Closing dialog'); // Debug log
    setConfirmDialog({
      isOpen: false,
      skillId: null,
      skillName: ''
    });
  };

  // Group skills by category for display - use localSkills for rendering
  const groupedSkills = localSkills.reduce((groups, skill) => {
    const category = skill.category || 'Technical';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(skill);
    return groups;
  }, {});

  // Common skills for autocomplete
  const commonTechnicalSkills = [
    'JavaScript', 'Python', 'Java', 'C++', 'React', 'Vue.js', 'Angular', 'Node.js',
    'HTML', 'CSS', 'TypeScript', 'PHP', 'Ruby', 'Go', 'Swift', 'Kotlin',
    'SQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Excel', 'Power BI',
    'Docker', 'Kubernetes', 'AWS', 'Azure', 'Google Cloud', 'Git', 'Linux',
    'Microsoft Office', 'Google Workspace', 'Salesforce', 'SAP', 'AutoCAD',
    'Photoshop', 'Illustrator', 'Figma', 'Sketch', 'InDesign', 'Premiere Pro'
  ];

  const commonBehavioralSkills = [
    'Leadership', 'Team Management', 'Project Management', 'Strategic Planning',
    'Communication', 'Public Speaking', 'Presentation', 'Negotiation', 'Sales',
    'Customer Service', 'Problem Solving', 'Critical Thinking', 'Decision Making',
    'Time Management', 'Organization', 'Multitasking', 'Adaptability', 'Flexibility',
    'Creativity', 'Innovation', 'Conflict Resolution', 'Mentoring', 'Coaching',
    'Collaboration', 'Teamwork', 'Cross-functional Coordination', 'Stakeholder Management',
    'Change Management', 'Process Improvement', 'Quality Assurance', 'Risk Management',
    'Budget Management', 'Financial Analysis', 'Data Analysis', 'Research',
    'Training & Development', 'Performance Management', 'Recruitment', 'Networking'
  ];

  const getSkillSuggestions = (category) => {
    switch (category) {
      case 'Technical':
        return commonTechnicalSkills;
      case 'Behavioral':
        return commonBehavioralSkills;
      default:
        return commonTechnicalSkills;
    }
  };

  return (
    <div className="form-section">
      <div className="form-section-header">
        <h3 className="form-section-title">
          <Award className="form-section-icon purple" />
          Key Skills & Core Competencies
        </h3>
      </div>

      {localSkills.length === 0 ? (
        <>
          <div className="skills-category-buttons">
            <button
              onClick={() => addSkill('Technical')}
              className="skill-category-add-btn technical"
              type="button"
            >
              <Code size={16} />
              <span>Technical Skills & Competencies</span>
            </button>
            <button
              onClick={() => addSkill('Behavioral')}
              className="skill-category-add-btn behavioral"
              type="button"
            >
              <Users size={16} />
              <span>Behavioral & Transferable Skills</span>
            </button>
          </div>
          <div className="empty-state">
            <Award className="empty-icon" />
            <p>No skills added yet</p>
            <p className="empty-subtitle">Use the buttons above to add your technical skills and behavioral competencies</p>
          </div>
        </>
      ) : (
        <div className="skills-with-sections-container">
          {/* Technical Skills Button - Always visible */}
          <button
            onClick={() => {
              console.log('Technical button clicked');
              addSkill('Technical');
            }}
            className="skill-category-add-btn technical"
            type="button"
          >
            <Code size={16} />
            <span>Technical Skills & Competencies</span>
          </button>

          {/* Technical Skills Section - Only when skills exist */}
          {(() => {
            const technicalSkills = groupedSkills.Technical || [];
            const CategoryIcon = Code;
            
            return technicalSkills.length > 0 ? (
              <div className="skill-category-section-vertical">
                <div className="skill-category-header-vertical">
                  <div 
                    className="skill-category-icon-vertical"
                    style={{ color: '#3b82f6' }}
                  >
                    <CategoryIcon size={20} />
                  </div>
                  <h4 className="skill-category-title-vertical">Technical Skills & Competencies</h4>
                  <div className="skill-category-count">
                    ({technicalSkills.length} skill{technicalSkills.length !== 1 ? 's' : ''})
                  </div>
                </div>

                <div className="skill-category-content-vertical">
                  <div className="skill-items-vertical">
                    {technicalSkills.map(skill => (
                      <div key={skill.id} className="skill-item-vertical">
                        <div className="skill-item-content-vertical">
                          <div className="skill-input-group">
                            <input
                              type="text"
                              placeholder="Enter technical skill"
                              value={skill.name}
                              onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
                              className="skill-input-vertical"
                              list={`skills-Technical-${skill.id}`}
                              required
                            />
                            <datalist id={`skills-Technical-${skill.id}`}>
                              {getSkillSuggestions('Technical').map(suggestion => (
                                <option key={suggestion} value={suggestion} />
                              ))}
                            </datalist>
                          </div>
                        </div>

                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDeleteClick(skill);
                          }}
                          className="skill-delete-btn-vertical"
                          title="Remove skill"
                          type="button"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : null;
          })()}

          {/* Behavioral Skills Button - Always visible */}
          <button
            onClick={() => {
              console.log('Behavioral button clicked');
              addSkill('Behavioral');
            }}
            className="skill-category-add-btn behavioral"
            type="button"
          >
            <Users size={16} />
            <span>Behavioral & Transferable Skills</span>
          </button>

          {/* Behavioral Skills Section - Only when skills exist */}
          {(() => {
            const behavioralSkills = groupedSkills.Behavioral || [];
            const CategoryIcon = Users;
            
            return behavioralSkills.length > 0 ? (
              <div className="skill-category-section-vertical">
                <div className="skill-category-header-vertical">
                  <div 
                    className="skill-category-icon-vertical"
                    style={{ color: '#10b981' }}
                  >
                    <CategoryIcon size={20} />
                  </div>
                  <h4 className="skill-category-title-vertical">Behavioral & Transferable Skills</h4>
                  <div className="skill-category-count">
                    ({behavioralSkills.length} skill{behavioralSkills.length !== 1 ? 's' : ''})
                  </div>
                </div>

                <div className="skill-category-content-vertical">
                  <div className="skill-items-vertical">
                    {behavioralSkills.map(skill => (
                      <div key={skill.id} className="skill-item-vertical">
                        <div className="skill-item-content-vertical">
                          <div className="skill-input-group">
                            <input
                              type="text"
                              placeholder="Enter behavioral skill"
                              value={skill.name}
                              onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
                              className="skill-input-vertical"
                              list={`skills-Behavioral-${skill.id}`}
                              required
                            />
                            <datalist id={`skills-Behavioral-${skill.id}`}>
                              {getSkillSuggestions('Behavioral').map(suggestion => (
                                <option key={suggestion} value={suggestion} />
                              ))}
                            </datalist>
                          </div>
                        </div>

                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDeleteClick(skill);
                          }}
                          className="skill-delete-btn-vertical"
                          title="Remove skill"
                          type="button"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="skill-category-empty-vertical">
                <p>No behavioral & transferable skills added yet</p>
                <p className="empty-hint">Use the button above to add skills to this category</p>
              </div>
            );
          })()}

          {/* Skills Summary */}
          <div className="skills-summary-vertical">
            <h4 className="skills-summary-title-vertical">Skills Overview</h4>
            <div className="skills-summary-stats-vertical">
              <div className="skill-stat-vertical">
                <span className="skill-stat-number-vertical">{localSkills.length}</span>
                <span className="skill-stat-label-vertical">Total Skills</span>
              </div>
              <div className="skill-stat-vertical">
                <span className="skill-stat-number-vertical">{(groupedSkills.Technical || []).length}</span>
                <span className="skill-stat-label-vertical">Technical</span>
              </div>
              <div className="skill-stat-vertical">
                <span className="skill-stat-number-vertical">{(groupedSkills.Behavioral || []).length}</span>
                <span className="skill-stat-label-vertical">Behavioral</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={confirmDialog.isOpen}
        onClose={handleCloseDialog}
        onConfirm={handleConfirmDelete}
        title="Delete Skill"
        message={`Are you sure you want to delete "${confirmDialog.skillName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="delete"
      />
    </div>
  );
};

export default SkillsForm;