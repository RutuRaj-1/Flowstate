import React from 'react';

const Card = ({ 
  children, 
  className = '',
  padding = true,
  hover = false,
  active = false,
  ...props 
}) => {
  return (
    <div
      className={`
        rounded-2xl water-card
        ${padding ? 'p-5 md:p-6' : ''}
        ${hover ? 'hover:shadow-pop hover:border-[var(--fs-border-strong)]' : ''}
        ${active ? 'water-card-active' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '' }) => (
  <div className={`flex items-center justify-between mb-4 ${className}`}>
    {children}
  </div>
);

export const CardTitle = ({ children, className = '' }) => (
  <h3 className={`text-base font-bold text-[var(--fs-text-primary)] tracking-tight ${className}`}>
    {children}
  </h3>
);

export const CardContent = ({ children, className = '' }) => (
  <div className={className}>{children}</div>
);

export default Card;
