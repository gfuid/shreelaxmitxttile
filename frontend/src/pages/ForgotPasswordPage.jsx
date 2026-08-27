import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, CheckCircle2, ArrowLeft, KeyRound, ShieldAlert, ExternalLink } from 'lucide-react';
import { authApi } from '../services/api';
import logoImg from '../assets/logo.png';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [devResetUrl, setDevResetUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setDevResetUrl('');

    if (!email.trim()) {
      setError('Please enter your registered email address.');
      return;
    }

    setLoading(true);
    try {
      const res = await authApi.forgotPassword(email.trim());
      setSuccessMsg(res.message || 'Password reset link sent! Please check your inbox.');
      if (res.devResetUrl) {
        setDevResetUrl(res.devResetUrl);
      }
    } catch (err) {
      setError(err.message || 'Failed to send reset link. Please check the email address.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-14 px-4 flex items-center justify-center">
      <div className="w-full max-w-md">
        
        <div className="bg-white rounded-3xl border border-[#E8E2D9] p-8 shadow-xl relative overflow-hidden">
          {/* Subtle Top Accent */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#700B1A] via-[#D97706] to-[#700B1A]"></div>

          {/* Brand Header */}
          <div className="text-center mb-6 pt-2">
            <Link to="/" className="inline-block mb-3">
              <img
                src={logoImg}
                alt="Sri Vijay Laxmi Textiles"
                className="h-16 w-auto object-contain mx-auto drop-shadow-sm"
              />
            </Link>
            
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#700B1A]/5 text-[#700B1A] text-[11px] font-bold uppercase tracking-widest mb-2">
              <KeyRound size={13} />
              <span>Password Recovery</span>
            </div>

            <h1 className="font-royal text-2xl font-bold text-gray-900">
              Forgot Your Password?
            </h1>
            <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
              Enter your registered account email and we'll send you a secure link to reset your password.
            </p>
          </div>

          {/* Status Alerts */}
          {error && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl flex items-start gap-2.5 animate-fadeIn">
              <ShieldAlert size={16} className="shrink-0 text-red-500 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-5 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-start gap-2.5 animate-fadeIn">
              <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-emerald-900 mb-0.5">Reset Email Dispatched!</p>
                <p className="text-emerald-700 leading-relaxed">{successMsg}</p>
                <p className="text-[11px] text-emerald-600 mt-2 font-medium">
                  ⏱️ Link is valid for 15 minutes. Check your spam/junk folder if you don't see it.
                </p>
              </div>
            </div>
          )}

          {/* Dev Quick Link Helper (Shows link directly in development) */}
          {devResetUrl && (
            <div className="mb-5 p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs">
              <div className="flex items-center justify-between font-bold mb-1">
                <span>🛠️ Development Direct Link:</span>
                <span className="text-[10px] uppercase tracking-wider bg-amber-200 text-amber-800 px-1.5 py-0.5 rounded font-mono">Dev Mode</span>
              </div>
              <p className="text-[11px] text-amber-700 mb-2">Click below to proceed to password reset immediately:</p>
              <Link
                to={devResetUrl}
                className="inline-flex items-center gap-1 text-[#700B1A] font-bold text-xs hover:underline break-all bg-white px-2.5 py-1.5 rounded-lg border border-amber-200 shadow-2xs"
              >
                <span>Open Reset Password Page</span>
                <ExternalLink size={13} />
              </Link>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="form-label font-semibold text-gray-700 block mb-1">
                Registered Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#FAF8F5] border border-[#E5DDD0] rounded-xl text-xs focus:outline-none focus:border-[#700B1A] focus:bg-white transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#700B1A] hover:bg-[#580816] text-white text-xs font-bold py-3 rounded-xl shadow-md mt-2 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Send Password Reset Link</span>
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Autofill */}
          <div className="mt-5 p-3 bg-[#FAF8F5] rounded-xl border border-gray-200 text-center">
            <p className="text-[11px] text-gray-500 mb-1.5 font-medium">Quick Demo Test Email:</p>
            <button
              type="button"
              onClick={() => {
                setEmail('sagarpunia163@gmail.com');
                setError('');
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-300 rounded-lg text-[11px] text-[#700B1A] font-semibold hover:border-[#700B1A] hover:bg-[#FDF2F4] transition-all cursor-pointer shadow-2xs"
            >
              <span>👤 Autofill: sagarpunia163@gmail.com</span>
            </button>
          </div>

          {/* Back to Login Link */}
          <div className="mt-6 text-center text-xs text-gray-500 pt-4 border-t border-gray-100 flex items-center justify-center gap-2">
            <ArrowLeft size={14} className="text-gray-400" />
            <span>Remembered your password?</span>{' '}
            <Link to="/login" className="font-bold text-[#700B1A] hover:underline">
              Back to Sign In
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
};

export default ForgotPasswordPage;
