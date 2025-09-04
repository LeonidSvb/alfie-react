import React from 'react';
import { Button, Avatar } from '@/components/ui';

interface ExpertData {
  id: string;
  name: string;
  bio: string;
  image: string;
  contactLink: string;
  rating: number;
  reviewCount: number;
  score: number;
  matchReasons: string[];
  specialties: string[];
  locations: string[];
  languages: string[];
}

interface ExpertCardProps {
  expert: ExpertData;
  onConnect?: (expert: ExpertData) => void;
  className?: string;
}

const ExpertCard: React.FC<ExpertCardProps> = ({
  expert,
  onConnect,
  className = ''
}) => {
  const handleConnect = () => {
    if (onConnect) {
      onConnect(expert);
    } else {
      // Default behavior - open contact link
      if (expert.contactLink) {
        window.open(expert.contactLink, '_blank', 'noopener,noreferrer');
      }
    }
  };

  return (
    <div className={`bg-white rounded-18 p-5 shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md hover:scale-[1.02] ${className}`}>
      {/* Expert Header */}
      <div className="flex items-start gap-4 mb-4">
        <Avatar 
          src={expert.image || '/images/default-expert.jpg'} 
          alt={expert.name}
          size="md" 
        />
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-alfie-text font-semibold text-base leading-tight">
              {expert.name}
            </h3>
            {expert.score > 0 && (
              <span className="bg-alfie-green text-white text-xs font-medium px-2 py-1 rounded-full">
                {expert.score}% match
              </span>
            )}
          </div>
          
          {/* Match Reasons */}
          {expert.matchReasons && expert.matchReasons.length > 0 && (
            <p className="text-alfie-text-light text-sm mb-2 leading-relaxed">
              {expert.matchReasons[0]}
            </p>
          )}
          
          {/* Rating */}
          {expert.rating > 0 && (
            <div className="flex items-center gap-1">
              <span className="text-yellow-500 text-sm">⭐</span>
              <span className="text-alfie-text-light text-xs font-medium">
                {expert.rating} ({expert.reviewCount || 0} reviews)
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Specialties */}
      {expert.specialties && expert.specialties.length > 0 && (
        <div className="mb-4">
          <h4 className="text-alfie-text text-xs font-medium mb-2 uppercase tracking-wide">
            Specialties
          </h4>
          <div className="flex flex-wrap gap-1">
            {expert.specialties.slice(0, 4).map((specialty, index) => (
              <span 
                key={index}
                className="bg-alfie-light-green text-alfie-text text-xs px-2 py-1 rounded-full"
              >
                {specialty.replace('activity_', '').replace('_', ' ')}
              </span>
            ))}
            {expert.specialties.length > 4 && (
              <span className="text-alfie-text-light text-xs px-2 py-1">
                +{expert.specialties.length - 4} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Locations */}
      {expert.locations && expert.locations.length > 0 && (
        <div className="mb-4">
          <h4 className="text-alfie-text text-xs font-medium mb-2 uppercase tracking-wide">
            Locations
          </h4>
          <p className="text-alfie-text-light text-xs leading-relaxed">
            {expert.locations.slice(0, 3)
              .map(loc => loc.replace('region_', '').replace('country_', '').replace('dest_', '').replace('_', ' '))
              .join(', ')}
            {expert.locations.length > 3 && ` +${expert.locations.length - 3} more`}
          </p>
        </div>
      )}

      {/* Languages */}
      {expert.languages && expert.languages.length > 0 && (
        <div className="mb-4">
          <div className="flex justify-between items-center text-xs">
            <div>
              <span className="text-alfie-text font-medium">Languages: </span>
              <span className="text-alfie-text-light">
                {expert.languages.slice(0, 2)
                  .map(lang => lang.replace('lang_', ''))
                  .join(', ')}
                {expert.languages.length > 2 && ` +${expert.languages.length - 2} more`}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Bio Preview */}
      {expert.bio && (
        <div className="mb-4">
          <p className="text-alfie-text-light text-xs leading-relaxed line-clamp-2">
            {expert.bio.length > 120 ? `${expert.bio.substring(0, 120)}...` : expert.bio}
          </p>
        </div>
      )}

      {/* Connect Button */}
      <Button
        variant="expert"
        size="sm"
        onClick={handleConnect}
        className="w-full text-center justify-center"
      >
        Connect with {expert.name.split(' ')[0]}
      </Button>
    </div>
  );
};

export default ExpertCard;