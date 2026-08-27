import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Lock, Mail, ArrowRight, Eye, EyeOff, CheckCircle2, Sparkles, User } from 'lucide-react';
import logoImg from '../assets/logo.png';

const AdminLoginPage = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (isRegister && !name.trim()) {
      setError('Please enter your full admin name.');
      return;
    }

    if (!email.trim() || !password) {
      setError('Please enter your admin email and password.');
      return;
    }

    setLoading(true);
    try {
      if (isRegister) {
        await register({
          name: name.trim(),
          email: email.trim(),
          password,
        });
        setSuccessMsg('Admin account registered! Launching console...');
      } else {
        await login(email.trim(), password);
        setSuccessMsg('Credentials verified! Welcome back, Admin.');
      }
      setTimeout(() => {
        navigate('/');
      }, 600);
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#141211] text-gray-100 flex items-center justify-center p-4 selection:bg-[#D97706] selection:text-white">
      <div className="w-full max-w-md">
        
        {/* Card */}
        <div className="bg-[#1C1917] border border-[#332E29] rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-[#700B1A]/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#D97706]/15 rounded-full blur-3xl pointer-events-none"></div>

          {/* Header */}
          <div className="text-center relative z-10 mb-6">
            <div className="mb-3">
              <img
                src={logoImg}
                alt="Sri Vijay Laxmi Textiles"
                className="h-16 w-auto object-contain mx-auto drop-shadow-md"
              />
            </div>
            
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#700B1A]/40 border border-[#700B1A] text-[#E8A87C] text-[10px] font-bold uppercase tracking-widest mb-1.5">
              <ShieldCheck size={12} />
              <span>Admin Management Portal</span>
            </div>

            <h1 className="font-serif text-2xl font-bold text-white tracking-wide">
              Sri Vijaylaxmi Sarees
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              {isRegister ? 'Register new store manager access' : 'Enter credentials to manage catalog, orders & analytics'}
            </p>
          </div>

          {/* Status Banners */}
          {error && (
            <div className="mb-4 p-3 bg-red-950/80 border border-red-800/80 text-red-300 text-xs font-semibold rounded-xl flex items-center gap-2">
              <span className="text-base shrink-0">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 bg-emerald-950/80 border border-emerald-800/80 text-emerald-300 text-xs font-semibold rounded-xl flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs relative z-10">
            {isRegister && (
              <div>
                <label className="block text-gray-300 font-semibold mb-1 text-[11px]">
                  Administrator Name <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-3.5 text-gray-500" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Master Admin"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#292524] border border-[#44403C] rounded-xl text-white placeholder-gray-500 text-xs focus:outline-none focus:border-[#D97706] transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-gray-300 font-semibold mb-1 text-[11px]">
                Admin Email <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-3.5 text-gray-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@srivijaylaxmi.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#292524] border border-[#44403C] rounded-xl text-white placeholder-gray-500 text-xs focus:outline-none focus:border-[#D97706] transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-gray-300 font-semibold text-[11px]">
                  Password <span className="text-red-400">*</span>
                </label>
                {!isRegister && (
                  <Link
                    to="/forgot-password"
                    className="text-[11px] text-[#E8A87C] hover:underline"
                  >
                    Forgot Password?
                  </Link>
                )}
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-3.5 text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full pl-10 pr-10 py-2.5 bg-[#292524] border border-[#44403C] rounded-xl text-white placeholder-gray-500 text-xs focus:outline-none focus:border-[#D97706] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-gray-400 hover:text-white p-0.5"
                  title={showPassword ? 'Hide' : 'Show'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#700B1A] to-[#B91C1C] hover:from-[#580816] hover:to-[#991B1B] text-white text-xs font-bold py-3 rounded-xl shadow-lg border border-red-700/50 mt-2 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>{isRegister ? 'Register & Enter Admin Console' : 'Sign In to Admin Console'}</span>
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-[#332E29] text-center text-xs text-gray-400 relative z-10">
            {isRegister ? (
              <span>
                Already have an admin account?{' '}
                <button
                  onClick={() => { setIsRegister(false); setError(''); }}
                  className="text-[#E8A87C] font-bold hover:underline ml-1"
                >
                  Sign In
                </button>
              </span>
            ) : (
              <span>
                Need another admin seat?{' '}
                <button
                  onClick={() => { setIsRegister(true); setError(''); }}
                  className="text-[#E8A87C] font-bold hover:underline ml-1"
                >
                  Register Admin
                </button>
              </span>
            )}
          </div>

          {/* Quick Demo Autofill */}
          <div className="mt-4 p-3 bg-[#262220] rounded-xl border border-[#3E3834] text-center relative z-10">
            <p className="text-[11px] text-gray-400 mb-1.5 font-medium">Demo Admin Credentials:</p>
            <button
              type="button"
              onClick={() => {
                setIsRegister(false);
                setEmail('srivijaylaxmitextiles@gmail.com');
                setPassword('123456');
                setError('');
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#1C1917] border border-[#57504B] rounded-lg text-[11px] text-[#E8A87C] font-semibold hover:border-[#D97706] hover:bg-[#2F2925] transition-all cursor-pointer shadow-xs"
            >
              <span>🛡️ Autofill: srivijaylaxmitextiles@gmail.com (123456)</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default AdminLoginPage;
