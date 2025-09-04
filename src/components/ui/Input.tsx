import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'custom';
}

const Input: React.FC<InputProps> = ({
  variant = 'default',
  className = '',
  ...props
}) => {
  const baseClasses = 'w-full border-none outline-none font-sans box-border';
  
  const variantClasses = {
    default: 'bg-alfie-dark-green rounded-18 px-[18px] py-3 text-sm text-alfie-text placeholder:text-alfie-text-light placeholder:opacity-80',
    custom: 'bg-alfie-dark-green rounded-18 px-[18px] py-3 text-sm text-alfie-text placeholder:text-alfie-text-light placeholder:opacity-80'
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`.trim();

  return <input className={classes} {...props} />;
};

export default Input;