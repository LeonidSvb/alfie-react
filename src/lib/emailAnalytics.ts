export interface EmailSubmissionAnalytics {
  guideId: string;
  flowType: 'inspire-me' | 'i-know-where';
  scrollPercentageWhenGateShown: number;
  scrollPercentageWhenSubmitted: number;
  timeToSubmit: number; // milliseconds
  submittedAt: Date;
  sessionId: string;
}

class EmailAnalyticsTracker {
  private gateShowTimes: Map<string, number> = new Map();
  private scrollPercentages: Map<string, number> = new Map();
  private sessionId: string;

  constructor() {
    this.sessionId = this.generateSessionId();
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  trackEmailGateShown(guideId: string, scrollPercentage: number): void {
    this.gateShowTimes.set(guideId, Date.now());
    this.scrollPercentages.set(`${guideId}-gate-shown`, scrollPercentage);
    
    // Optional: Send analytics event
    this.sendAnalyticsEvent('email_gate_shown', {
      guide_id: guideId,
      scroll_percentage: scrollPercentage,
      session_id: this.sessionId
    });
  }

  trackEmailSubmitted(
    guideId: string, 
    flowType: 'inspire-me' | 'i-know-where', 
    scrollPercentage: number
  ): EmailSubmissionAnalytics | null {
    const gateShownTime = this.gateShowTimes.get(guideId);
    const gateShownScrollPercentage = this.scrollPercentages.get(`${guideId}-gate-shown`);
    
    if (!gateShownTime || gateShownScrollPercentage === undefined) {
      return null;
    }

    const analytics: EmailSubmissionAnalytics = {
      guideId,
      flowType,
      scrollPercentageWhenGateShown: gateShownScrollPercentage,
      scrollPercentageWhenSubmitted: scrollPercentage,
      timeToSubmit: Date.now() - gateShownTime,
      submittedAt: new Date(),
      sessionId: this.sessionId
    };

    // Clean up stored data
    this.gateShowTimes.delete(guideId);
    this.scrollPercentages.delete(`${guideId}-gate-shown`);

    // Optional: Send analytics event
    this.sendAnalyticsEvent('email_submitted', {
      guide_id: guideId,
      flow_type: flowType,
      scroll_percentage_gate_shown: gateShownScrollPercentage,
      scroll_percentage_submitted: scrollPercentage,
      time_to_submit_ms: analytics.timeToSubmit,
      session_id: this.sessionId
    });

    // Store for potential future use
    try {
      const storageKey = `email-analytics-${guideId}`;
      sessionStorage.setItem(storageKey, JSON.stringify(analytics));
    } catch (error) {
      console.warn('Failed to store email submission analytics:', error);
    }

    return analytics;
  }

  trackEmailGateClosed(guideId: string, scrollPercentage: number): void {
    // Optional: Track when users close the gate without submitting
    this.sendAnalyticsEvent('email_gate_closed', {
      guide_id: guideId,
      scroll_percentage: scrollPercentage,
      session_id: this.sessionId
    });
  }

  private sendAnalyticsEvent(eventName: string, properties: Record<string, any>): void {
    // Placeholder for analytics integration
    // This could integrate with Google Analytics, Mixpanel, etc.
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, properties);
    }
    
    // For development, log to console
    if (process.env.NODE_ENV === 'development') {
      console.log(`Analytics: ${eventName}`, properties);
    }
  }

  getSessionAnalytics(): {
    sessionId: string;
    activeGates: string[];
    submissionCount: number;
  } {
    return {
      sessionId: this.sessionId,
      activeGates: Array.from(this.gateShowTimes.keys()),
      submissionCount: this.getSubmissionCount()
    };
  }

  private getSubmissionCount(): number {
    try {
      let count = 0;
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key?.startsWith('email-analytics-')) {
          count++;
        }
      }
      return count;
    } catch {
      return 0;
    }
  }
}

// Global analytics tracker instance
let analyticsTracker: EmailAnalyticsTracker | null = null;

export function getEmailAnalyticsTracker(): EmailAnalyticsTracker {
  if (!analyticsTracker) {
    analyticsTracker = new EmailAnalyticsTracker();
  }
  return analyticsTracker;
}

// Extend Window interface for gtag
declare global {
  interface Window {
    gtag?: (command: string, eventName: string, properties: Record<string, any>) => void;
  }
}