'use client';

import React, { useRef, useState, useEffect, useMemo } from 'react';
import { TripGuideDisplayProps } from '@/types/tripGuide';
import { EmailSubmissionData, CRMSubmissionResponse, EmailGateState } from '@/types/crm';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import EmailGate from '@/components/EmailCollection/EmailGate';
import AIContentRenderer from './AIContentRenderer';

const EMAIL_GATE_SCROLL_THRESHOLD = 50; // Show email gate when trying to scroll beyond visible area

export default function TripGuideDisplay({
  tripGuide,
  onEmailSubmit,
  className = ''
}: TripGuideDisplayProps): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollProgress, hasReached } = useScrollProgress(containerRef);

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

  // No automatic email gate - only show when user tries to scroll beyond visible area

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

    const facts: ParsedFacts = {};
    const sections: ParsedSection[] = [];

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

    return { facts, sections };
  }, [displayContent]);

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const toggleSection = (key: string) => setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));

  const getSectionClass = (title: string): string => {
    // Все секции теперь используют единый стиль
    return 'alfie-section-standard';
  };
  
  // Handle scroll blocking - prevent scrolling beyond visible area until email submitted
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (!shouldShowPartialContent) return; // Allow full scroll if submitted
    
    const container = e.currentTarget;
    const scrollTop = container.scrollTop;
    
    // Block any scrolling attempts and show email gate
    if (scrollTop > EMAIL_GATE_SCROLL_THRESHOLD && !emailGateState.isVisible) {
      container.scrollTop = EMAIL_GATE_SCROLL_THRESHOLD;
      setEmailGateState(prev => ({ ...prev, isVisible: true }));
    }
  };

  return (
    <div className={`alfie-guide-container ${className}`}>
      <div
        ref={containerRef}
        className="alfie-guide-scroll-area"
        onScroll={handleScroll}
      >
        <article className="alfie-guide-article">
          {/* Alfie Avatar - small and at top */}
          <div className="alfie-avatar-small">
            <img src="https://framerusercontent.com/images/QiR33rqvTTyMw1FMaD9BeYrno9o.png" alt="Alfie" />
          </div>

          {/* Trip Guide Header */}
          <header className="alfie-guide-header">
            <h1 className="alfie-guide-title">
              {tripGuide.title}
            </h1>
            <div className="alfie-guide-tags">
              {tripGuide.tags.slice(0, 3).map((tag, index) => (
                <span key={index} className="alfie-guide-tag">
                  {tag}
                </span>
              ))}
            </div>
          </header>

          {/* Alfie Personal Message */}
          <div className="alfie-personal-message">
            <div className="alfie-message-bubble">
              {alfieMessage}
            </div>
          </div>

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
            
            {/* Email gate call-to-action when truncated */}
            {isContentTruncated && (
              <div className="tw-text-center tw-py-6 tw-border-t tw-border-gray-200 tw-bg-gray-50 tw-rounded-lg tw-mt-4">
                <div className="tw-flex tw-items-center tw-justify-center tw-mb-3">
                  <span className="tw-text-2xl tw-mr-2">🔒</span>
                  <span className="tw-text-lg tw-font-semibold tw-text-gray-700">
                    More content locked
                  </span>
                </div>
                <p className="tw-text-gray-600 tw-mb-4">
                  You're seeing 50% of your personalized guide. 
                  Enter your email to unlock the complete adventure plan!
                </p>
                <button
                  onClick={() => setEmailGateState(prev => ({ ...prev, isVisible: true }))}
                  className="tw-bg-green-600 tw-text-white tw-px-6 tw-py-3 tw-rounded-md tw-font-medium tw-hover:bg-green-700 tw-transition-colors tw-shadow-lg"
                >
                  Unlock Full Guide
                </button>
              </div>
            )}
            
          </div>

          {/* Trip Guide Footer */}
          <footer className="tw-mt-8 tw-pt-6 tw-border-t tw-border-gray-200">
            <div className="tw-text-xs tw-text-gray-500 tw-text-center">
              Generated by Alfie 🦊 • {new Date(tripGuide.generatedAt).toLocaleDateString()}
            </div>
          </footer>
        </article>
      </div>

      {/* Email Gate Modal */}
      <EmailGate
        isVisible={emailGateState.isVisible}
        onEmailSubmit={handleEmailSubmit}
        isSubmitting={emailGateState.isSubmitting}
        tripGuide={tripGuide}
        onClose={handleCloseEmailGate}
      />

      {/* Progress indicator */}
      <div className="alfie-guide-progress">
        <div 
          className="alfie-guide-progress-bar"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

    </div>
  );
}