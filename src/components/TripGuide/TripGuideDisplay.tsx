'use client';

import React, { useRef, useState, useEffect, useMemo } from 'react';
import { TripGuideDisplayProps } from '@/types/tripGuide';
import { EmailSubmissionData, CRMSubmissionResponse, EmailGateState } from '@/types/crm';
import InlineEmailGate from '@/components/EmailCollection/InlineEmailGate';
import AIContentRenderer from './AIContentRenderer';

export default function TripGuideDisplay({
  tripGuide,
  onEmailSubmit,
  className = ''
}: TripGuideDisplayProps): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [openedAccordionsCount, setOpenedAccordionsCount] = useState(0);

  const [emailGateState, setEmailGateState] = useState<EmailGateState>({
    isVisible: false,
    isSubmitting: false,
    hasSubmitted: false,
    error: undefined
  });
  

  // Check if email was already submitted for this guide (session storage)
  useEffect(() => {
    const storageKey = `tripguide-email-submitted-${tripGuide.id}`;
    const hasSubmitted = sessionStorage.getItem(storageKey) === 'true';
    if (hasSubmitted) {
      setEmailGateState(prev => ({ ...prev, hasSubmitted: true }));
    }
  }, [tripGuide.id]);

  // Show inline email gate based on opened accordions count
  useEffect(() => {
    const threshold = tripGuide.flowType === 'inspire-me' ? 1 : 3;
    if (openedAccordionsCount >= threshold && !emailGateState.hasSubmitted && !emailGateState.isVisible) {
      setEmailGateState(prev => ({ ...prev, isVisible: true }));
    }
  }, [openedAccordionsCount, tripGuide.flowType, emailGateState.hasSubmitted, emailGateState.isVisible]);

  const handleEmailSubmit = async (data: EmailSubmissionData) => {
    setEmailGateState(prev => ({ 
      ...prev, 
      isSubmitting: true, 
      error: undefined 
    }));

    try {
      const response = await fetch('/api/submit-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result: CRMSubmissionResponse = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to submit email');
      }

      // Success - immediately hide gate and mark as submitted
      const storageKey = `tripguide-email-submitted-${tripGuide.id}`;
      sessionStorage.setItem(storageKey, 'true');

      setEmailGateState({
        isVisible: false,
        isSubmitting: false,
        hasSubmitted: true,
        error: undefined
      });

      // Call parent callback if provided
      onEmailSubmit?.(data.email, data.firstName, data.lastName);

    } catch (error) {
      setEmailGateState(prev => ({
        ...prev,
        isSubmitting: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred'
      }));
    }
  };

  const handleCloseEmailGate = () => {
    setEmailGateState(prev => ({ ...prev, isVisible: false }));
  };

  const handleEmailSuccess = () => {
    setEmailGateState(prev => ({ ...prev, isVisible: false, hasSubmitted: true }));
  };

  // Calculate which content to show based on email submission status
  const shouldShowPartialContent = !emailGateState.hasSubmitted; // Show partial content until email submitted
  
  // Truncate content to 50% if not submitted
  const truncateContent = (content: string): string => {
    if (!shouldShowPartialContent) return content;
    
    const words = content.split(' ');
    const halfLength = Math.floor(words.length * 0.5);
    
    // Find good breaking point
    let breakPoint = halfLength;
    for (let i = halfLength; i < Math.min(halfLength + 20, words.length); i++) {
      const word = words[i];
      if (word.endsWith('.') || word.endsWith('!') || word.endsWith('?')) {
        breakPoint = i + 1;
        break;
      }
    }
    
    return words.slice(0, breakPoint).join(' ');
  };
  
  const displayContent = truncateContent(tripGuide.content);
  const isContentTruncated = shouldShowPartialContent && displayContent.length < tripGuide.content.length;
  
  // Static Alfie message - no more flickering
  const alfieMessage = "🦊 I know this destination well - prepared something special just for you!";

  // Enhanced UI for both flows (chips + accordions)
  type ParsedSection = { key: string; title: string; body: string };
  type ParsedFacts = {
    tripType?: string;
    tripLength?: string;
    season?: string;
    group?: string;
    style?: string;
  };

  const { facts, sections } = useMemo(() => {
    const lines = displayContent.split('\n').map(l => l.trim()).filter(Boolean);
    
    // Smart parsing based on flow type
    const parseInspireMeContent = () => {
      const sections: ParsedSection[] = [];
      let i = 0;
      
      while (i < lines.length) {
        const line = lines[i];
        // Only create accordions for main Adventure Ideas
        if (/^🏞️\s*Adventure Idea \d+:/.test(line)) {
          const title = line;
          const key = title.toLowerCase().replace(/[^a-z0-9]+/gi, '-');
          const bodyLines: string[] = [];
          i++;
          
          // Collect everything until next Adventure Idea or end
          while (i < lines.length && !/^🏞️\s*Adventure Idea \d+:/.test(lines[i])) {
            bodyLines.push(lines[i]);
            i++;
          }
          
          sections.push({ key, title, body: bodyLines.join('\n').trim() });
          continue;
        }
        i++;
      }
      
      return sections;
    };
    
    const parsePlanningContent = () => {
      const knownHeaders = [
        '🌄 Why This Route Works',
        '✈️ Travel Snapshot', 
        '🚗 Recommended Transportation',
        '🧳 What to Book Now',
        '🥾 Outdoor Activities to Prioritize',
        '🏛️ Top Cultural Experiences',
        "🧠 Things You Maybe Haven't Thought Of",
        '🧭 The Approach: Flexible Itinerary Flow'
      ];
      const isHeader = (line: string) => knownHeaders.some(h => line.startsWith(h));
      
      const sections: ParsedSection[] = [];
      let i = 0;
      
      while (i < lines.length) {
        const line = lines[i];
        if (isHeader(line)) {
          const title = line;
          const key = title.toLowerCase().replace(/[^a-z0-9]+/gi, '-');
          const bodyLines: string[] = [];
          i++;
          while (i < lines.length && !isHeader(lines[i])) {
            bodyLines.push(lines[i]);
            i++;
          }
          sections.push({ key, title, body: bodyLines.join('\n').trim() });
          continue;
        }
        i++;
      }
      
      return sections;
    };

    // Extract facts from content (both flows)
    const facts: ParsedFacts = {};
    const factPatterns: Array<[keyof ParsedFacts, RegExp[]]> = [
      ['tripType', [/^Trip\s*Type[:\s]+(.+)/i]],
      ['tripLength', [/^Trip\s*Length[:\s]+(.+)/i]],
      ['season', [/^Season[:\s]+(.+)/i]],
      ['group', [/^Group[:\s]+(.+)/i]],
      ['style', [/^Style[:\s]+(.+)/i]],
    ];

    for (const line of lines) {
      for (const [key, patterns] of factPatterns) {
        for (const re of patterns) {
          const m = line.match(re);
          if (m && !facts[key]) {
            facts[key] = m[1].trim();
          }
        }
      }
    }

    // Parse sections based on flow type
    const sections = tripGuide.flowType === 'inspire-me' 
      ? parseInspireMeContent() 
      : parsePlanningContent();

    return { facts, sections };
  }, [displayContent]);

  const toggleSection = (key: string) => {
    setOpenSections(prev => {
      const wasOpen = prev[key];
      const newState = { ...prev, [key]: !wasOpen };
      
      // Count newly opened accordions for email gate trigger
      if (!wasOpen) { // Just opened
        setOpenedAccordionsCount(current => current + 1);
      }
      
      return newState;
    });
  };

  const getSectionClass = (title: string): string => {
    // Все секции теперь используют единый стиль
    return 'alfie-section-standard';
  };
  
  // No scroll blocking - let users scroll freely, inline email appears at 30%

  return (
    <div className={`alfie-guide-container ${className}`}>
      <div
        ref={containerRef}
        className="alfie-guide-scroll-area"
      >
        <article className="alfie-guide-article">

          {/* Trip Guide Header */}
          <header className="alfie-guide-header">
            <h1 className="alfie-guide-title">
              {tripGuide.title}
            </h1>
          </header>


          {/* Teaser facts (chips) for both flows */}
          {(facts.tripType || facts.tripLength || facts.season || facts.group || facts.style) && (
            <div className="alfie-guide-meta-chips">
              {facts.tripType && <span className="alfie-chip chip-triptype">{facts.tripType}</span>}
              {facts.tripLength && <span className="alfie-chip chip-triplength">{facts.tripLength}</span>}
              {facts.season && <span className="alfie-chip chip-season">{facts.season}</span>}
              {facts.group && <span className="alfie-chip chip-group">{facts.group}</span>}
              {facts.style && <span className="alfie-chip chip-style">{facts.style}</span>}
            </div>
          )}

          {/* Trip Guide Content */}
          <div style={{ position: 'relative' }}>
            {sections.length > 0 ? (
              <div className="alfie-accordion">
                {sections.filter(s => s.title.startsWith('🌄')).map(s => (
                  <div key={s.key} className="alfie-accordion-item open">
                    <div className="alfie-accordion-header">
                      <span className="alfie-accordion-title">{s.title}</span>
                    </div>
                    <div className={`alfie-accordion-body ${getSectionClass(s.title)}`}>
                      <AIContentRenderer content={s.body} />
                    </div>
                  </div>
                ))}

                {sections.filter(s => !s.title.startsWith('🌄')).map(s => (
                  <div key={s.key} className={`alfie-accordion-item ${openSections[s.key] ? 'open' : ''}`}>
                    <button type="button" className="alfie-accordion-header" onClick={() => toggleSection(s.key)}>
                      <span className="alfie-accordion-title">{s.title}</span>
                      <span className={`alfie-accordion-chevron ${openSections[s.key] ? 'rotated' : ''}`}>⌄</span>
                    </button>
                    {openSections[s.key] && (
                      <div className={`alfie-accordion-body ${getSectionClass(s.title)}`}>
                        <AIContentRenderer content={s.body} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <AIContentRenderer content={displayContent} />
            )}
            
            {/* Fade overlay when showing partial content */}
            {isContentTruncated && (
              <div 
                className="tw-absolute tw-inset-x-0 tw-bottom-0 tw-h-24 tw-bg-gradient-to-t tw-from-white tw-to-transparent tw-pointer-events-none"
                style={{ marginBottom: '-1px' }}
              />
            )}

            {/* Inline Email Gate - appears within content flow at 30% */}
            {emailGateState.isVisible && (
              <InlineEmailGate
                onEmailSubmit={handleEmailSubmit}
                isSubmitting={emailGateState.isSubmitting}
                tripGuide={tripGuide}
                onSuccess={handleEmailSuccess}
              />
            )}
            
          </div>

        </article>
      </div>

    </div>
  );
}