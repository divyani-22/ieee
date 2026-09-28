import React, { ButtonHTMLAttributes } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline' | 'subtle' | 'coral' | 'yellow' | 'navy' | 'darkPill' | 'mint' | 'lavender';
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
    primary: 'bg-[#22222B] hover:bg-black text-white rounded-full shadow-soft focus:ring-[#22222B]',
    darkPill: 'bg-[#22222B] hover:bg-black text-white rounded-full shadow-soft focus:ring-[#22222B]',
    mint: 'bg-[#D6EAE1] hover:bg-[#A8D5C2] text-[#16161D] rounded-full shadow-soft focus:ring-[#A8D5C2]',
    lavender: 'bg-[#D9CDEE] hover:bg-[#B9A6E3] text-[#16161D] rounded-full shadow-soft focus:ring-[#B9A6E3]',
    secondary: 'bg-[#D9CDEE] hover:bg-[#B9A6E3] text-[#16161D] rounded-full shadow-soft',
    coral: 'bg-coral hover:bg-coral-500 text-white rounded-full shadow-coral-soft hover:shadow-lg focus:ring-coral-400',
    yellow: 'bg-[#FCE6A6] hover:bg-[#E5CB82] text-[#16161D] rounded-full shadow-yellow-soft focus:ring-yellowPastel',
    navy: 'bg-[#22222B] hover:bg-black text-white rounded-full shadow-navy-soft focus:ring-navy',
    ghost: 'hover:bg-white/80 text-[#16161D] rounded-full',
    danger: 'bg-coral hover:bg-coral-600 text-white rounded-full shadow-coral-soft focus:ring-coral',
    outline: 'border-2 border-[#16161D]/20 hover:border-[#16161D] text-[#16161D] bg-white rounded-full focus:ring-[#16161D]',
    subtle: 'bg-white/80 text-[#16161D] hover:bg-white rounded-full border border-white',
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
