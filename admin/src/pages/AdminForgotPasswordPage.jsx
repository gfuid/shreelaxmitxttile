import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Mail, ArrowRight, ArrowLeft, KeyRound, CheckCircle2, ShieldAlert, ExternalLink } from 'lucide-react';
import { authApi } from '../services/api';
import logoImg from '../assets/logo.png';

const AdminForgotPasswordPage = () => {
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
      setError('Please enter your administrator email address.');
      return;
    }

    setLoading(true);
    try {
      const res = await authApi.forgotPassword(email.trim());
      setSuccessMsg(res.message || 'Password reset instructions have been emailed to your admin account.');
      if (res.devResetUrl) {
        setDevResetUrl(res.devResetUrl);
      }
    } catch (err) {
      setError(err.message || 'Failed to dispatch reset link. Please check the email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#141211] text-gray-100 flex items-center justify-center p-4 selection:bg-[#D97706] selection:text-white">
      <div className="w-full max-w-md">
        
        {/* Card */}
        <div className="bg-[#1C1917] border border-[#332E29] rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          
          {/* Ambient Glows */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-[#700B1A]/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#D97706]/15 rounded-full blur-3xl pointer-events-none"></div>

          {/* Header */}
          <div className="text-center relative z-10 mb-6">
            <div className="mb-3">
              <Link to="/login">
                <img
                  src={logoImg}
                  alt="Sri Vijay Laxmi Textiles"
                  className="h-16 w-auto object-contain mx-auto drop-shadow-md"
                />
              </Link>
            </div>
            
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#700B1A]/40 border border-[#700B1A] text-[#E8A87C] text-[10px] font-bold uppercase tracking-widest mb-1.5">
              <ShieldCheck size={12} />
              <span>Admin Security Recovery</span>
            </div>

            <h1 className="font-serif text-2xl font-bold text-white tracking-wide">
              Recover Admin Password
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Enter your authorized admin email to receive a password reset link
            </p>
          </div>

          {/* Alerts */}
          {error && (
            <div className="mb-4 p-3 bg-red-950/80 border border-red-800/80 text-red-300 text-xs font-semibold rounded-xl flex items-center gap-2 relative z-10 animate-fadeIn">
              <ShieldAlert size={16} className="shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3.5 bg-emerald-950/80 border border-emerald-800/80 text-emerald-300 text-xs rounded-xl flex items-start gap-2.5 relative z-10 animate-fadeIn">
              <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-emerald-200">Reset Email Dispatched</p>
                <p className="text-emerald-300/90 leading-relaxed mt-0.5">{successMsg}</p>
                <p className="text-[10px] text-emerald-400/80 mt-1.5 font-medium">
                  ⏱️ Link is valid for 15 minutes.
                </p>
              </div>
            </div>
          )}

          {/* Dev Quick Link */}
          {devResetUrl && (
            <div className="mb-4 p-3 bg-[#292318] border border-amber-800/60 rounded-xl text-amber-200 text-xs relative z-10">
              <div className="flex items-center justify-between font-bold mb-1">
                <span>🛠️ Dev Direct Link:</span>
                <span className="text-[9px] uppercase tracking-wider bg-amber-900/80 text-amber-300 px-1.5 py-0.5 rounded font-mono">Dev Mode</span>
              </div>
              <p className="text-[11px] text-amber-300/80 mb-2">Click to open reset page directly:</p>
              <Link
                to={devResetUrl}
                className="inline-flex items-center gap-1 text-[#E8A87C] font-bold text-xs hover:underline break-all bg-[#1C1917] px-2.5 py-1.5 rounded-lg border border-amber-700/50 shadow-xs"
              >
                <span>Open Reset Password Page</span>
                <ExternalLink size={12} />
              </Link>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs relative z-10">
            <div>
              <label className="block text-gray-300 font-semibold mb-1 text-[11px]">
                Authorized Admin Email <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-3.5 text-gray-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="srivijaylaxmitextiles@gmail.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#292524] border border-[#44403C] rounded-xl text-white placeholder-gray-500 text-xs focus:outline-none focus:border-[#D97706] transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#700B1A] to-[#B91C1C] hover:from-[#580816] hover:to-[#991B1B] text-white text-xs font-bold py-3 rounded-xl shadow-lg border border-red-700/50 mt-2 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Send Admin Reset Link</span>
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Autofill */}
          <div className="mt-4 p-3 bg-[#262220] rounded-xl border border-[#3E3834] text-center relative z-10">
            <p className="text-[11px] text-gray-400 mb-1.5 font-medium">Demo Admin Email:</p>
            <button
              type="button"
              onClick={() => {
                setEmail('srivijaylaxmitextiles@gmail.com');
                setError('');
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#1C1917] border border-[#57504B] rounded-lg text-[11px] text-[#E8A87C] font-semibold hover:border-[#D97706] hover:bg-[#2F2925] transition-all cursor-pointer shadow-xs"
            >
              <span>🛡️ Autofill: srivijaylaxmitextiles@gmail.com</span>
            </button>
          </div>

          {/* Back to Login */}
          <div className="mt-6 pt-4 border-t border-[#332E29] text-center text-xs text-gray-400 relative z-10 flex items-center justify-center gap-1.5">
            <ArrowLeft size={13} className="text-gray-500" />
            <span>Return to</span>
            <Link to="/login" className="text-[#E8A87C] font-bold hover:underline">
              Admin Sign In
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
};

export default AdminForgotPasswordPage;
