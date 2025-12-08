import React from 'react';
import { cn } from '@/lib/utils';

interface AuthButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'dark' | 'outline';
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const AuthButton: React.FC<AuthButtonProps> = ({
  children,
  variant = 'primary',
  icon,
  fullWidth = true,
  className,
  ...props
}) => {
  const variants = {
    primary: 'bg-auth-button text-auth-card-foreground hover:bg-auth-border',
    secondary: 'bg-auth-muted text-auth-card-foreground hover:bg-auth-border border border-auth-border',
    dark: 'bg-auth-button-dark text-auth-card hover:bg-auth-card-foreground/90',
    outline: 'bg-transparent border border-dashed border-auth-input-border text-auth-card-foreground hover:bg-auth-muted',
  };

  return (
    <button
      className={cn(
        'h-14 px-6 rounded-full font-medium flex items-center justify-center gap-3 transition-all duration-200',
        variants[variant],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </button>
  );
};

export default AuthButton;
