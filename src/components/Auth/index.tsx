import React, { useState } from 'react';
import LoginForm from './LoginForm';
import SignUpEmail from './SignUpEmail';
import SignUpRegister from './SignUpRegister';
import MobileVerification from './MobileVerification';
import VerifyCode from './VerifyCode';

export type AuthStep =
  | 'login'
  | 'signup-email'
  | 'signup-register'
  | 'mobile-verification'
  | 'verify-code';

interface AuthProps {
  initialStep?: AuthStep;
  onAuthSuccess?: () => void;
}

export const Auth: React.FC<AuthProps> = ({
  initialStep = 'login',
  onAuthSuccess,
}) => {
  const [currentStep, setCurrentStep] = useState<AuthStep>(initialStep);
  const [verifyError, setVerifyError] = useState<string>('');

  const handleLogin = (email: string, password: string) => {
    console.log('Login:', { email, password });
    onAuthSuccess?.();
  };

  const handleSignUpEmail = (email: string) => {
    console.log('Sign up email:', email);
    setCurrentStep('signup-register');
  };

  const handleSignUpRegister = (data: {
    accountType: 'individual' | 'business';
    firstName: string;
    lastName: string;
    password: string;
  }) => {
    console.log('Register:', data);
    setCurrentStep('mobile-verification');
  };

  const handleMobileSubmit = (countryCode: string, phoneNumber: string) => {
    console.log('Mobile:', { countryCode, phoneNumber });
    setCurrentStep('verify-code');
  };

  const handleVerifyCode = (code: string) => {
    console.log('Verify code:', code);
    if (code !== '123456') {
      setVerifyError('Wrong code please try again');
      return;
    }
    setVerifyError('');
    onAuthSuccess?.();
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'login':
        return (
          <LoginForm
            onLogin={handleLogin}
            onSignUpClick={() => setCurrentStep('signup-email')}
            onConnectWallet={() => console.log('Connect wallet')}
            onGmailLogin={() => console.log('Gmail login')}
            onTwitterLogin={() => console.log('Twitter login')}
          />
        );
      case 'signup-email':
        return (
          <SignUpEmail
            onSubmit={handleSignUpEmail}
            onLoginClick={() => setCurrentStep('login')}
          />
        );
      case 'signup-register':
        return (
          <SignUpRegister
            onSubmit={handleSignUpRegister}
            onLoginClick={() => setCurrentStep('login')}
          />
        );
      case 'mobile-verification':
        return <MobileVerification onSubmit={handleMobileSubmit} />;
      case 'verify-code':
        return (
          <VerifyCode
            onSubmit={handleVerifyCode}
            error={verifyError}
            onResend={() => console.log('Resend code')}
          />
        );
      default:
        return null;
    }
  };

  return <>{renderStep()}</>;
};

export default Auth;
