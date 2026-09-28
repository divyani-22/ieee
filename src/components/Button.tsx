import React, { ButtonHTMLAttributes } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline' | 'subtle' | 'coral' | 'yellow' | 'navy';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-bold rounded-2xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 select-none';

  const variantStyles = {
    primary: 'bg-navy hover:bg-navy-700 text-white shadow-soft-md hover:shadow-soft-lg focus:ring-navy-600',
    secondary: 'bg-lightBlue-100 hover:bg-lightBlue-200 text-navy border border-lightBlue-200/60 shadow-soft focus:ring-lightBlue',
    coral: 'bg-coral hover:bg-coral-500 text-white shadow-coral-soft hover:shadow-lg focus:ring-coral-400',
    yellow: 'bg-yellowPastel hover:bg-yellowPastel-500 text-navy shadow-yellow-soft focus:ring-yellowPastel',
    navy: 'bg-navy hover:bg-navy-700 text-white shadow-navy-soft focus:ring-navy',
    ghost: 'hover:bg-lightBlue-50 dark:hover:bg-navy-800 text-navy dark:text-lightBlue-100 focus:ring-lightBlue',
    danger: 'bg-coral hover:bg-coral-600 text-white shadow-coral-soft focus:ring-coral',
    outline: 'border-2 border-navy/20 dark:border-white/20 hover:border-navy text-navy dark:text-white bg-white/50 dark:bg-navy-900/50 focus:ring-navy',
    subtle: 'bg-lightBlue-50 dark:bg-navy-800/80 text-navy dark:text-lightBlue-200 hover:bg-lightBlue-100 border border-lightBlue-200/50',
  };

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-6 py-3.5 gap-2.5 font-semibold',
    icon: 'p-2.5 aspect-square',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-1" />
      ) : null}
      {children}
    </button>
  );
};
