import React, { useState } from 'react';
import AuthCard from './AuthCard';
import AuthInput from './AuthInput';
import AuthButton from './AuthButton';
import SocialLogins from './SocialLogins';

interface SignUpEmailProps {
  onSubmit: (email: string) => void;
  onLoginClick: () => void;
}

export const SignUpEmail: React.FC<SignUpEmailProps> = ({
  onSubmit,
  onLoginClick,
}) => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email);
  };

  return (
    <AuthCard>
      <h1 className="text-3xl font-bold text-center text-auth-card-foreground mb-2">
        Sign up
      </h1>
      <p className="text-center text-auth-muted-foreground mb-8">
        Enter your email to create an account with Auralink
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthInput
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

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

export default SignUpEmail;
