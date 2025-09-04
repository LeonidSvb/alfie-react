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
    }, 5000); // Changed from 3000ms to 5000ms for slower transitions

    return () => clearInterval(interval);
  }, [facts.length]);

  return (
    <div className="text-center py-6 px-4">
      {/* Alfie Avatar with animation */}
      <div className="flex justify-center mb-4">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full animate-ping opacity-20"></div>
          <img 
            src="/images/alfie-avatar.png" 
            alt="Alfie thinking" 
            className="w-20 h-20 rounded-full ring-4 ring-emerald-200 shadow-lg relative z-10"
          />
        </div>
      </div>

      {/* Loading text with better animation */}
      <div className="mb-6">
        <h3 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-2">
          Alfie is crafting your perfect adventure
        </h3>
        <div className="flex justify-center gap-1">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
        </div>
      </div>

      {/* Fun fact card with better design */}
      <div className="relative mb-4">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-100 to-yellow-100 rounded-20 transform rotate-1"></div>
        <div className="relative bg-white rounded-20 p-5 border-2 border-orange-200 shadow-lg transform -rotate-1 hover:rotate-0 transition-transform">
          <div className="flex items-start gap-2">
            <span className="text-2xl">💡</span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-orange-600 mb-1">Fun Travel Fact:</p>
              <p className="text-gray-700 text-sm font-medium leading-relaxed">
                {facts[currentFactIndex]}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Animated progress bar */}
      <div className="relative">
        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-400 rounded-full relative overflow-hidden"
               style={{ width: '70%' }}>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer"></div>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-1">Analyzing preferences...</p>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
};

export default LoadingAnimation;