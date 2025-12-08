import React, { useState } from 'react';
import AuthCard from './AuthCard';
import AuthInput from './AuthInput';
import AuthButton from './AuthButton';
import SocialLogins from './SocialLogins';
import { User, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type AccountType = 'individual' | 'business';

interface SignUpRegisterProps {
  onSubmit: (data: {
    accountType: AccountType;
    firstName: string;
    lastName: string;
    password: string;
  }) => void;
  onLoginClick: () => void;
}

export const SignUpRegister: React.FC<SignUpRegisterProps> = ({
  onSubmit,
  onLoginClick,
}) => {
  const [accountType, setAccountType] = useState<AccountType>('individual');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) return;
    onSubmit({ accountType, firstName, lastName, password });
  };

  return (
    <AuthCard className="max-w-lg">
      <h1 className="text-3xl font-bold text-center text-auth-card-foreground mb-2">
        Sign up
      </h1>
      <p className="text-center text-auth-muted-foreground mb-6">
        Register to account
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Account Type Selection */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setAccountType('individual')}
            className={cn(
              'flex-1 flex items-center gap-3 p-4 rounded-xl border transition-all',
              accountType === 'individual'
                ? 'border-auth-card-foreground bg-auth-muted'
                : 'border-auth-border hover:bg-auth-muted'
            )}
          >
            <User className="w-6 h-6 text-auth-card-foreground" />
            <div className="text-left">
              <p className="font-medium text-auth-card-foreground">Individual</p>
              <p className="text-xs text-auth-muted-foreground">For Users</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setAccountType('business')}
            className={cn(
              'flex-1 flex items-center gap-3 p-4 rounded-xl border transition-all',
              accountType === 'business'
                ? 'border-auth-card-foreground bg-auth-muted'
                : 'border-auth-border hover:bg-auth-muted'
            )}
          >
            <Building2 className="w-6 h-6 text-auth-card-foreground" />
            <div className="text-left">
              <p className="font-medium text-auth-card-foreground">Business</p>
              <p className="text-xs text-auth-muted-foreground">For Project</p>
            </div>
          </button>
        </div>

        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-4">
          <AuthInput
            label="First name"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <AuthInput
            label="Last name"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>

        {/* Password Fields */}
        <div className="grid grid-cols-2 gap-4">
          <AuthInput
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <AuthInput
            label="Confirm password"
            type={showPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <p className="text-sm text-auth-muted-foreground">
          Use 8 or more characters with a mix of letters, numbers & symbols
        </p>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showPassword}
            onChange={(e) => setShowPassword(e.target.checked)}
            className="w-4 h-4 rounded border-auth-border bg-auth-input accent-auth-card-foreground"
          />
          <span className="text-sm text-auth-card-foreground">Show password</span>
        </label>

        <AuthButton type="submit" variant="primary">
          Sign Up
        </AuthButton>
      </form>

      <div className="flex items-center gap-4 my-6">
        <div className="flex-1 h-px bg-auth-border" />
        <span className="text-auth-muted-foreground text-sm">Or Continue with</span>
        <div className="flex-1 h-px bg-auth-border" />
      </div>

      <SocialLogins />

      <p className="text-center text-auth-muted-foreground mt-6">
        Already have an account?{' '}
        <button
          onClick={onLoginClick}
          className="text-auth-link hover:underline font-medium"
        >
          Login
        </button>
      </p>
    </AuthCard>
  );
};

export default SignUpRegister;
