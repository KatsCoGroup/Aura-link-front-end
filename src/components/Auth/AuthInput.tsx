import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Eye, EyeOff } from 'lucide-react';

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  showPasswordToggle?: boolean;
}

export const AuthInput = React.forwardRef<HTMLInputElement, AuthInputProps>(
  ({ label, error, className, type, showPasswordToggle, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword && showPassword ? 'text' : type;

    return (
      <div className="relative">
        <input
          ref={ref}
          type={inputType}
          className={cn(
            'peer w-full h-14 px-4 pt-4 pb-2 rounded-xl border border-auth-input-border bg-auth-input text-auth-card-foreground placeholder-transparent focus:outline-none focus:ring-2 focus:ring-auth-link/30 focus:border-auth-link transition-all',
            error && 'border-destructive focus:ring-destructive/30 focus:border-destructive',
            className
          )}
          placeholder={label}
          {...props}
        />
        {label && (
          <label
            className={cn(
              'absolute left-4 top-1/2 -translate-y-1/2 text-auth-muted-foreground text-base transition-all duration-200 pointer-events-none',
              'peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base',
              'peer-focus:top-3 peer-focus:text-xs peer-focus:text-auth-link',
              props.value && 'top-3 text-xs'
            )}
          >
            {label}
          </label>
        )}
        {isPassword && showPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-auth-muted-foreground hover:text-auth-card-foreground transition-colors"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
        {error && <p className="text-destructive text-sm mt-1">{error}</p>}
      </div>
    );
  }
);

AuthInput.displayName = 'AuthInput';

export default AuthInput;
