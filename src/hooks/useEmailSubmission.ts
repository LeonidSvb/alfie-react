import { useState, useEffect } from 'react';
import { EmailGateState } from '@/types/crm';

export interface UseEmailSubmissionResult {
  emailGateState: EmailGateState;
  setEmailGateState: React.Dispatch<React.SetStateAction<EmailGateState>>;
  hasSubmittedForGuide: (guideId: string) => boolean;
  markGuideAsSubmitted: (guideId: string) => void;
  clearSubmissionData: (guideId?: string) => void;
}

const STORAGE_PREFIX = 'tripguide-email-submitted';

export function useEmailSubmission(initialGuideId?: string): UseEmailSubmissionResult {
  const [emailGateState, setEmailGateState] = useState<EmailGateState>({
    isVisible: false,
    isSubmitting: false,
    hasSubmitted: false,
    error: undefined
  });

  // Check if email was submitted for the initial guide
  useEffect(() => {
    if (initialGuideId) {
      const hasSubmitted = hasSubmittedForGuide(initialGuideId);
      setEmailGateState(prev => ({ ...prev, hasSubmitted }));
    }
  }, [initialGuideId]);

  const hasSubmittedForGuide = (guideId: string): boolean => {
    try {
      const storageKey = `${STORAGE_PREFIX}-${guideId}`;
      return sessionStorage.getItem(storageKey) === 'true';
    } catch {
      // SessionStorage not available (SSR)
      return false;
    }
  };

  const markGuideAsSubmitted = (guideId: string): void => {
    try {
      const storageKey = `${STORAGE_PREFIX}-${guideId}`;
      sessionStorage.setItem(storageKey, 'true');
      
      // Also track submission timestamp for analytics
      const timestampKey = `${STORAGE_PREFIX}-timestamp-${guideId}`;
      sessionStorage.setItem(timestampKey, new Date().toISOString());
      
    } catch (error) {
      console.warn('Failed to save email submission state:', error);
    }
  };

  const clearSubmissionData = (guideId?: string): void => {
    try {
      if (guideId) {
        // Clear specific guide data
        const storageKey = `${STORAGE_PREFIX}-${guideId}`;
        const timestampKey = `${STORAGE_PREFIX}-timestamp-${guideId}`;
        sessionStorage.removeItem(storageKey);
        sessionStorage.removeItem(timestampKey);
      } else {
        // Clear all submission data
        const keysToRemove: string[] = [];
        for (let i = 0; i < sessionStorage.length; i++) {
          const key = sessionStorage.key(i);
          if (key?.startsWith(STORAGE_PREFIX)) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach(key => sessionStorage.removeItem(key));
      }
    } catch (error) {
      console.warn('Failed to clear email submission state:', error);
    }
  };

  return {
    emailGateState,
    setEmailGateState,
    hasSubmittedForGuide,
    markGuideAsSubmitted,
    clearSubmissionData
  };
}