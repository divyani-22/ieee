import React, { useState } from 'react';
import { X, Phone, User, CheckCircle2, ArrowRight, ShieldCheck, Sparkles, RefreshCw } from 'lucide-react';
import { UserProfile } from '../../types';

export interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginGoogle: (name: string, email: string) => UserProfile;
  onLoginPhone: (phone: string, name: string) => UserProfile;
  initialMode?: 'signin' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginGoogle,
  onLoginPhone,
  initialMode = 'signin',
}) => {
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>(initialMode);
  const [method, setMethod] = useState<'options' | 'google' | 'phone'>('options');

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneCountryCode, setPhoneCountryCode] = useState('+1');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpStep, setOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [demoOtp, setDemoOtp] = useState('482910');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const resetForm = () => {
    setMethod('options');
    setName('');
    setEmail('');
    setPhoneNumber('');
    setOtpStep(false);
    setOtpCode('');
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleGoogleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Please enter your name so we can personalize your study space.');
      return;
    }
    const cleanEmail = email.trim() || `${name.toLowerCase().replace(/[^a-z0-9]/g, '') || 'scholar'}@gmail.com`;
    const user = onLoginGoogle(name.trim(), cleanEmail);
    setSuccessMsg(`Welcome, ${user.name}! Signed in with Google.`);
    setTimeout(() => {
      handleClose();
    }, 900);
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Please enter your name so we know how to address you.');
      return;
    }
    const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 7) {
      setErrorMsg('Please enter a valid phone number (at least 7 digits).');
      return;
    }

    setErrorMsg(null);
    // Generate a memorable 6-digit test code
    const generated = Math.floor(100000 + Math.random() * 900000).toString();
    setDemoOtp(generated);
    setOtpStep(true);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode.trim()) {
      setErrorMsg('Please enter the 6-digit verification code.');
      return;
    }
    const fullPhone = `${phoneCountryCode} ${phoneNumber.trim()}`;
    const user = onLoginPhone(fullPhone, name.trim());
    setSuccessMsg(`Welcome, ${user.name}! Phone verified successfully.`);
    setTimeout(() => {
      handleClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/45 backdrop-blur-sm animate-fade-in select-none">
      <div className="bg-white rounded-4xl w-full max-w-md p-7 sm:p-8 space-y-6 shadow-pillowy border border-white relative animate-scale-in overflow-hidden">
        {/* Decorative corner pastel glow */}
        <div className="absolute -top-16 -right-16 w-36 h-36 rounded-full bg-[#D9CDEE]/60 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-36 h-36 rounded-full bg-[#D6EAE1]/60 blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={handleClose}
          aria-label="Close"
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-[#16161D] flex items-center justify-center transition-all z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="space-y-1.5 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D6EAE1] text-xs font-bold text-[#16161D]">
            <Sparkles className="w-3.5 h-3.5 text-[#3A7560]" />
            <span>Personalized Learning</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#16161D] tracking-tight">
            {authMode === 'signup' ? 'Create Your Account' : 'Welcome Back'}
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-[#6B6B7B]">
            {authMode === 'signup'
              ? 'Join to save your flashcards, quizzes, and bookmarks.'
              : 'Sign in to access your study pathway and progress.'}
          </p>
        </div>

        {/* Tab Switcher: Sign In vs Sign Up */}
        <div className="p-1 rounded-full bg-slate-100 flex items-center relative z-10">
          <button
            type="button"
            onClick={() => {
              setAuthMode('signin');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2 rounded-full text-xs font-extrabold transition-all ${
              authMode === 'signin'
                ? 'bg-white text-[#16161D] shadow-sm'
                : 'text-[#6B6B7B] hover:text-[#16161D]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMode('signup');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2 rounded-full text-xs font-extrabold transition-all ${
              authMode === 'signup'
                ? 'bg-white text-[#16161D] shadow-sm'
                : 'text-[#6B6B7B] hover:text-[#16161D]'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Feedback banners */}
        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-[#F9D9CF] border border-[#F2B8A8] text-[#16161D] text-xs font-bold animate-fade-in relative z-10">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="p-3.5 rounded-2xl bg-[#D6EAE1] border border-[#A8D5C2] text-[#16161D] text-xs font-black flex items-center gap-2 animate-fade-in relative z-10">
            <CheckCircle2 className="w-4 h-4 text-[#3A7560]" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* =================================================================== */}
        {/* VIEW 1: METHOD SELECTION WITH PROMINENT NAME FIELD */}
        {/* =================================================================== */}
        {method === 'options' && (
          <div className="space-y-4 relative z-10">
            {/* Always ask for their Name so it's ready */}
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-extrabold text-[#16161D] flex items-center justify-between">
                <span>What is your name?</span>
                <span className="text-[10px] text-[#7D64B5] font-bold">Required</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B6B7B]" />
                <input
                  type="text"
                  placeholder="e.g. Alex, Maya, Jordan"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errorMsg) setErrorMsg(null);
                  }}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold text-[#16161D] placeholder-[#A3A3B5] focus:outline-none focus:ring-4 focus:ring-[#B9A6E3]/30 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-200" />
              <span className="flex-shrink mx-3 text-[11px] font-bold text-[#6B6B7B] uppercase tracking-wider">
                Choose Login Method
              </span>
              <div className="flex-grow border-t border-slate-200" />
            </div>

            {/* Google Login Option */}
            <button
              type="button"
              onClick={() => {
                if (!name.trim()) {
                  setErrorMsg('Please enter your name first above.');
                  return;
                }
                setMethod('google');
                setErrorMsg(null);
              }}
              className="w-full py-3.5 px-4 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 text-[#16161D] text-xs sm:text-sm font-bold shadow-soft hover:bg-slate-50 transition-all flex items-center justify-center gap-3 active:scale-[0.99]"
            >
              {/* Official Google G Logo SVG */}
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Phone Number Login Option */}
            <button
              type="button"
              onClick={() => {
                setMethod('phone');
                setErrorMsg(null);
              }}
              className="w-full py-3.5 px-4 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 text-[#16161D] text-xs sm:text-sm font-bold shadow-soft hover:bg-slate-50 transition-all flex items-center justify-center gap-3 active:scale-[0.99]"
            >
              <Phone className="w-4 h-4 text-[#7D64B5]" />
              <span>Continue with Phone Number</span>
            </button>
          </div>
        )}

        {/* =================================================================== */}
        {/* VIEW 2: GOOGLE ONE-CLICK CONFIRMATION */}
        {/* =================================================================== */}
        {method === 'google' && (
          <form onSubmit={handleGoogleSubmit} className="space-y-4 relative z-10 text-left">
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-[#16161D]">
                Your Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B6B7B]" />
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold text-[#16161D] focus:outline-none focus:ring-4 focus:ring-[#B9A6E3]/30 focus:bg-white"
                  autoFocus
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-[#16161D]">
                Google Email Address
              </label>
              <input
                type="email"
                placeholder={`${name ? name.toLowerCase().replace(/[^a-z0-9]/g, '') : 'scholar'}@gmail.com`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold text-[#16161D] focus:outline-none focus:ring-4 focus:ring-[#B9A6E3]/30 focus:bg-white"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-full bg-[#22222B] text-white text-xs font-black shadow-pillowy hover:bg-black transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              <span>Complete Sign In with Google</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setMethod('options')}
              className="w-full text-xs font-bold text-[#6B6B7B] hover:text-[#16161D] py-1 transition-colors"
            >
              ← Choose another method
            </button>
          </form>
        )}

        {/* =================================================================== */}
        {/* VIEW 3: PHONE NUMBER & OTP VERIFICATION */}
        {/* =================================================================== */}
        {method === 'phone' && (
          <div className="relative z-10 text-left">
            {!otpStep ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-[#16161D]">
                    Your Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B6B7B]" />
                    <input
                      type="text"
                      placeholder="e.g. Alex Chen"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold text-[#16161D] focus:outline-none focus:ring-4 focus:ring-[#B9A6E3]/30 focus:bg-white"
                      autoFocus
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-[#16161D]">
                    Mobile Phone Number
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={phoneCountryCode}
                      onChange={(e) => setPhoneCountryCode(e.target.value)}
                      aria-label="Country Code"
                      className="px-3 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-extrabold text-[#16161D] focus:outline-none focus:ring-4 focus:ring-[#B9A6E3]/30"
                    >
                      <option value="+1">🇺🇸 +1</option>
                      <option value="+91">🇮🇳 +91</option>
                      <option value="+44">🇬🇧 +44</option>
                      <option value="+61">🇦🇺 +61</option>
                      <option value="+49">🇩🇪 +49</option>
                      <option value="+33">🇫🇷 +33</option>
                      <option value="+81">🇯🇵 +81</option>
                    </select>

                    <input
                      type="tel"
                      placeholder="(555) 019-2834"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="flex-1 px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold text-[#16161D] focus:outline-none focus:ring-4 focus:ring-[#B9A6E3]/30 focus:bg-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-full bg-[#22222B] text-white text-xs font-black shadow-pillowy hover:bg-black transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                >
                  <span>Send Verification Code</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setMethod('options')}
                  className="w-full text-xs font-bold text-[#6B6B7B] hover:text-[#16161D] py-1 transition-colors"
                >
                  ← Choose another method
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4 animate-fade-in">
                <div className="p-3.5 rounded-2xl bg-[#D9CDEE]/50 border border-[#B9A6E3] space-y-1">
                  <span className="text-[11px] font-bold text-[#6B6B7B] block">
                    Code sent to {phoneCountryCode} {phoneNumber}
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-[#16161D]">
                      Demo Verification Code:
                    </span>
                    <button
                      type="button"
                      onClick={() => setOtpCode(demoOtp)}
                      className="px-2.5 py-0.5 rounded-full bg-white text-xs font-mono font-black text-[#7D64B5] hover:bg-slate-50 shadow-xs"
                      title="Click to auto-fill"
                    >
                      {demoOtp} (Auto-fill)
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-[#16161D]">
                    Enter 6-Digit Code
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="••••••"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                    className="w-full text-center tracking-[0.5em] text-2xl font-mono font-black py-3 rounded-2xl bg-slate-50 border border-slate-200 text-[#16161D] focus:outline-none focus:ring-4 focus:ring-[#B9A6E3]/30 focus:bg-white"
                    autoFocus
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-full bg-[#22222B] text-white text-xs font-black shadow-pillowy hover:bg-black transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verify Code & Sign In</span>
                </button>

                <div className="flex items-center justify-between text-xs font-bold text-[#6B6B7B] pt-1">
                  <button
                    type="button"
                    onClick={() => setOtpStep(false)}
                    className="hover:text-[#16161D] transition-colors"
                  >
                    ← Change Phone
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const newCode = Math.floor(100000 + Math.random() * 900000).toString();
                      setDemoOtp(newCode);
                      setSuccessMsg(`Resent! New code: ${newCode}`);
                      setTimeout(() => setSuccessMsg(null), 3000);
                    }}
                    className="hover:text-[#16161D] transition-colors flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Resend Code
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Footer info note */}
        <div className="pt-2 border-t border-slate-100 text-[11px] text-[#6B6B7B] font-semibold text-center relative z-10">
          <span>100% private & client-side • No spam ever</span>
        </div>
      </div>
    </div>
  );
};
