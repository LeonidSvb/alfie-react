import React, { useState, useEffect } from 'react';
import { Expert, ExpertMatchingProps, ExpertMatchResponse } from '@/types/expert';
import ExpertCard from './ExpertCard';

export default function ExpertMatching({
  questionnaireSummary,
  flowType,
  userTags,
  onExpertFound
}: ExpertMatchingProps) {
  const [expert, setExpert] = useState<Expert | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [matchScore, setMatchScore] = useState<number | undefined>();
  const [tagsUsed, setTagsUsed] = useState<string[]>([]);

  useEffect(() => {
    matchExpert();
  }, [questionnaireSummary, flowType, userTags]);

  const matchExpert = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/match-expert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          questionnaireSummary,
          flowType,
          userTags,
        }),
      });

      const data: ExpertMatchResponse = await response.json();

      if (data.success && data.expert) {
        setExpert(data.expert);
        setMatchScore(data.matchScore);
        setTagsUsed(data.tagsUsed || []);
        
        if (onExpertFound) {
          onExpertFound(data.expert);
        }
      } else {
        setError(data.error || 'No expert found for your preferences');
      }
    } catch (err) {
      console.error('Error matching expert:', err);
      setError('Failed to find a matching expert. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="alfie-expert-matching">
        <div className="alfie-loading-container">
          <div className="alfie-loading-spinner"></div>
          <p className="alfie-loading-text">Finding your perfect travel expert...</p>
        </div>

        <style jsx>{`
          .alfie-expert-matching {
            margin: 24px 0;
          }

          .alfie-loading-container {
            text-align: center;
            padding: 40px 20px;
          }

          .alfie-loading-spinner {
            width: 40px;
            height: 40px;
            border: 4px solid var(--alfie-dark-green, #D4EDD4);
            border-top: 4px solid var(--alfie-green, #4A8B5C);
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 16px;
          }

          .alfie-loading-text {
            color: var(--alfie-text, #2E4B3E);
            font-size: 16px;
            font-weight: 500;
            margin: 0;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alfie-expert-matching">
        <div className="alfie-error-container">
          <div className="alfie-error-icon">⚠️</div>
          <h3 className="alfie-error-title">Expert Matching Unavailable</h3>
          <p className="alfie-error-message">{error}</p>
          <button 
            className="alfie-retry-btn"
            onClick={matchExpert}
            type="button"
          >
            Try Again
          </button>
        </div>

        <style jsx>{`
          .alfie-expert-matching {
            margin: 24px 0;
          }

          .alfie-error-container {
            text-align: center;
            padding: 32px 20px;
            background: #FFF8F0;
            border-radius: 16px;
            border: 2px solid #FFE4B5;
          }

          .alfie-error-icon {
            font-size: 32px;
            margin-bottom: 12px;
          }

          .alfie-error-title {
            color: var(--alfie-text, #2E4B3E);
            font-size: 18px;
            font-weight: 600;
            margin: 0 0 8px 0;
          }

          .alfie-error-message {
            color: var(--alfie-text-light, #4A6741);
            font-size: 14px;
            margin: 0 0 20px 0;
            line-height: 1.4;
          }

          .alfie-retry-btn {
            background: var(--alfie-green, #4A8B5C);
            color: white;
            border: none;
            padding: 10px 20px;
            font-size: 14px;
            font-weight: 500;
            border-radius: 20px;
            cursor: pointer;
            transition: background 0.2s ease;
            font-family: inherit;
          }

          .alfie-retry-btn:hover {
            background: var(--alfie-text, #2E4B3E);
          }
        `}</style>
      </div>
    );
  }

  if (!expert) {
    return null;
  }

  return (
    <div className="alfie-expert-matching">
      <div className="alfie-expert-intro">
        <h3 className="alfie-expert-intro-title">🎯 Your Travel Expert Match</h3>
        <p className="alfie-expert-intro-text">
          Based on your preferences, we've found the perfect expert to help plan your trip!
        </p>
        {tagsUsed.length > 0 && (
          <div className="alfie-tags-used">
            <span className="alfie-tags-label">Matched on:</span>
            <div className="alfie-tags-list">
              {tagsUsed.map((tag, index) => (
                <span key={index} className="alfie-tag">{tag}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      <ExpertCard
        expert={expert}
        matchScore={matchScore}
        showMatchScore={true}
        onContactClick={(expert) => {
          if (expert.link) {
            window.open(expert.link, '_blank', 'noopener,noreferrer');
          }
        }}
      />

      <style jsx>{`
        .alfie-expert-matching {
          margin: 32px 0;
        }

        .alfie-expert-intro {
          text-align: center;
          margin-bottom: 24px;
        }

        .alfie-expert-intro-title {
          font-size: 20px;
          font-weight: 700;
          color: var(--alfie-text, #2E4B3E);
          margin: 0 0 8px 0;
        }

        .alfie-expert-intro-text {
          font-size: 15px;
          color: var(--alfie-text-light, #4A6741);
          margin: 0 0 16px 0;
          line-height: 1.5;
        }

        .alfie-tags-used {
          margin-top: 16px;
        }

        .alfie-tags-label {
          font-size: 14px;
          font-weight: 500;
          color: var(--alfie-text, #2E4B3E);
          display: block;
          margin-bottom: 8px;
        }

        .alfie-tags-list {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 6px;
        }

        .alfie-tag {
          background: var(--alfie-dark-green, #D4EDD4);
          color: var(--alfie-text, #2E4B3E);
          padding: 4px 12px;
          border-radius: 16px;
          font-size: 13px;
          font-weight: 500;
        }

        @media (max-width: 480px) {
          .alfie-expert-intro-title {
            font-size: 18px;
          }

          .alfie-expert-intro-text {
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
}