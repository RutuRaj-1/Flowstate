import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  icon: Icon
}) => {
  const baseClasses = 'rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 inline-flex items-center justify-center';
  
  const variants = {
    primary: 'bg-ocean-800 text-white hover:bg-ocean-700 focus:ring-water-500 disabled:opacity-50 shadow-sm hover:shadow-md',
    secondary: 'bg-[var(--fs-surface-raised)] text-[var(--fs-text-primary)] hover:bg-[var(--fs-surface-subtle)] border border-[var(--fs-border)] focus:ring-water-500 disabled:opacity-50',
    outline: 'bg-transparent text-[var(--fs-text-primary)] hover:bg-[var(--fs-surface-raised)] border border-[var(--fs-border)] focus:ring-water-500 disabled:opacity-50',
    danger: 'bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-400 disabled:opacity-50',
    ghost: 'bg-transparent text-[var(--fs-text-secondary)] hover:bg-[var(--fs-surface-raised)] hover:text-[var(--fs-text-primary)] focus:ring-water-500 disabled:opacity-40',
    water: 'bg-gradient-to-r from-ocean-800 to-ocean-700 text-white hover:from-ocean-700 hover:to-water-600 focus:ring-water-400 shadow-sm hover:shadow-ocean',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-5 py-2.5 text-base gap-2.5',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${baseClasses}
        ${variants[variant] || variants.primary}
        ${sizes[size] || sizes.md}
        ${fullWidth ? 'w-full' : ''}
        ${loading ? 'cursor-wait opacity-75' : ''}
        ${className}
      `}
    >
      {loading ? (
        <>
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>Loading...</span>
        </>
      ) : (
        <>
          {Icon && <Icon className="w-4 h-4" />}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;
