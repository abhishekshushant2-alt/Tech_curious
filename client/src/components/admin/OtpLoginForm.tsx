import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Mail, KeyRound, ArrowRight, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import api from '../../lib/api.js';
import { useAuth } from '../../context/AuthContext.js';

export const OtpLoginForm: React.FC = () => {
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [devOtp, setDevOtp] = useState<string | null>(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    try {
      setLoading(true);
      setErrorMsg('');
      const res = await api.post('/auth/request-otp', { email: email.trim() });
      if (res.data?.success) {
        setStep('otp');
        setSuccessMsg(res.data.message || 'OTP sent! Check your inbox or terminal.');
        if (res.data?.devOtp) {
          setDevOtp(res.data.devOtp);
          setOtp(res.data.devOtp); // Auto-fill for maximum convenience!
        }
        setCountdown(60);
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to request OTP. Please check email address.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim() || otp.trim().length !== 6) return;

    try {
      setLoading(true);
      setErrorMsg('');
      const res = await api.post('/auth/verify-otp', {
        email: email.trim(),
        otp: otp.trim(),
      });

      if (res.data?.success) {
        login(res.data.token, res.data.email);
        navigate('/admin/dashboard');
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Verification failed. Code may be invalid or expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 sm:p-8 rounded-3xl bg-white dark:bg-dark-surface border border-slate-200 dark:border-white/10 shadow-2xl space-y-6">
      <div className="text-center space-y-3">
        <div className="flex justify-center mb-1">
          <div className="relative w-14 h-14 rounded-2xl overflow-hidden shadow-xl ring-1 ring-black/10 dark:ring-white/15 bg-black flex items-center justify-center">
            <img
              src="/brand-logo.jpg"
              alt="Tech Curious"
              className="w-full h-full object-cover select-none"
            />
          </div>
        </div>
        <h2 className="text-xl sm:text-2xl font-brand font-bold tracking-tight text-slate-950 dark:text-white">
          Tech <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-indigo-500 dark:from-brand-400 dark:to-cyan-400">Curious</span> Admin Gateway
        </h2>
        <p className="text-xs text-slate-500 dark:text-zinc-400">
          Hardware creator CMS authentication via Gmail OTP.
        </p>
      </div>

      {step === 'email' ? (
        <form onSubmit={handleRequestOtp} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Admin Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                placeholder="admin@techcurious.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-dark-elevated border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-brand-500"
              />
            </div>
            <p className="text-[11px] text-slate-400">
              Default authorized address: <span className="font-mono text-brand-500">admin@techcurious.com</span>
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm shadow-lg shadow-brand-500/25 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
          >
            <span>{loading ? 'Sending Code...' : 'Request Verification Code'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                6-Digit Security OTP
              </label>
              <button
                type="button"
                onClick={() => {
                  setStep('email');
                  setOtp('');
                }}
                className="text-xs text-brand-500 hover:underline"
              >
                Change Email
              </button>
            </div>

            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                maxLength={6}
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                className="w-full pl-10 pr-4 py-2.5 text-center text-lg font-mono tracking-widest rounded-xl bg-slate-50 dark:bg-dark-elevated border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          {successMsg && (
            <div className="p-3 rounded-xl bg-brand-mint/10 border border-brand-mint/30 text-brand-mint text-xs flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {devOtp && (
            <div className="p-3.5 rounded-2xl bg-brand-500/10 border border-brand-500/30 text-xs text-brand-cyan space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-white">⚡ Local Dev OTP:</span>
                <span className="font-mono text-base font-black tracking-widest text-brand-500 dark:text-brand-cyan">
                  {devOtp}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Auto-filled into the input field above! Click Verify below to continue.
              </p>
            </div>
          )}

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-dark-elevated/60 border border-slate-200/60 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
            <p className="font-semibold text-slate-700 dark:text-slate-300">💡 Testing Mode:</p>
            <p>Your OTP was printed to the server terminal and automatically retrieved.</p>
          </div>

          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="w-full py-2.5 px-4 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm shadow-lg shadow-brand-500/25 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
          >
            <span>{loading ? 'Verifying...' : 'Verify Code & Log In'}</span>
            <ShieldCheck className="w-4 h-4" />
          </button>

          <div className="text-center pt-1">
            {countdown > 0 ? (
              <span className="text-xs text-slate-400">Resend code in {countdown}s</span>
            ) : (
              <button
                type="button"
                onClick={handleRequestOtp}
                className="text-xs text-brand-500 hover:underline flex items-center justify-center space-x-1 mx-auto"
              >
                <RefreshCw className="w-3 h-3 mr-1" />
                <span>Resend Code</span>
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
};
