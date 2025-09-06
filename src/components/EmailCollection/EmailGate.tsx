'use client';

import React from 'react';
import { TripGuide } from '@/types/tripGuide';
import { EmailSubmissionData } from '@/types/crm';
import EmailForm from './EmailForm';

export interface EmailGateProps {
  isVisible: boolean;
  onEmailSubmit: (data: EmailSubmissionData) => void;
  isSubmitting: boolean;
  tripGuide: TripGuide;
  onClose?: () => void;
}

export default function EmailGate({
  isVisible,
  onEmailSubmit,
  isSubmitting,
  tripGuide,
  onClose
}: EmailGateProps): JSX.Element | null {
  if (!isVisible) return null;

  const handleFormSubmit = (email: string, name?: string) => {
    const submissionData: EmailSubmissionData = {
      email,
      firstName: name,
      lastName: undefined,
      questionnaireSummary: tripGuide.questionnaireSummary,
      flowType: tripGuide.flowType,
      tripGuideId: tripGuide.id,
      tags: tripGuide.tags,
      submittedAt: new Date()
    };

    onEmailSubmit(submissionData);
  };

  return (
    <div className="alfie-email-gate-overlay">
      <div className="alfie-email-gate-modal">
        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="alfie-email-gate-close"
            disabled={isSubmitting}
          >
            ✕
          </button>
        )}

        {/* Header */}
        <div className="alfie-email-gate-header">
          <div className="alfie-email-gate-icon">🔓</div>
          <h2 className="alfie-email-gate-title">Unlock Your Complete Guide</h2>
          <p className="alfie-email-gate-subtitle">
            To unlock the full guide, enter your name and email.
          </p>
        </div>

        {/* Content */}
        <div className="alfie-email-gate-content">

          <EmailForm
            onSubmit={handleFormSubmit}
            isSubmitting={isSubmitting}
            className="alfie-email-form"
          />

        </div>
      </div>
    </div>
  );
}