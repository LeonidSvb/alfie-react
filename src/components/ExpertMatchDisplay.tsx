'use client';

import React, { useState, useEffect } from 'react';

interface ExpertMatch {
  id: string;
  name: string;
  profession: string;
  email: string;
  shortBio: string;
  profileUrl: string;
  matchScore: number;
  matchedTags: string[];
}

interface ExpertMatchDisplayProps {
  answers: Record<string, any>;
  onClose?: () => void;
}

const ExpertMatchDisplay: React.FC<ExpertMatchDisplayProps> = ({ answers, onClose }) => {
  const [experts, setExperts] = useState<ExpertMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (answers && Object.keys(answers).length > 0) {
      fetchExperts();
    }
  }, [answers]);

  const fetchExperts = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/match-experts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answers }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setExperts(data.experts);
      } else {
        setError(data.error || 'Failed to fetch experts');
      }
    } catch (err) {
      console.error('Error fetching experts:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="expert-match-display">
        <div className="expert-loading">
          <div className="expert-spinner"></div>
          <p>Finding matching experts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="expert-match-display">
        <div className="expert-error">
          <h3>Unable to load experts</h3>
          <p>{error}</p>
          <button onClick={fetchExperts} className="expert-retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (experts.length === 0) {
    return (
      <div className="expert-match-display">
        <div className="expert-no-matches">
          <h3>No expert matches found</h3>
          <p>We couldn't find experts matching your specific criteria.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="expert-match-display">
      <div className="expert-header">
        <h3>🎯 Matched Travel Experts</h3>
        <p>We found {experts.length} experts who match your trip preferences:</p>
        {onClose && (
          <button onClick={onClose} className="expert-close-btn">×</button>
        )}
      </div>

      <div className="expert-list">
        {experts.map((expert) => (
          <div key={expert.id} className="expert-card">
            <div className="expert-card-header">
              <div className="expert-info">
                <h4>{expert.name}</h4>
                <p className="expert-profession">{expert.profession}</p>
                <div className="expert-match-score">
                  <span className="match-percentage">{expert.matchScore}% match</span>
                </div>
              </div>
            </div>

            <div className="expert-bio">
              <p>{expert.shortBio.substring(0, 200)}...</p>
            </div>

            <div className="expert-tags">
              {expert.matchedTags.slice(0, 3).map((tag, index) => (
                <span key={index} className="expert-tag">
                  {tag.replace(/_/g, ' ')}
                </span>
              ))}
            </div>

            <div className="expert-actions">
              {expert.profileUrl && (
                <a 
                  href={expert.profileUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="expert-profile-btn"
                >
                  View Profile
                </a>
              )}
              <a 
                href={`mailto:${expert.email}?subject=Travel Planning Inquiry`}
                className="expert-contact-btn"
              >
                Contact Expert
              </a>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .expert-match-display {
          background: white;
          border-radius: 8px;
          padding: 20px;
          margin: 20px 0;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .expert-header {
          position: relative;
          margin-bottom: 20px;
          text-align: center;
        }

        .expert-header h3 {
          color: #2d5a3d;
          margin: 0 0 8px 0;
          font-size: 1.3em;
        }

        .expert-header p {
          color: #666;
          margin: 0;
        }

        .expert-close-btn {
          position: absolute;
          top: -10px;
          right: -10px;
          background: #f0f0f0;
          border: none;
          border-radius: 50%;
          width: 30px;
          height: 30px;
          cursor: pointer;
          font-size: 18px;
          color: #666;
        }

        .expert-close-btn:hover {
          background: #e0e0e0;
        }

        .expert-loading {
          text-align: center;
          padding: 40px;
        }

        .expert-spinner {
          border: 3px solid #f3f3f3;
          border-top: 3px solid #2d5a3d;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
          margin: 0 auto 16px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .expert-error {
          text-align: center;
          padding: 20px;
          color: #d32f2f;
        }

        .expert-retry-btn {
          background: #2d5a3d;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 5px;
          cursor: pointer;
          margin-top: 10px;
        }

        .expert-no-matches {
          text-align: center;
          padding: 20px;
          color: #666;
        }

        .expert-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .expert-card {
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 16px;
          background: #fafafa;
        }

        .expert-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
        }

        .expert-info h4 {
          margin: 0 0 4px 0;
          color: #2d5a3d;
          font-size: 1.1em;
        }

        .expert-profession {
          margin: 0 0 8px 0;
          color: #666;
          font-size: 0.9em;
        }

        .expert-match-score {
          background: #e8f5e8;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 0.8em;
        }

        .match-percentage {
          color: #2d5a3d;
          font-weight: bold;
        }

        .expert-bio {
          margin: 12px 0;
          color: #555;
          font-size: 0.9em;
          line-height: 1.4;
        }

        .expert-tags {
          display: flex;
          gap: 6px;
          margin: 12px 0;
          flex-wrap: wrap;
        }

        .expert-tag {
          background: #e0f2e0;
          color: #2d5a3d;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 0.75em;
          text-transform: capitalize;
        }

        .expert-actions {
          display: flex;
          gap: 10px;
          margin-top: 16px;
        }

        .expert-profile-btn {
          background: transparent;
          color: #2d5a3d;
          border: 1px solid #2d5a3d;
          padding: 8px 16px;
          border-radius: 5px;
          text-decoration: none;
          font-size: 0.9em;
          transition: all 0.2s;
        }

        .expert-profile-btn:hover {
          background: #2d5a3d;
          color: white;
        }

        .expert-contact-btn {
          background: #2d5a3d;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 5px;
          text-decoration: none;
          font-size: 0.9em;
          transition: all 0.2s;
        }

        .expert-contact-btn:hover {
          background: #1e3d28;
        }
      `}</style>
    </div>
  );
};

export default ExpertMatchDisplay;