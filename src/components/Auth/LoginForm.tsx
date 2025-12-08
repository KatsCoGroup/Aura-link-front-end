import React, { useState } from 'react';
import AuthCard from './AuthCard';
import AuthInput from './AuthInput';
import AuthButton from './AuthButton';
import SocialLogins from './SocialLogins';
import { Wallet } from 'lucide-react';

interface LoginFormProps {
  onLogin: (email: string, password: string) => void;
  onSignUpClick: () => void;
  onConnectWallet?: () => void;
  onGmailLogin?: () => void;
  onTwitterLogin?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onLogin,
  onSignUpClick,
  onConnectWallet,
  onGmailLogin,
  onTwitterLogin,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <AuthCard>
      <h1 className="text-3xl font-bold text-center text-auth-card-foreground mb-8">
        Login
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthInput
          label="Email/username"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <AuthInput
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="space-y-3 pt-2">
          <AuthButton
            type="button"
            variant="primary"
            onClick={onGmailLogin}
            icon={
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            }
          >
            Login
          </AuthButton>

          <AuthButton
            type="button"
            variant="outline"
            onClick={onTwitterLogin}
            icon={
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            }
          >
            Login
          </AuthButton>

          <AuthButton
            type="button"
            variant="dark"
            onClick={onConnectWallet}
            icon={<Wallet size={20} />}
          >
            Connect Wallet
          </AuthButton>
        </div>
      </form>

      <div className="flex items-center gap-4 my-6">
        <div className="flex-1 h-px bg-auth-border" />
        <span className="text-auth-muted-foreground text-sm">Or Continue with</span>
        <div className="flex-1 h-px bg-auth-border" />
      </div>

      <SocialLogins />

      <p className="text-center text-auth-muted-foreground mt-6">
        Don't have an account?{' '}
        <button
          onClick={onSignUpClick}
          className="text-auth-link hover:underline font-medium"
        >
          Sign up
        </button>
      </p>
    </AuthCard>
  );
};

export default LoginForm;
