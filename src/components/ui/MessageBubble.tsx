import React from 'react';

interface MessageBubbleProps {
  children: React.ReactNode;
  variant?: 'default' | 'comment';
  className?: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  children,
  variant = 'default',
  className = ''
}) => {
  const getClasses = () => {
    const baseClasses = 'p-4 rounded-18 text-sm leading-[1.4] font-medium flex-1 mt-[2px]';
    
    const variantClasses = {
      default: 'bg-gradient-to-br from-emerald-600 to-green-700 text-white px-5 py-[15px] rounded-20 shadow-soft',
      comment: 'bg-gradient-to-br from-orange-400 to-orange-500 text-white px-[18px] py-[15px] rounded-18 shadow-soft'
    };

    return `${baseClasses} ${variantClasses[variant]} ${className}`.trim();
  };

  return <div className={getClasses()}>{children}</div>;
};

export default MessageBubble;