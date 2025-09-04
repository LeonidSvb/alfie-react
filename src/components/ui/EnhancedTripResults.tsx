'use client';

import React, { useState, useEffect, useRef } from 'react';
import TripNavigation from './TripNavigation';
import TypingAnimation from './TypingAnimation';

export interface EnhancedTripResultsProps {
  content: string;
  className?: string;
  enableAnimations?: boolean;
  testMode?: boolean;
}

interface TripSection {
  id: string;
  title: string;
  content: string;
  emoji: string;
}

const EnhancedTripResults: React.FC<EnhancedTripResultsProps> = ({
  content,
  className = '',
  enableAnimations = true,
  testMode = false
}) => {
  const [sections, setSections] = useState<TripSection[]>([]);
  const [activeSection, setActiveSection] = useState<string>('');
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());
  const [showTyping, setShowTyping] = useState(enableAnimations);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse content into sections
  useEffect(() => {
    const parseSections = (text: string): TripSection[] => {
      const lines = text.split('\n');
      const parsed: TripSection[] = [];
      let currentSection: TripSection | null = null;
      
      lines.forEach((line, index) => {
        // Detect section headers (emoji + title)
        const headerMatch = line.match(/^([🏞️✈️🗺️🌄🎯🚗🧳🥾🏛️🧠🎨])\s*(.+?)(?::|$)/);
        
        if (headerMatch) {
          // Save previous section
          if (currentSection) {
            parsed.push(currentSection);
          }
          
          // Start new section
          const [, emoji, title] = headerMatch;
          currentSection = {
            id: `section-${index}`,
            title: title.trim(),
            content: '',
            emoji: emoji
          };
        } else if (currentSection && line.trim()) {
          // Add content to current section
          currentSection.content += (currentSection.content ? '\n' : '') + line;
        }
      });
      
      // Add final section
      if (currentSection) {
        parsed.push(currentSection);
      }
      
      // If no sections found, create one big section
      if (parsed.length === 0) {
        parsed.push({
          id: 'section-0',
          title: 'Trip Guide',
          content: text,
          emoji: '🗺️'
        });
      }
      
      return parsed;
    };

    const parsedSections = parseSections(content);
    setSections(parsedSections);
    if (parsedSections.length > 0) {
      setActiveSection(parsedSections[0].id);
    }
  }, [content]);

  // Highlight key phrases in content
  const highlightContent = (text: string): string => {
    return text
      // Highlight prices ($123, €45, £67)
      .replace(/(\$|€|£)(\d+(?:,\d{3})*(?:\.\d{2})?)/g, '<span class="alfie-enhanced-highlight-price">$1$2</span>')
      // Highlight dates (various formats)
      .replace(/\b(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})\b/g, '<span class="alfie-enhanced-highlight-date">$1</span>')
      .replace(/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2},?\s+\d{2,4}\b/gi, '<span class="alfie-enhanced-highlight-date">$&</span>')
      // Highlight time (9:00 AM, 14:30)
      .replace(/\b(\d{1,2}:\d{2}\s?(?:AM|PM|am|pm)?)\b/g, '<span class="alfie-enhanced-highlight-time">$1</span>')
      // Make emojis slightly larger
      .replace(/([\u{1F300}-\u{1F9FF}])/gu, '<span class="alfie-enhanced-highlight-emoji">$1</span>');
  };

  // Toggle section collapse
  const toggleSection = (sectionId: string) => {
    const newCollapsed = new Set(collapsedSections);
    if (collapsedSections.has(sectionId)) {
      newCollapsed.delete(sectionId);
    } else {
      newCollapsed.add(sectionId);
    }
    setCollapsedSections(newCollapsed);
  };

  // Handle navigation click
  const handleNavClick = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element && containerRef.current) {
      const container = containerRef.current;
      const elementTop = element.offsetTop - container.offsetTop;
      container.scrollTo({
        top: elementTop - 100, // Account for sticky nav
        behavior: 'smooth'
      });
    }
  };

  // Handle scroll to update active section
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const container = containerRef.current;
      const scrollTop = container.scrollTop + 150; // Offset for sticky nav
      
      let currentActive = sections[0]?.id || '';
      
      sections.forEach(section => {
        const element = document.getElementById(section.id);
        if (element && element.offsetTop - container.offsetTop <= scrollTop) {
          currentActive = section.id;
        }
      });
      
      setActiveSection(currentActive);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [sections]);

  if (!content) {
    return <div>No content available</div>;
  }

  return (
    <div className={`alfie-enhanced-container ${className}`}>
      {/* Sticky Navigation */}
      {sections.length > 1 && (
        <TripNavigation
          sections={sections.map(s => ({ id: s.id, title: s.title, emoji: s.emoji }))}
          activeSection={activeSection}
          onSectionClick={handleNavClick}
        />
      )}
      
      {/* Content Container */}
      <div 
        ref={containerRef}
        className="alfie-enhanced-content"
      >
        {showTyping && enableAnimations ? (
          <TypingAnimation
            content={content}
            onComplete={() => setShowTyping(false)}
            sections={sections}
            onSectionComplete={(sectionId) => {
              // Could add section-by-section reveal if needed
            }}
          />
        ) : (
          <div className="alfie-enhanced-sections">
            {sections.map((section) => (
              <div 
                key={section.id}
                id={section.id}
                className="alfie-enhanced-section"
              >
                {/* Section Header */}
                <div 
                  className="alfie-enhanced-section-header"
                  onClick={() => toggleSection(section.id)}
                >
                  <span className="alfie-enhanced-section-emoji">{section.emoji}</span>
                  <h3 className="alfie-enhanced-section-title">{section.title}</h3>
                  <button className="alfie-enhanced-collapse-btn">
                    {collapsedSections.has(section.id) ? '▶' : '▼'}
                  </button>
                </div>
                
                {/* Section Content */}
                {!collapsedSections.has(section.id) && (
                  <div className="alfie-enhanced-section-content">
                    <div 
                      dangerouslySetInnerHTML={{
                        __html: highlightContent(section.content)
                          .split('\n')
                          .map(line => line.trim())
                          .filter(line => line)
                          .map(line => `<p>${line}</p>`)
                          .join('')
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Test Mode Indicator */}
      {testMode && (
        <div className="alfie-enhanced-test-indicator">
          🧪 Enhanced Results Test Mode
        </div>
      )}
    </div>
  );
};

export default EnhancedTripResults;