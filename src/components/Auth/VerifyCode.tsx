import React, { useState, useRef, useEffect } from 'react';
import AuthCard from './AuthCard';
import AuthButton from './AuthButton';
import { cn } from '@/lib/utils';

interface VerifyCodeProps {
  onSubmit: (code: string) => void;
  error?: string;
  onResend?: () => void;
}

export const VerifyCode: React.FC<VerifyCodeProps> = ({
  onSubmit,
  error,
  onResend,
}) => {
  const [code, setCode] = useState<string[]>(Array(6).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newCode = [...code];
    pastedData.split('').forEach((char, index) => {
      if (index < 6) newCode[index] = char;
    });
    setCode(newCode);

    const nextEmptyIndex = newCode.findIndex((c) => !c);
    if (nextEmptyIndex !== -1) {
      inputRefs.current[nextEmptyIndex]?.focus();
    } else {
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(code.join(''));
  };

  return (
    <AuthCard className="max-w-md">
      <h1 className="text-3xl font-bold text-center text-auth-card-foreground mb-2">
        Verify your number
      </h1>
      <p className="text-center text-auth-muted-foreground mb-8">
        A 6-digit code has been sent to sms. Please enter it within the next 30 minutes.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-center gap-3">
          {code.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className={cn(
                'w-12 h-14 text-center text-xl font-medium rounded-lg border bg-auth-muted text-auth-card-foreground focus:outline-none focus:ring-2 transition-all',
                error
                  ? 'border-destructive focus:ring-destructive/30'
                  : 'border-auth-success-border focus:ring-auth-link/30 focus:border-auth-link'
              )}
            />
          ))}
        </div>

        {error && (
          <p className="text-destructive text-sm text-center">{error}</p>
        )}

        <AuthButton type="submit" variant="primary">
          Submit
        </AuthButton>

        {onResend && (
          <button
            type="button"
            onClick={onResend}
            className="w-full text-center text-auth-link hover:underline text-sm"
          >
            Resend code
          </button>
        )}
      </form>
    </AuthCard>
  );
};

export default VerifyCode;
