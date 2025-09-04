import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'flow' | 'option' | 'multi-option' | 'next' | 'expert';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  selected?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  selected = false,
  ...props
}) => {
  const baseClasses = 'border-none cursor-pointer transition-all duration-200 ease-in-out font-semibold font-sans shadow-soft hover:shadow-lg';
  
  const variantClasses = {
    primary: `
      bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-20 hover:from-emerald-600 hover:to-green-700 hover:scale-[1.02] hover:-translate-y-0.5
      disabled:bg-gray-300 disabled:cursor-not-allowed disabled:transform-none
    `,
    secondary: `
      bg-gray-100 border-2 border-gray-200 text-gray-700 rounded-18 hover:bg-gray-200 hover:border-gray-300 hover:scale-[1.02] hover:-translate-y-0.5
    `,
    flow: `
      bg-white border-2 border-emerald-200 text-emerald-800 rounded-20 text-left flex justify-between items-center
      hover:bg-gradient-to-r hover:from-emerald-50 hover:to-green-50 hover:border-emerald-300 hover:translate-x-[3px] hover:-translate-y-0.5
    `,
    option: `
      bg-white border-2 border-emerald-200 text-emerald-800 rounded-16 text-left flex items-center gap-[6px] p-3 min-h-[48px]
      hover:bg-gradient-to-r hover:from-emerald-50 hover:to-green-50 hover:border-emerald-300 hover:scale-[1.02] hover:-translate-y-0.5
      ${selected ? 'bg-gradient-to-r from-emerald-100 to-green-100 border-emerald-400 text-emerald-900 font-semibold' : ''}
    `,
    'multi-option': `
      bg-white border-2 border-emerald-200 text-emerald-800 rounded-16 text-left flex items-center justify-start gap-2 p-4 min-h-[50px] w-full
      hover:bg-gradient-to-r hover:from-emerald-50 hover:to-green-50 hover:border-emerald-300 hover:scale-[1.01] hover:-translate-y-0.5 transition-all
      ${selected ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white border-emerald-600 font-semibold shadow-lg transform scale-105' : ''}
    `,
    next: `
      bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-18 hover:from-emerald-600 hover:to-green-700 hover:scale-[1.02] hover:-translate-y-0.5 justify-self-center
      disabled:bg-gray-300 disabled:cursor-not-allowed disabled:transform-none disabled:from-gray-300 disabled:to-gray-300
    `,
    expert: `
      bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-18 hover:from-orange-500 hover:to-orange-600 hover:scale-[1.02] hover:-translate-y-0.5
    `
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-4 py-3 text-sm',
    lg: 'px-6 py-4 text-base'
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`.trim();

  return (
    <button className={classes} {...props}>
      {children}
      {variant === 'flow' && <span className="text-base opacity-70">→</span>}
    </button>
  );
};

export default Button;