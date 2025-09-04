'use client';

import React from 'react';

export interface TripNavigationItem {
  id: string;
  title: string;
  emoji: string;
}

export interface TripNavigationProps {
  sections: TripNavigationItem[];
  activeSection: string;
  onSectionClick: (sectionId: string) => void;
  className?: string;
}

const TripNavigation: React.FC<TripNavigationProps> = ({
  sections,
  activeSection,
  onSectionClick,
  className = ''
}) => {
  if (sections.length <= 1) {
    return null;
  }

  return (
    <div className={`alfie-enhanced-nav ${className}`}>
      <div className="alfie-enhanced-nav-container">
        {sections.map((section, index) => (
          <button
            key={section.id}
            className={`alfie-enhanced-nav-item ${
              activeSection === section.id ? 'active' : ''
            }`}
            onClick={() => onSectionClick(section.id)}
            title={section.title}
          >
            <span className="alfie-enhanced-nav-emoji">{section.emoji}</span>
            <span className="alfie-enhanced-nav-title">
              {section.title.length > 15 
                ? `${section.title.substring(0, 15)}...` 
                : section.title
              }
            </span>
            <span className="alfie-enhanced-nav-number">{index + 1}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TripNavigation;