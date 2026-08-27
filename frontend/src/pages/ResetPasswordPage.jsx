import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle2, ShieldAlert, ArrowRight, KeyRound, Sparkles } from 'lucide-react';
import { authApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import logoImg from '../assets/logo.png';

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { login } = useAuth();

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
      
      // Auto login or update session if user data returned
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
    <div className="min-h-screen bg-[#FAF8F5] py-14 px-4 flex items-center justify-center">
      <div className="w-full max-w-md">
        
        <div className="bg-white rounded-3xl border border-[#E8E2D9] p-8 shadow-xl relative overflow-hidden">
          {/* Top Accent */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#700B1A] via-[#D97706] to-[#700B1A]"></div>

          {/* Header */}
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
              <span>Set New Password</span>
            </div>

            <h1 className="font-royal text-2xl font-bold text-gray-900">
              Reset Your Password
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Create a strong and secure new password for your account.
            </p>
          </div>

          {/* Status Alerts */}
          {error && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl flex items-start gap-2.5 animate-fadeIn">
              <ShieldAlert size={16} className="shrink-0 text-red-500 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success ? (
            <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center animate-fadeIn space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 size={26} />
              </div>
              <h3 className="font-bold text-base text-emerald-900">Password Reset Complete!</h3>
              <p className="text-xs text-emerald-700 leading-relaxed">
                Your password has been safely updated. You will now be redirected to the sign-in page...
              </p>
              <div className="pt-2">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#700B1A] hover:underline"
                >
                  <span>Click here if not redirected automatically</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ) : (
            /* Reset Form */
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="form-label font-semibold text-gray-700 block mb-1">
                  New Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full pl-10 pr-10 py-2.5 bg-[#FAF8F5] border border-[#E5DDD0] rounded-xl text-xs focus:outline-none focus:border-[#700B1A] focus:bg-white transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-700 p-0.5"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="form-label font-semibold text-gray-700 block mb-1">
                  Confirm New Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your new password"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#FAF8F5] border border-[#E5DDD0] rounded-xl text-xs focus:outline-none focus:border-[#700B1A] focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Password Requirements hint */}
              <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E8E2D9] text-[11px] text-gray-500 space-y-1">
                <p className="font-semibold text-gray-700">Password Tips:</p>
                <div className="flex items-center gap-1.5 text-gray-600">
                  <span className={password.length >= 6 ? 'text-emerald-600 font-bold' : 'text-gray-400'}>
                    {password.length >= 6 ? '✓' : '•'} Minimum 6 characters
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-600">
                  <span className={password && password === confirmPassword ? 'text-emerald-600 font-bold' : 'text-gray-400'}>
                    {password && password === confirmPassword ? '✓' : '•'} Passwords match
                  </span>
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
                    <span>Update & Save Password</span>
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Back to Sign In */}
          <div className="mt-6 text-center text-xs text-gray-500 pt-4 border-t border-gray-100">
            <Link to="/login" className="font-bold text-[#700B1A] hover:underline">
              Back to Sign In
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
};

export default ResetPasswordPage;
