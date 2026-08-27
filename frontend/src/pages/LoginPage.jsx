import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, ArrowRight, Eye, EyeOff, ShieldCheck, User, CheckCircle2 } from 'lucide-react';
import logoImg from '../assets/logo.png';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectUrl = new URLSearchParams(location.search).get('redirect') || '/';

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }

    setLoading(true);
    try {
      const res = await login(email.trim(), password);
      setSuccessMsg('Signed in successfully! Redirecting...');
      setTimeout(() => {
        navigate(redirectUrl);
      }, 500);
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-12 px-4 flex items-center justify-center">
      <div className="w-full max-w-md">
        
        <div className="bg-white rounded-3xl border border-[#E8E2D9] p-8 shadow-xl">
          {/* Brand Header */}
          <div className="text-center mb-6">
            <Link to="/" className="inline-block mb-3">
              <img
                src={logoImg}
                alt="Sri Vijay Laxmi Textiles"
                className="h-16 w-auto object-contain mx-auto drop-shadow-sm"
              />
            </Link>
            <span className="text-[11px] font-bold text-[#D97706] uppercase tracking-widest block">
              Member Sign In
            </span>
            <h1 className="font-royal text-2xl font-bold text-gray-900 mt-1">
              Sri Vijaylaxmi Sarees
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Sign in with your email & password to access orders and saved items
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl flex items-center gap-2">
              <span className="shrink-0 text-base">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-xl flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="form-label font-semibold text-gray-700 block mb-1">
                Email Address <span className="text-red-500">*</span>
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

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="form-label font-semibold text-gray-700">
                  Password <span className="text-red-500">*</span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-[11px] text-[#700B1A] font-semibold hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your account password"
                  className="w-full pl-10 pr-10 py-2.5 bg-[#FAF8F5] border border-[#E5DDD0] rounded-xl text-xs focus:outline-none focus:border-[#700B1A] focus:bg-white transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-700 p-0.5"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-[#700B1A] focus:ring-[#700B1A]"
                />
                <span className="text-xs text-gray-600">Keep me logged in</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#700B1A] hover:bg-[#580816] text-white text-xs font-bold py-3 rounded-xl shadow-md mt-2 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Sign In with Email</span>
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-gray-500 pt-4 border-t border-gray-100">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-bold text-[#700B1A] hover:underline">
              Create New Account
            </Link>
          </div>

          {/* Quick Demo Autofill */}
          <div className="mt-4 p-3 bg-[#FAF8F5] rounded-xl border border-gray-200 text-center">
            <p className="text-[11px] text-gray-500 mb-1.5 font-medium">Quick Demo Test Account:</p>
            <button
              type="button"
              onClick={() => {
                setEmail('sagarpunia163@gmail.com');
                setPassword('123456');
                setError('');
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-300 rounded-lg text-[11px] text-[#700B1A] font-semibold hover:border-[#700B1A] hover:bg-[#FDF2F4] transition-all shadow-2xs cursor-pointer"
            >
              <span>👤 Autofill: sagarpunia163@gmail.com (123456)</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default LoginPage;
