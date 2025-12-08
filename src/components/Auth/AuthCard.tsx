import React from 'react';
import { cn } from '@/lib/utils';

interface AuthCardProps {
  children: React.ReactNode;
  className?: string;
}

export const AuthCard: React.FC<AuthCardProps> = ({ children, className }) => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background/80 backdrop-blur-xl p-4">
      <div
        className={cn(
          'w-full max-w-md bg-auth-card rounded-3xl shadow-2xl p-8 animate-fade-in',
          className
        )}
      >
        {children}
      </div>
    </div>
  );
};

export default AuthCard;
