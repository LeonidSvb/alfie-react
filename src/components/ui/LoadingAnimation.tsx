import React, { useState, useEffect } from 'react';

interface LoadingAnimationProps {
  destination?: string;
}

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({ destination }) => {
  const [currentFactIndex, setCurrentFactIndex] = useState(0);
  
  const travelFacts = [
    "🌍 Did you know? The world is round... we checked!",
    "✈️ Airplane food tastes bad because your taste buds go on vacation at 30,000 feet!",
    "🏔️ Mount Everest is still growing... it has commitment issues with its height!",
    "🌊 The ocean is salty because the land never waves back!",
    "🗺️ Iceland has no mosquitoes... they couldn't handle the cold reception!",
    "🎒 A backpacker's favorite music? Heavy metal... because of all that gear!",
    "🌸 Japan has vending machines for everything... even vending machines!",
    "🐧 Antarctica is a desert where you can't get a tan... ironic, right?",
    "🌅 In Norway, the sun forgets to set for 76 days... major FOMO!",
    "🏝️ Islands are just mountains that went swimming and liked it!",
    "🦘 In Australia, everything tries to kill you... except the kangaroos, they just judge you!",
    "🌋 Hawaii grows 42 acres yearly... the only real estate that makes itself!",
    "🎭 Venice has 400 bridges... because the roads took a permanent swim break!",
    "🐘 Thai elephants paint better than most humans... and they never forget to sign their work!",
    "🏔️ Swiss cows wear bells because their horns don't work!",
    "🍕 Pizza in Italy is so thin, it's basically edible frisbee!",
    "🗼 The Eiffel Tower can grow 6 inches in summer... it's just showing off!",
    "🦙 Llamas in Peru spit when annoyed... basically furry teenagers!",
    "🏜️ Sahara Desert was once underwater... worst pool party ever!",
    "🎿 Skiing was invented by someone who really hated walking down mountains!"
  ];

  const destinationFacts: Record<string, string[]> = {
    'japan': [
      "🗾 Japan consists of 6,852 islands!",
      "🌸 Cherry blossom season lasts only 2-3 weeks!",
      "🗻 Mount Fuji last erupted in 1707!",
      "🍜 Slurping noodles is considered polite in Japan!"
    ],
    'thailand': [
      "🐘 Thailand is known as the 'Land of Smiles'!",
      "🏝️ Thailand has over 1,400 islands!",
      "🌶️ Thai cuisine balances sweet, sour, salty, bitter, and spicy!",
      "🙏 Thailand has never been colonized by Europeans!"
    ],
    'iceland': [
      "🌋 Iceland has over 130 volcanic mountains!",
      "❄️ Iceland is covered by 11% glaciers!",
      "🌊 The Blue Lagoon's water temperature is 37-39°C year-round!",
      "📚 Iceland has the highest literacy rate in the world!"
    ],
    'switzerland': [
      "🏔️ Switzerland has 4 official languages!",
      "🚂 Swiss trains are 99.3% punctual!",
      "🧀 Switzerland produces over 450 types of cheese!",
      "⛷️ Switzerland invented modern skiing!"
    ]
  };

  const getRelevantFacts = () => {
    if (destination) {
      const destLower = destination.toLowerCase();
      for (const [country, facts] of Object.entries(destinationFacts)) {
        if (destLower.includes(country)) {
          return [...facts, ...travelFacts.slice(0, 5)];
        }
      }
    }
    return travelFacts;
  };

  const facts = getRelevantFacts();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFactIndex((prev) => (prev + 1) % facts.length);
    }, 7000); // Slower fact transitions - 7 seconds

    return () => clearInterval(interval);
  }, [facts.length]);

  return (
    <div className="alfie-loading-content">
      {/* Alfie Avatar with Alfie styles */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <div style={{ 
          position: 'relative', 
          width: '80px', 
          height: '80px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            border: '4px solid var(--alfie-dark-green)',
            borderTop: '4px solid var(--alfie-green)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <img 
            src="/images/alfie-avatar.png" 
            alt="Alfie thinking" 
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              objectFit: 'cover'
            }}
          />
        </div>
      </div>

      {/* Loading text using Alfie styles */}
      <div className="alfie-loading-text">
        <h3>Alfie is crafting your perfect adventure</h3>
        <p>Analyzing your preferences and matching with local experts...</p>
      </div>

      {/* Fun fact card without duplicate avatar */}
      <div style={{ 
        background: 'var(--alfie-dark-green)',
        color: 'var(--alfie-text)', 
        padding: '15px 18px',
        borderRadius: '18px',
        fontSize: '13px',
        lineHeight: '1.4',
        fontWeight: '500',
        margin: '20px 0',
        textAlign: 'center'
      }}>
        💡 <strong>Fun Travel Fact:</strong><br/>
        {facts[currentFactIndex]}
      </div>
    </div>
  );
};

export default LoadingAnimation;