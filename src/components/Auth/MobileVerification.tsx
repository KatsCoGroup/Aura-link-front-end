import React, { useState } from 'react';
import AuthCard from './AuthCard';
import AuthButton from './AuthButton';

interface MobileVerificationProps {
  onSubmit: (countryCode: string, phoneNumber: string) => void;
}

export const MobileVerification: React.FC<MobileVerificationProps> = ({
  onSubmit,
}) => {
  const [countryCode, setCountryCode] = useState('+1');
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(countryCode, phoneNumber);
  };

  return (
    <AuthCard className="max-w-md">
      <h1 className="text-3xl font-bold text-center text-auth-card-foreground mb-8">
        Enter Mobile number
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex gap-3">
          <input
            type="text"
            value={countryCode}
            onChange={(e) => setCountryCode(e.target.value)}
            className="w-16 h-12 px-3 rounded-full border border-auth-input-border bg-auth-input text-auth-card-foreground text-center focus:outline-none focus:ring-2 focus:ring-auth-link/30 focus:border-auth-link"
          />
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Enter mobile number"
            className="flex-1 h-12 px-4 rounded-full border border-auth-input-border bg-auth-input text-auth-card-foreground placeholder:text-auth-muted-foreground focus:outline-none focus:ring-2 focus:ring-auth-link/30 focus:border-auth-link"
          />
        </div>

        <AuthButton type="submit" variant="primary">
          Send Verification Code
        </AuthButton>
      </form>
    </AuthCard>
  );
};

export default MobileVerification;
