'use client';

import React, { useState } from 'react';
import { EmailSubmissionData } from '@/types/crm';
import { TripGuide } from '@/types/tripGuide';

export interface InlineEmailGateProps {
  onEmailSubmit: (data: EmailSubmissionData) => void;
  isSubmitting: boolean;
  tripGuide: TripGuide;
  onSuccess?: () => void;
}

export default function InlineEmailGate({
  onEmailSubmit,
  isSubmitting,
  tripGuide,
  onSuccess
}: InlineEmailGateProps): JSX.Element {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [emailError, setEmailError] = useState('');
  const [showThankYou, setShowThankYou] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');

    if (!email.trim()) {
      setEmailError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    if (!name.trim()) {
      setEmailError('Name is required');
      return;
    }

    const submissionData: EmailSubmissionData = {
      email: email.trim(),
      firstName: name.trim(),
      lastName: undefined,
      questionnaireSummary: tripGuide.questionnaireSummary,
      flowType: tripGuide.flowType,
      tripGuideId: tripGuide.id,
      tags: tripGuide.tags,
      submittedAt: new Date()
    };

    onEmailSubmit(submissionData);
  };

  // Show thank you briefly after submission
  React.useEffect(() => {
    if (!isSubmitting && email && name) {
      // Check if submission was successful (no longer submitting but form was submitted)
      const wasSubmitted = sessionStorage.getItem(`tripguide-email-submitted-${tripGuide.id}`) === 'true';
      if (wasSubmitted) {
        setShowThankYou(true);
        setTimeout(() => {
          onSuccess?.();
        }, 1500); // Show thank you for 1.5 seconds
      }
    }
  }, [isSubmitting, email, name, tripGuide.id, onSuccess]);

  if (showThankYou) {
    return (
      <div className="alfie-inline-email-thankyou">
        <p>Thank you! Unlocking your complete guide...</p>
      </div>
    );
  }

  return (
    <div className="alfie-inline-email-gate">
      <div className="alfie-inline-email-overlay" />
      <div className="alfie-inline-email-form-container">
        <div className="alfie-inline-email-header">
          <h3>🔓 Unlock Your Complete Guide</h3>
          <p>Enter your details to access the full trip plan</p>
        </div>
        <form onSubmit={handleSubmit} className="alfie-inline-email-form">
          <div className="alfie-inline-email-fields">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
              disabled={isSubmitting}
              className="alfie-inline-email-input"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              disabled={isSubmitting}
              className="alfie-inline-email-input"
            />
          </div>
          
          {emailError && (
            <p className="alfie-inline-email-error">{emailError}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting || !email.trim() || !name.trim()}
            className="alfie-inline-email-button"
          >
            {isSubmitting ? 'Unlocking...' : 'Unlock'}
          </button>
        </form>
      </div>
    </div>
  );
}