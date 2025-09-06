'use client';

import React, { useState } from 'react';

export interface EmailFormProps {
  onSubmit: (email: string, name?: string) => void;
  isSubmitting: boolean;
  error?: string;
  className?: string;
}

export default function EmailForm({
  onSubmit,
  isSubmitting,
  error,
  className = ''
}: EmailFormProps): JSX.Element {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [emailError, setEmailError] = useState('');

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
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

    onSubmit(
      email.trim(),
      name.trim() || undefined
    );
  };

  return (
    <form onSubmit={handleSubmit} className={`tw-w-full ${className}`}>
      <div className="tw-space-y-4">
        {/* Email Field */}
        <div>
          <label 
            htmlFor="email" 
            className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-1"
          >
            Email Address *
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="tw-w-full tw-px-3 tw-py-2 tw-border tw-border-gray-300 tw-rounded-md tw-shadow-sm tw-focus:outline-none tw-focus:ring-2 tw-focus:ring-green-500 tw-focus:border-transparent"
            placeholder="your@email.com"
            required
            disabled={isSubmitting}
          />
          {emailError && (
            <p className="tw-mt-1 tw-text-sm tw-text-red-600">{emailError}</p>
          )}
        </div>

        {/* Name Field */}
        <div>
          <label 
            htmlFor="name" 
            className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-1"
          >
            Name *
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="tw-w-full tw-px-3 tw-py-2 tw-border tw-border-gray-300 tw-rounded-md tw-shadow-sm tw-focus:outline-none tw-focus:ring-2 tw-focus:ring-green-500 tw-focus:border-transparent"
            placeholder="Your name"
            required
            disabled={isSubmitting}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="tw-bg-red-50 tw-border tw-border-red-200 tw-rounded-md tw-p-3">
            <p className="tw-text-sm tw-text-red-600">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || !email.trim() || !name.trim()}
          className="tw-w-full tw-bg-green-600 tw-text-white tw-py-2 tw-px-4 tw-rounded-md tw-font-medium tw-hover:bg-green-700 tw-focus:outline-none tw-focus:ring-2 tw-focus:ring-green-500 tw-focus:ring-offset-2 tw-transition-colors tw-duration-200 disabled:tw-opacity-50 disabled:tw-cursor-not-allowed"
        >
          {isSubmitting ? (
            <span className="tw-flex tw-items-center tw-justify-center">
              <svg className="tw-animate-spin tw--ml-1 tw-mr-2 tw-h-4 tw-w-4 tw-text-white" fill="none" viewBox="0 0 24 24">
                <circle className="tw-opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="tw-opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Unlocking...
            </span>
          ) : (
            'Unlock'
          )}
        </button>

      </div>
    </form>
  );
}