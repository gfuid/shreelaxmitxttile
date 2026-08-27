import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Lock, Eye, EyeOff, CheckCircle2, ShieldAlert, ArrowRight, KeyRound } from 'lucide-react';
import { authApi } from '../services/api';
import logoImg from '../assets/logo.png';

const AdminResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!password) {
      setError('Please enter a new password.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify.');
      return;
    }

    setLoading(true);
    try {
      const res = await authApi.resetPassword(token, password);
      setSuccess(true);
      
      if (res.data && res.data.token) {
        localStorage.setItem('srivijaylaxmi_token', res.data.token);
        localStorage.setItem('srivijaylaxmi_user', JSON.stringify(res.data));
      }

      setTimeout(() => {
        navigate('/login');
      }, 2500);
    } catch (err) {
      setError(err.message || 'Password reset failed. The link may be expired or invalid.');
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
              <KeyRound size={12} />
              <span>Admin Key Reset</span>
            </div>

            <h1 className="font-serif text-2xl font-bold text-white tracking-wide">
              Update Admin Password
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Create a new secure passphrase for your administrator portal
            </p>
          </div>

          {/* Status Alerts */}
          {error && (
            <div className="mb-4 p-3 bg-red-950/80 border border-red-800/80 text-red-300 text-xs font-semibold rounded-xl flex items-center gap-2 relative z-10 animate-fadeIn">
              <ShieldAlert size={16} className="shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {success ? (
            <div className="p-6 bg-emerald-950/80 border border-emerald-800/80 rounded-2xl text-center animate-fadeIn space-y-3 relative z-10">
              <div className="w-12 h-12 rounded-full bg-emerald-900/60 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-700/50">
                <CheckCircle2 size={24} />
              </div>
              <h3 className="font-bold text-base text-emerald-200">Admin Password Updated!</h3>
              <p className="text-xs text-emerald-300/90 leading-relaxed">
                Your credentials have been securely stored. Redirecting to Admin Console...
              </p>
              <div className="pt-2">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#E8A87C] hover:underline"
                >
                  <span>Click here to sign in immediately</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs relative z-10">
              <div>
                <label className="block text-gray-300 font-semibold mb-1 text-[11px]">
                  New Admin Password <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-3.5 text-gray-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full pl-10 pr-10 py-2.5 bg-[#292524] border border-[#44403C] rounded-xl text-white placeholder-gray-500 text-xs focus:outline-none focus:border-[#D97706] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-gray-400 hover:text-white p-0.5"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1 text-[11px]">
                  Confirm New Password <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-3.5 text-gray-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-type admin password"
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
                    <span>Save New Admin Password</span>
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Back to Sign In */}
          <div className="mt-6 pt-4 border-t border-[#332E29] text-center text-xs text-gray-400 relative z-10">
            <Link to="/login" className="text-[#E8A87C] font-bold hover:underline">
              Back to Admin Sign In
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
};

export default AdminResetPasswordPage;
