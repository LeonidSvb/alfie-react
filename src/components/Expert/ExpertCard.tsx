import React from 'react';
import { Expert, ExpertCardProps } from '@/types/expert';

export default function ExpertCard({
  expert,
  matchScore,
  onContactClick,
  className = '',
  showMatchScore = false
}: ExpertCardProps) {
  const handleContactClick = () => {
    if (onContactClick) {
      onContactClick(expert);
    } else if (expert.link) {
      window.open(expert.link, '_blank', 'noopener,noreferrer');
    }
  };

  const formatMatchScore = (score: number) => {
    return Math.round(score * 100);
  };

  return (
    <div className={`alfie-expert-card ${className}`}>
      <div className="alfie-expert-header">
        {expert.avatar && (
          <div className="alfie-expert-avatar">
            <img 
              src={expert.avatar} 
              alt={`${expert.name} profile`}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}
        <div className="alfie-expert-info">
          <h3 className="alfie-expert-name">{expert.name}</h3>
          {expert.location && (
            <p className="alfie-expert-location">📍 {expert.location}</p>
          )}
          {expert.rating && expert.reviewCount && (
            <div className="alfie-expert-rating">
              ⭐ {expert.rating} ({expert.reviewCount} reviews)
            </div>
          )}
          {showMatchScore && matchScore && (
            <div className="alfie-match-score">
              🎯 {formatMatchScore(matchScore)}% match
            </div>
          )}
        </div>
      </div>

      <div className="alfie-expert-content">
        <p className="alfie-expert-description">{expert.description}</p>
        
        {expert.specialties.length > 0 && (
          <div className="alfie-expert-specialties">
            <span className="alfie-label">Specialties:</span>
            <div className="alfie-tags">
              {expert.specialties.map((specialty, index) => (
                <span key={index} className="alfie-tag">{specialty}</span>
              ))}
            </div>
          </div>
        )}

        {expert.languages && expert.languages.length > 0 && (
          <div className="alfie-expert-languages">
            <span className="alfie-label">Languages:</span>
            <span>{expert.languages.join(', ')}</span>
          </div>
        )}
      </div>

      <div className="alfie-expert-actions">
        <button 
          className="alfie-contact-expert-btn"
          onClick={handleContactClick}
          type="button"
        >
          Get in Touch
        </button>
      </div>

      <style jsx>{`
        .alfie-expert-card {
          background: white;
          border-radius: 16px;
          padding: 24px;
          margin: 20px 0;
          border: 2px solid var(--alfie-dark-green, #D4EDD4);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .alfie-expert-header {
          display: flex;
          align-items: flex-start;
          margin-bottom: 16px;
          gap: 16px;
        }

        .alfie-expert-avatar {
          flex-shrink: 0;
        }

        .alfie-expert-avatar img {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid var(--alfie-green, #4A8B5C);
        }

        .alfie-expert-info {
          flex: 1;
        }

        .alfie-expert-name {
          font-size: 20px;
          font-weight: 700;
          color: var(--alfie-text, #2E4B3E);
          margin: 0 0 4px 0;
        }

        .alfie-expert-location {
          font-size: 14px;
          color: var(--alfie-text-light, #4A6741);
          margin: 0 0 4px 0;
        }

        .alfie-expert-rating {
          font-size: 14px;
          color: var(--alfie-text-light, #4A6741);
          margin: 0 0 4px 0;
        }

        .alfie-match-score {
          font-size: 14px;
          font-weight: 600;
          color: var(--alfie-green, #4A8B5C);
          margin: 4px 0;
        }

        .alfie-expert-content {
          margin-bottom: 20px;
        }

        .alfie-expert-description {
          font-size: 15px;
          line-height: 1.5;
          color: var(--alfie-text, #2E4B3E);
          margin: 0 0 16px 0;
        }

        .alfie-expert-specialties,
        .alfie-expert-languages {
          margin-bottom: 12px;
        }

        .alfie-label {
          font-size: 14px;
          font-weight: 600;
          color: var(--alfie-text, #2E4B3E);
          display: block;
          margin-bottom: 6px;
        }

        .alfie-tags {
          display: flex;
          flex-wrap: wrap;
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

        .alfie-expert-languages span:last-child {
          font-size: 14px;
          color: var(--alfie-text-light, #4A6741);
        }

        .alfie-expert-actions {
          text-align: center;
        }

        .alfie-contact-expert-btn {
          background: var(--alfie-green, #4A8B5C);
          color: white;
          border: none;
          padding: 14px 32px;
          font-size: 16px;
          font-weight: 600;
          border-radius: 25px;
          cursor: pointer;
          transition: all 0.2s ease;
          text-decoration: none;
          display: inline-block;
          font-family: inherit;
        }

        .alfie-contact-expert-btn:hover {
          background: var(--alfie-text, #2E4B3E);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(74, 139, 92, 0.3);
        }

        .alfie-contact-expert-btn:active {
          transform: translateY(0);
        }

        @media (max-width: 480px) {
          .alfie-expert-card {
            padding: 20px;
          }

          .alfie-expert-header {
            gap: 12px;
          }

          .alfie-expert-avatar img {
            width: 56px;
            height: 56px;
          }

          .alfie-expert-name {
            font-size: 18px;
          }

          .alfie-contact-expert-btn {
            padding: 12px 24px;
            font-size: 15px;
          }
        }
      `}</style>
    </div>
  );
}