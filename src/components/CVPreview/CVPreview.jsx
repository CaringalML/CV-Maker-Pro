import React, { forwardRef } from 'react';
import { Mail, Phone, Briefcase, GraduationCap, Award, Languages, Globe, FileText, CreditCard, Star } from 'lucide-react';
import './CVPreview.css';

const CVPreview = forwardRef(({ data, versionName }, ref) => {
  const { personalInfo, experience, education, skills, languages } = data;

  // Helper function to format dates - handles both new and legacy formats
  const formatExperienceDate = (dateValue) => {
    if (!dateValue) return '';
    
    // Handle new string format from date picker: "Jan 2020", "Dec 2023"
    if (typeof dateValue === 'string') {
      return dateValue;
    }
    
    // Handle legacy object format: { month: "July", year: "2020" }
    if (typeof dateValue === 'object' && (dateValue.month || dateValue.year)) {
      if (dateValue.month && dateValue.year) {
        // Convert full month names to abbreviations for consistency
        const monthAbbr = dateValue.month.slice(0, 3);
        return `${monthAbbr} ${dateValue.year}`;
      }
      return dateValue.year || dateValue.month || '';
    }
    
    return '';
  };

  const formatDateRange = (startDate, endDate, current) => {
    const start = formatExperienceDate(startDate);
    const end = current ? 'Present' : formatExperienceDate(endDate);
    
    if (!start && !end) return '';
    if (!start) return end;
    if (!end || end === 'Present') return `${start} - Present`;
    
    return `${start} - ${end}`;
  };

  // Process skills data - handle both old string array and new object format
  const processSkills = (skillsData) => {
    if (!skillsData || skillsData.length === 0) return { keySkills: [], regularSkills: [], groupedSkills: {} };

    // Convert old string format to new object format if needed
    const normalizedSkills = skillsData.map((skill, index) => {
      if (typeof skill === 'string') {
        return {
          id: `skill-${index}`,
          name: skill,
          category: 'Technical',
          level: 'Intermediate',
          endorsed: false
        };
      }
      return skill;
    });

    // Separate key skills from regular skills
    const keySkills = normalizedSkills.filter(skill => skill.endorsed && skill.name.trim());
    const regularSkills = normalizedSkills.filter(skill => !skill.endorsed && skill.name.trim());

    // Group skills by category
    const groupedSkills = normalizedSkills.reduce((groups, skill) => {
      if (!skill.name.trim()) return groups;
      
      const category = skill.category || 'Technical';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(skill);
      return groups;
    }, {});

    return { keySkills, regularSkills, groupedSkills };
  };

  // Render skill level stars
  const renderSkillStars = (level) => {
    const levelMap = {
      'Beginner': 1,
      'Intermediate': 2,
      'Advanced': 3,
      'Expert': 4,
      'Master': 5
    };
    
    const stars = levelMap[level] || 2;
    
    return (
      <div className="cv-skill-stars">
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            size={10}
            className={`cv-skill-star ${star <= stars ? 'filled' : 'empty'}`}
          />
        ))}
      </div>
    );
  };

  // Custom Colorful Location Pin Component
  const ColorfulLocationPin = () => (
    <svg 
      className="cv-colorful-location-pin" 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 48 48"
      width="12" 
      height="12"
    >
      <path fill="#48b564" d="M35.76,26.36h0.01c0,0-3.77,5.53-6.94,9.64c-2.74,3.55-3.54,6.59-3.77,8.06	C24.97,44.6,24.53,45,24,45s-0.97-0.4-1.06-0.94c-0.23-1.47-1.03-4.51-3.77-8.06c-0.42-0.55-0.85-1.12-1.28-1.7L28.24,22l8.33-9.88	C37.49,14.05,38,16.21,38,18.5C38,21.4,37.17,24.09,35.76,26.36z"></path>
      <path fill="#fcc60e" d="M28.24,22L17.89,34.3c-2.82-3.78-5.66-7.94-5.66-7.94h0.01c-0.3-0.48-0.57-0.97-0.8-1.48L19.76,15	c-0.79,0.95-1.26,2.17-1.26,3.5c0,3.04,2.46,5.5,5.5,5.5C25.71,24,27.24,23.22,28.24,22z"></path>
      <path fill="#2c85eb" d="M28.4,4.74l-8.57,10.18L13.27,9.2C15.83,6.02,19.69,4,24,4C25.54,4,27.02,4.26,28.4,4.74z"></path>
      <path fill="#ed5748" d="M19.83,14.92L19.76,15l-8.32,9.88C10.52,22.95,10,20.79,10,18.5c0-3.54,1.23-6.79,3.27-9.3	L19.83,14.92z"></path>
      <path fill="#5695f6" d="M28.24,22c0.79-0.95,1.26-2.17,1.26-3.5c0-3.04-2.46-5.5-5.5-5.5c-1.71,0-3.24,0.78-4.24,2L28.4,4.74	c3.59,1.22,6.53,3.91,8.17,7.38L28.24,22z"></path>
    </svg>
  );

  return (
    <div ref={ref} className="cv-preview">
      {/* Header */}
      <div className="cv-header">
        <h1 className="cv-name">
          {personalInfo?.fullName || 'Your Name'}
        </h1>
        <div className="cv-contact">
          {/* Address Line */}
          {(personalInfo?.suburb || personalInfo?.city || personalInfo?.postalCode || personalInfo?.region) && (
            <div className="cv-contact-item">
              <ColorfulLocationPin />
              <a 
                href={`https://www.google.com/maps/search/${encodeURIComponent([personalInfo?.suburb, personalInfo?.city, personalInfo?.postalCode, personalInfo?.region].filter(Boolean).join(', '))}`}
                target="_blank" 
                rel="noopener noreferrer"
                className="cv-address-link"
                title="View location on Google Maps"
              >
                {[personalInfo?.suburb, personalInfo?.city, personalInfo?.postalCode, personalInfo?.region]
                  .filter(Boolean)
                  .join(', ')}
              </a>
            </div>
          )}
          
          {/* Phone */}
          {personalInfo?.phone && (
            <div className="cv-contact-item">
              <Phone className="cv-contact-icon" />
              <span>{personalInfo.phone}</span>
            </div>
          )}
          
          {/* Email */}
          {personalInfo?.email && (
            <div className="cv-contact-item">
              {personalInfo.email.includes('@gmail.com') ? (
                <svg className="cv-gmail-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                  <path fill="#4caf50" d="M45,16.2l-5,2.75l-5,4.75L35,40h7c1.657,0,3-1.343,3-3V16.2z"></path>
                  <path fill="#1e88e5" d="M3,16.2l3.614,1.71L13,23.7V40H6c-1.657,0-3-1.343-3-3V16.2z"></path>
                  <polygon fill="#e53935" points="35,11.2 24,19.45 13,11.2 12,17 13,23.7 24,31.95 35,23.7 36,17"></polygon>
                  <path fill="#c62828" d="M3,12.298V16.2l10,7.5V11.2L9.876,8.859C9.132,8.301,8.228,8,7.298,8h0C4.924,8,3,9.924,3,12.298z"></path>
                  <path fill="#fbc02d" d="M45,12.298V16.2l-10,7.5V11.2l3.124-2.341C38.868,8.301,39.772,8,40.702,8h0 C43.076,8,45,9.924,45,12.298z"></path>
                </svg>
              ) : personalInfo.email.includes('@outlook.com') || personalInfo.email.includes('@hotmail.com') || personalInfo.email.includes('@live.com') ? (
                <svg className="cv-outlook-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                  <path fill="#1a237e" d="M43.607,23.752l-7.162-4.172v11.594H44v-6.738C44,24.155,43.85,23.894,43.607,23.752z"></path>
                  <path fill="#0c4999" d="M33.919,8.84h9.046V7.732C42.965,6.775,42.19,6,41.234,6H17.667c-0.956,0-1.732,0.775-1.732,1.732 V8.84h9.005H33.919z"></path>
                  <path fill="#0f73d9" d="M33.919,33.522h7.314c0.956,0,1.732-0.775,1.732-1.732v-6.827h-9.046V33.522z"></path>
                  <path fill="#0f439d" d="M15.936,24.964v6.827c0,0.956,0.775,1.732,1.732,1.732h7.273v-8.558H15.936z"></path>
                  <path fill="#2ecdfd" d="M33.919 8.84H42.964999999999996V16.866999999999997H33.919z"></path>
                  <path fill="#1c5fb0" d="M15.936 8.84H24.941000000000003V16.866999999999997H15.936z"></path>
                  <path fill="#1467c7" d="M24.94 24.964H33.919V33.522H24.94z"></path>
                  <path fill="#1690d5" d="M24.94 8.84H33.919V16.866999999999997H24.94z"></path>
                  <path fill="#1bb4ff" d="M33.919 16.867H42.964999999999996V24.963H33.919z"></path>
                  <path fill="#074daf" d="M15.936 16.867H24.941000000000003V24.963H15.936z"></path>
                  <path fill="#2076d4" d="M24.94 16.867H33.919V24.963H24.94z"></path>
                  <path fill="#2ed0ff" d="M15.441,42c0.463,0,26.87,0,26.87,0C43.244,42,44,41.244,44,40.311V24.438 c0,0-0.03,0.658-1.751,1.617c-1.3,0.724-27.505,15.511-27.505,15.511S14.978,42,15.441,42z"></path>
                  <path fill="#139fe2" d="M42.279,41.997c-0.161,0-26.59,0.003-26.59,0.003C14.756,42,14,41.244,14,40.311V25.067 l29.363,16.562C43.118,41.825,42.807,41.997,42.279,41.997z"></path>
                  <path fill="#00488d" d="M22.319,34H5.681C4.753,34,4,33.247,4,32.319V15.681C4,14.753,4.753,14,5.681,14h16.638 C23.247,14,24,14.753,24,15.681v16.638C24,33.247,23.247,34,22.319,34z"></path>
                  <path fill="#fff" d="M13.914,18.734c-3.131,0-5.017,2.392-5.017,5.343c0,2.951,1.879,5.342,5.017,5.342 c3.139,0,5.017-2.392,5.017-5.342C18.931,21.126,17.045,18.734,13.914,18.734z M13.914,27.616c-1.776,0-2.838-1.584-2.838-3.539 s1.067-3.539,2.838-3.539c1.771,0,2.839,1.585,2.839,3.539S15.689,27.616,13.914,27.616z"></path>
                </svg>
              ) : personalInfo.email.includes('@yahoo.com') ? (
                <svg className="cv-yahoo-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                  <polygon fill="#5e35b1" points="4.209,14.881 11.632,14.881 16.189,26.715 20.966,14.881 28.315,14.881 17.07,42 9.501,42 12.587,34.96"></polygon>
                  <circle cx="29.276" cy="30.522" r="4.697" fill="#5e35b1"></circle>
                  <polygon fill="#5e35b1" points="34.693,6 27.213,24.042 35.444,24.042 42.925,6"></polygon>
                </svg>
              ) : (
                <Mail className="cv-contact-icon" />
              )}
              <a 
                href={`mailto:${personalInfo.email}`}
                className="cv-email-link"
                title="Send email to applicant"
              >
                {personalInfo.email}
              </a>
            </div>
          )}
          
          {/* Website */}
          {personalInfo?.website && (
            <div className="cv-contact-item">
              <Globe className="cv-contact-icon" />
              <a 
                href={personalInfo.website.startsWith('http') ? personalInfo.website : `https://${personalInfo.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="cv-website-link"
                title="Visit applicant's website"
              >
                {personalInfo.website}
              </a>
            </div>
          )}
          
          {/* Visa Status */}
          {personalInfo?.visaStatus && (
            <div className="cv-contact-item">
              <FileText className="cv-contact-icon" />
              <span>{personalInfo.visaStatus}</span>
            </div>
          )}
          
          {/* Driver License */}
          {personalInfo?.driverLicense && (
            <div className="cv-contact-item">
              <CreditCard className="cv-contact-icon" />
              <span>License: {personalInfo.driverLicense}</span>
            </div>
          )}
        </div>
      </div>

      {/* Personal Statement */}
      {personalInfo?.summary && (
        <div className="cv-section">
          <h2 className="cv-section-title">Personal Statement</h2>
          <p className="cv-summary">{personalInfo.summary}</p>
        </div>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <div className="cv-section">
          <h2 className="cv-section-title">
            <Briefcase className="cv-section-icon" />
            Professional Experience
          </h2>
          <div className="cv-items">
            {experience.map(exp => (
              <div key={exp.id} className="cv-item">
                <div className="cv-item-header">
                  <div className="cv-item-main">
                    <h3 className="cv-item-title">{exp.position}</h3>
                    <h4 className="cv-item-subtitle">
                      {exp.company}
                      {exp.location && (
                        <span>
                          , <a 
                            href={`https://www.google.com/maps/search/${encodeURIComponent(exp.location)}`}
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="cv-company-location-link"
                            title="View company location on Google Maps"
                          >
                            {exp.location}
                          </a>
                        </span>
                      )}
                    </h4>
                  </div>
                  {(exp.startDate || exp.endDate || exp.current) && (
                    <span className="cv-item-duration">
                      {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                    </span>
                  )}
                </div>
                {exp.description && (
                  <div className="cv-item-description">
                    {exp.description.split('\n').map((line, index) => (
                      line.trim() && (
                        <div key={index} className="cv-description-line">
                          {line.trim()}
                        </div>
                      )
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <div className="cv-section">
          <h2 className="cv-section-title">
            <GraduationCap className="cv-section-icon" />
            Education
          </h2>
          <div className="cv-items">
            {education.map(edu => (
              <div key={edu.id} className="cv-item">
                <div className="cv-item-header">
                  <div className="cv-item-main">
                    <h3 className="cv-item-title">
                      {edu.degree}
                      {edu.level && edu.degree && ' - '}
                      {edu.level && (
                        <span className="cv-education-level">({edu.level})</span>
                      )}
                      {edu.diplomaLink && (
                        <a 
                          href={edu.diplomaLink.startsWith('http') ? edu.diplomaLink : `https://${edu.diplomaLink}`}
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="cv-diploma-link"
                          title="View Diploma/Certificate"
                        >
                          📜
                        </a>
                      )}
                    </h3>
                    <h4 className="cv-item-subtitle">
                      {edu.institution}
                      {edu.location && (
                        <span>
                          , <a 
                            href={`https://www.google.com/maps/search/${encodeURIComponent(edu.location)}`}
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="cv-education-location-link"
                            title="View institution location on Google Maps"
                          >
                            {edu.location}
                          </a>
                        </span>
                      )}
                      {edu.gpa && ` • GPA: ${edu.gpa}`}
                    </h4>
                  </div>
                  {(edu.year || edu.startDate || edu.endDate) && (
                    <span className="cv-item-duration">
                      {edu.year || formatDateRange(edu.startDate, edu.endDate, edu.current)}
                    </span>
                  )}
                </div>
                {edu.description && (
                  <div className="cv-item-description">
                    {edu.description.split('\n').map((line, index) => (
                      line.trim() && (
                        <div key={index} className="cv-description-line">
                          {line.trim()}
                        </div>
                      )
                    ))}
                  </div>
                )}
                
                {/* Projects */}
                {edu.projects && edu.projects.length > 0 && (
                  <div className="cv-education-extras">
                    <h5 className="cv-education-extras-title">Projects:</h5>
                    <div className="cv-education-projects">
                      {edu.projects.map(project => (
                        <div key={project.id} className="cv-education-project">
                          <span className="cv-project-name">{project.name}</span>
                          {project.technologies && (
                            <span className="cv-project-tech"> ({project.technologies})</span>
                          )}
                          {project.link && (
                            <span className="cv-project-link"> • <a 
                              href={project.link.startsWith('http') ? project.link : `https://${project.link}`}
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="cv-project-link-anchor"
                            >
                              {project.link}
                            </a></span>
                          )}
                          {project.description && (
                            <div className="cv-project-description">{project.description}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Certificates */}
                {edu.certificates && edu.certificates.length > 0 && (
                  <div className="cv-education-extras">
                    <h5 className="cv-education-extras-title">Certificates:</h5>
                    <div className="cv-education-certificates">
                      {edu.certificates.map(cert => (
                        <div key={cert.id} className="cv-education-certificate">
                          <span className="cv-certificate-name">{cert.name}</span>
                          {cert.issuer && (
                            <span className="cv-certificate-issuer"> - {cert.issuer}</span>
                          )}
                          {cert.date && (
                            <span className="cv-certificate-date"> ({cert.date})</span>
                          )}
                          {cert.link && (
                            <span className="cv-certificate-link"> • <a 
                              href={cert.link.startsWith('http') ? cert.link : `https://${cert.link}`}
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="cv-certificate-link-anchor"
                            >
                              Verify
                            </a></span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Professional Certifications & Industry Credentials */}
      {data.certifications && data.certifications.length > 0 && (
        <div className="cv-section">
          <h2 className="cv-section-title">
            <Award className="cv-section-icon" />
            Professional Certifications & Industry Credentials
          </h2>
          <div className="cv-items">
            {data.certifications.map(cert => (
              <div key={cert.id} className="cv-item">
                <div className="cv-item-header">
                  <div className="cv-item-main">
                    <h3 className="cv-item-title">
                      {cert.name}
                      {cert.credentialId && (
                        <span className="cv-credential-id"> • ID: {cert.credentialId}</span>
                      )}
                      {cert.verificationLink && (
                        <span className="cv-verification-link"> • <a 
                          href={cert.verificationLink.startsWith('http') ? cert.verificationLink : `https://${cert.verificationLink}`}
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="cv-verification-link-anchor"
                          title="Verify certification"
                        >
                          Verify
                        </a></span>
                      )}
                    </h3>
                    <h4 className="cv-item-subtitle">
                      {cert.issuingOrganization}
                      {cert.location && `, ${cert.location}`}
                    </h4>
                  </div>
                  <div className="cv-certification-dates">
                    {cert.issueDate && (
                      <span className="cv-issue-date">
                        Issued: {cert.issueDate}
                      </span>
                    )}
                    {cert.expiryDate && (
                      <span className="cv-expiry-date">
                        Expires: {cert.expiryDate}
                      </span>
                    )}
                    {cert.neverExpires && (
                      <span className="cv-no-expiry">
                        No Expiration
                      </span>
                    )}
                  </div>
                </div>
                {cert.description && (
                  <div className="cv-item-description">
                    {cert.description.split('\n').map((line, index) => (
                      line.trim() && (
                        <div key={index} className="cv-description-line">
                          {line.trim()}
                        </div>
                      )
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Simple Skills Section - No Complex Logic */}
      {skills && skills.length > 0 && (() => {
        const { keySkills, regularSkills, groupedSkills } = processSkills(skills);
        const hasSkills = keySkills.length > 0 || regularSkills.length > 0;

        if (!hasSkills) return null;

        // Simple categorization
        const technicalCategories = ['Technical', 'Tools'];
        const behavioralCategories = ['Professional', 'Leadership', 'Creative', 'Language', 'Other', 'Behavioral'];

        const technicalSkills = [];
        const behavioralSkills = [];

        // Add all skills to appropriate categories
        [...keySkills, ...regularSkills].forEach(skill => {
          if (skill.name && skill.name.trim()) {
            if (technicalCategories.includes(skill.category)) {
              technicalSkills.push(skill);
            } else {
              behavioralSkills.push(skill);
            }
          }
        });

        // Fallback for old format
        if (technicalSkills.length === 0 && behavioralSkills.length === 0) {
          skills.forEach(skill => {
            const skillName = typeof skill === 'string' ? skill : skill.name || '';
            if (skillName.trim()) {
              const skillObj = {
                id: Math.random(),
                name: skillName,
                endorsed: false
              };
              // Simple keyword matching
              if (skillName.toLowerCase().match(/(javascript|python|react|html|css|sql|programming|coding|software|technical|technology|computer|system|database|cloud|aws|azure|framework|api|java|php|node|angular|vue|docker|kubernetes|git|linux|windows|mac|office|excel|word|powerpoint|photoshop|illustrator|figma|sketch)/)) {
                technicalSkills.push(skillObj);
              } else {
                behavioralSkills.push(skillObj);
              }
            }
          });
        }

        const hasTechnical = technicalSkills.length > 0;
        const hasBehavioral = behavioralSkills.length > 0;
        const showBothColumns = hasTechnical && hasBehavioral;

        return (
          <div className="cv-section">
            <h2 className="cv-section-title">
              <Award className="cv-section-icon" />
              Key Skills & Core Competencies
            </h2>
            
            <div className={`cv-skills-container ${showBothColumns ? 'two-columns' : 'single-column'}`}>
              {/* Technical Skills */}
              {hasTechnical && (
                <div className="cv-skills-column">
                  <h3 className="cv-skills-column-title">Technical Skills & Competencies</h3>
                  <div className="cv-skills-list">
                    {technicalSkills.map(skill => (
                      <div key={skill.id} className={`cv-skill-item-display ${skill.endorsed ? 'key-skill' : ''}`}>
                        <span className="cv-skill-name-display">{skill.name}</span>
                        {skill.endorsed && <span className="cv-key-skill-star">⭐</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Behavioral Skills */}
              {hasBehavioral && (
                <div className="cv-skills-column">
                  <h3 className="cv-skills-column-title">Behavioral & Transferable Skills</h3>
                  <div className="cv-skills-list">
                    {behavioralSkills.map(skill => (
                      <div key={skill.id} className={`cv-skill-item-display ${skill.endorsed ? 'key-skill' : ''}`}>
                        <span className="cv-skill-name-display">{skill.name}</span>
                        {skill.endorsed && <span className="cv-key-skill-star">⭐</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* Languages */}
      {languages && languages.length > 0 && (
        <div className="cv-section">
          <h2 className="cv-section-title">
            <Languages className="cv-section-icon" />
            Languages
          </h2>
          <div className="cv-languages">
            {languages
              .filter(lang => lang && lang.language && lang.language.trim())
              .map(lang => (
                <div key={lang.id || lang.language} className="cv-language-item">
                  <span className="cv-language-name">{lang.language}</span>
                  <span className="cv-language-level">{lang.level || 'Intermediate'}</span>
                </div>
              ))
            }
          </div>
        </div>
      )}
    </div>
  );
});

CVPreview.displayName = 'CVPreview';

export default CVPreview;