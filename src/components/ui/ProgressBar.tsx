import React from 'react';

interface ProgressBarProps {
  progress: number; // 0-100
  text?: string;
  emoji?: string;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  text = 'Getting started...',
  emoji = '🗣️',
  className = ''
}) => {
  return (
    <div className={`w-full mb-6 ${className}`}>
      <div className="text-sm text-alfie-text text-center mb-3 font-medium flex items-center justify-center gap-2">
        <span className="text-base">{emoji}</span>
        <span>{text}</span>
      </div>
      <div className="w-full h-3 bg-alfie-dark-green rounded-20 overflow-hidden relative shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]">
        <div 
          className="h-full bg-gradient-to-r from-alfie-green to-[#5BA16E] rounded-20 transition-all duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)] relative shadow-[0_2px_8px_rgba(74,139,92,0.3)] alfie-progress-bar"
          style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;