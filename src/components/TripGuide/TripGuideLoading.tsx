'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

interface TripGuideLoadingProps {
  message?: string;
  progress?: number;
  className?: string;
  userDestination?: string;
}

// Travel facts from React project
const genericFacts = [
  "🌍 Did you know? There are over 400 national parks worldwide!",
  "🏔️ Mount Everest grows about 4mm each year due to geological forces.",
  "🦊 Alfie has helped thousands of travelers discover their perfect outdoor adventures!",
  "🌲 A single large tree can provide a day's supply of oxygen for up to two people.",
  "🏕️ The word 'camping' comes from the Latin word 'campus' meaning field.",
  "🥾 The average hiker burns about 400-700 calories per hour on trails.",
  "🌊 Ocean waves can travel thousands of miles before reaching the shore.",
  "⭐ In truly dark skies, you can see up to 2,500 stars with the naked eye.",
  "🦎 Some desert animals never need to drink water - they get it all from their food!",
  "🏂 Snow is actually 90% trapped air, making it an excellent insulator.",
  "🐧 Antarctica is the world's largest desert - it's just covered in ice!",
  "🌋 There are over 1,500 active volcanoes in the world today.",
  "🦅 Golden eagles can spot prey from over 2 miles away.",
  "🏞️ Yellowstone was the world's first national park, established in 1872.",
  "🌿 Bamboo is the fastest-growing plant on Earth - some species grow 3 feet in 24 hours!",
  "🦋 Monarch butterflies migrate up to 3,000 miles - that's like flying from New York to California!",
  "🏕️ The northern lights are visible in both the Arctic and Antarctic - they're called aurora borealis in the north and aurora australis in the south.",
  "🐻 Polar bears have black skin under their white fur to help absorb heat from the sun."
];

// Destination-specific facts
const destinationFacts: Record<string, string[]> = {
  japan: [
    "🗾 Japan has over 6,800 islands, but only about 430 are inhabited!",
    "🌸 Cherry blossom season lasts only 1-2 weeks in each location.",
    "🗻 Mount Fuji is considered sacred and has been climbed by millions.",
    "♨️ Japan has over 27,000 hot springs scattered throughout the country."
  ],
  thailand: [
    "🏝️ Thailand has over 1,400 islands - you could visit a new one every day for years!",
    "🐘 Thailand is home to about 3,000-4,000 wild elephants.",
    "🌶️ Thai cuisine uses over 40 different types of chilies.",
    "🏛️ Thailand has over 40,000 Buddhist temples throughout the country."
  ],
  iceland: [
    "🌋 Iceland sits on the Mid-Atlantic Ridge, where two tectonic plates meet.",
    "💎 Iceland has no mosquitoes - it's one of the few places on Earth without them!",
    "♨️ About 85% of Iceland's houses are heated with geothermal energy.",
    "🌌 The Northern Lights are visible in Iceland from September to March."
  ],
  switzerland: [
    "🏔️ Switzerland has 48 peaks over 4,000 meters (13,123 feet) high.",
    "🚂 The Swiss railway system is so punctual, the average delay is just 3 minutes.",
    "🧀 Switzerland produces over 450 varieties of cheese.",
    "⛷️ The Alps cover about 60% of Switzerland's total land area."
  ]
};

export default function TripGuideLoading({ 
  message, 
  progress = 0, 
  className = '',
  userDestination
}: TripGuideLoadingProps): JSX.Element {
  const [currentFactIndex, setCurrentFactIndex] = useState(0);

  // Determine which facts to show based on destination
  const facts = React.useMemo(() => {
    if (!userDestination) return genericFacts;
    
    const destination = userDestination.toLowerCase();
    for (const [key, destinationSpecificFacts] of Object.entries(destinationFacts)) {
      if (destination.includes(key)) {
        return [...destinationSpecificFacts, ...genericFacts];
      }
    }
    
    return genericFacts;
  }, [userDestination]);

  // Rotate through facts every 7 seconds (like in React project)
  useEffect(() => {
    const factInterval = setInterval(() => {
      setCurrentFactIndex((prev) => (prev + 1) % facts.length);
    }, 7000);

    return () => clearInterval(factInterval);
  }, [facts.length]);

  return (
    <div className="alfie-embedded-chat" style={{ 
      maxWidth: '500px',
      margin: '0 auto',
      padding: '40px 30px',
      textAlign: 'center'
    }}>
      {/* Progress milestone like in ProgressBar */}
      <div className="alfie-progress-header" style={{ marginBottom: '20px' }}>
        <span className="alfie-progress-milestone">
          ✨ Creating your guide
        </span>
      </div>

      {/* Alfie Avatar with consistent styling */}
      <div style={{ 
        position: 'relative',
        width: '80px',
        height: '80px',
        margin: '0 auto 25px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* Main spinning border - matching progress bar style */}
        <div 
          style={{
            position: 'absolute',
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            border: '3px solid var(--alfie-dark-green)',
            borderTop: '3px solid var(--alfie-green)',
            animation: 'spin 1s linear infinite'
          }}
        />
        
        {/* Secondary ring for depth */}
        <div 
          style={{
            position: 'absolute',
            width: '68px',
            height: '68px',
            borderRadius: '50%',
            border: '1px solid var(--alfie-orange)',
            opacity: 0.6,
            animation: 'pulse 2s ease-in-out infinite'
          }}
        />
        
        {/* Alfie Avatar - matching main widget sizing */}
        <div style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          overflow: 'hidden',
          border: '2px solid white',
          background: 'white',
          boxShadow: '0 2px 8px rgba(74, 139, 92, 0.2)'
        }}>
          <Image
            src="/images/alfie-avatar.png"
            alt="Alfie Avatar"
            width={60}
            height={60}
            style={{
              borderRadius: '50%',
              objectFit: 'cover'
            }}
            onError={() => {
              console.log('Alfie avatar image failed to load');
            }}
          />
        </div>
      </div>

      {/* Loading message - matching Alfie greeting style */}
      <div className="alfie-greeting">
        <div className="alfie-greeting-bubble" style={{
          marginBottom: '20px',
          fontSize: '15px',
          fontWeight: '500'
        }}>
          {message || "I'm analyzing your preferences and crafting the perfect outdoor adventure just for you..."}
        </div>
      </div>

      {/* Fun Facts Card - using Alfie button styling */}
      <div className="alfie-answer-options" style={{
        gridTemplateColumns: '1fr',
        marginBottom: '0'
      }}>
        <div className="alfie-option-button" style={{
          background: 'var(--alfie-dark-green)',
          padding: '16px 20px',
          cursor: 'default',
          position: 'relative',
          overflow: 'hidden',
          border: '2px solid var(--alfie-green)',
          borderRadius: '20px'
        }}>
          {/* Decorative elements matching Alfie style */}
          <div style={{
            position: 'absolute',
            top: '8px',
            right: '12px',
            fontSize: '18px',
            opacity: 0.7,
            animation: 'bounce 2s infinite'
          }}>
            💡
          </div>
          
          {/* Fun Fact Label */}
          <div style={{
            fontSize: '12px',
            fontWeight: '600',
            color: 'var(--alfie-green)',
            textTransform: 'uppercase',
            letterSpacing: '0.8px',
            marginBottom: '8px'
          }}>
            Did you know?
          </div>
          
          {/* Fact Text - readable typography */}
          <div style={{
            color: 'var(--alfie-text)',
            fontSize: '14px',
            lineHeight: '1.5',
            fontWeight: '500',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            animation: 'factFadeIn 0.6s ease-in-out',
            paddingRight: '35px' // Space for emoji
          }}>
            {facts[currentFactIndex]}
          </div>
          
          {/* Progress dots at bottom */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '6px',
            marginTop: '12px'
          }}>
            {Array.from({ length: 3 }, (_, i) => (
              <div 
                key={i}
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: 'var(--alfie-green)',
                  opacity: 0.3,
                  animation: `pulse ${1.2 + i * 0.2}s ease-in-out infinite`
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* CSS animations - matching existing styles */}
      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0%, 100% { 
            opacity: 0.3;
            transform: scale(1);
          }
          50% { 
            opacity: 0.8;
            transform: scale(1.1);
          }
        }
        
        @keyframes factFadeIn {
          from { 
            opacity: 0; 
            transform: translateY(5px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-4px);
          }
          60% {
            transform: translateY(-2px);
          }
        }
      `}</style>
    </div>
  );
}