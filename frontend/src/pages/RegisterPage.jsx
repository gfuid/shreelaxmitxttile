import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Phone, ArrowRight, Eye, EyeOff, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import logoImg from '../assets/logo.png';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  // Password strength calculation
  const getPasswordStrength = () => {
    if (!password) return { level: 0, text: '', color: '' };
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password) || /[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) return { level: 1, text: 'Weak', color: 'bg-red-500', textColor: 'text-red-500' };
    if (score === 2) return { level: 2, text: 'Fair', color: 'bg-amber-500', textColor: 'text-amber-600' };
    if (score === 3) return { level: 3, text: 'Good', color: 'bg-blue-500', textColor: 'text-blue-600' };
    return { level: 4, text: 'Strong', color: 'bg-emerald-500', textColor: 'text-emerald-600' };
  };

  const strength = getPasswordStrength();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!name.trim() || !email.trim() || !password) {
      setError('Please fill in all mandatory fields (*)');
      return;
    }

    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address.');
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

    if (!agreeTerms) {
      setError('Please agree to the Terms of Service & Privacy Policy.');
      return;
    }

    setLoading(true);
    try {
      await register({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password,
      });
      setSuccessMsg('Account created successfully! Welcome to Sri Vijaylaxmi Sarees.');
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
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
              New Customer Registration
            </span>
            <h1 className="font-royal text-2xl font-bold text-gray-900 mt-1">
              Create Your Account
            </h1>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FEF3C7] text-[#92400E] rounded-full text-[11px] font-bold mt-2">
              <Sparkles size={13} className="text-[#D97706]" />
              <span>Flat ₹300 Welcome Coupon on Sign Up</span>
            </div>
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

          {/* Form */}
          <form onSubmit={handleRegister} className="space-y-3.5 text-xs">
            <div>
              <label className="form-label font-semibold text-gray-700 block mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Pooja Sharma"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#FAF8F5] border border-[#E5DDD0] rounded-xl text-xs focus:outline-none focus:border-[#700B1A] focus:bg-white transition-all"
                />
              </div>
            </div>

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
                  placeholder="pooja@example.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#FAF8F5] border border-[#E5DDD0] rounded-xl text-xs focus:outline-none focus:border-[#700B1A] focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <label className="form-label font-semibold text-gray-700 block mb-1">
                Mobile Number (Optional)
              </label>
              <div className="relative">
                <Phone size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98112 34567"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#FAF8F5] border border-[#E5DDD0] rounded-xl text-xs focus:outline-none focus:border-[#700B1A] focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <label className="form-label font-semibold text-gray-700 block mb-1">
                Password <span className="text-red-500">*</span> (min 6 characters)
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a secure password"
                  className="w-full pl-10 pr-10 py-2.5 bg-[#FAF8F5] border border-[#E5DDD0] rounded-xl text-xs focus:outline-none focus:border-[#700B1A] focus:bg-white transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-700 p-0.5"
                  title={showPassword ? 'Hide' : 'Show'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Password strength indicator */}
              {password && (
                <div className="mt-1.5">
                  <div className="flex items-center justify-between text-[10px] text-gray-500 mb-1">
                    <span>Password Strength:</span>
                    <span className={`font-bold ${strength.textColor}`}>{strength.text}</span>
                  </div>
                  <div className="w-full bg-gray-100 h-1 rounded-full overflow-hidden flex gap-1">
                    {[1, 2, 3, 4].map((step) => (
                      <div
                        key={step}
                        className={`h-full flex-1 transition-all rounded-full ${
                          step <= strength.level ? strength.color : 'bg-gray-200'
                        }`}
                      ></div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="form-label font-semibold text-gray-700 block mb-1">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className="w-full pl-10 pr-10 py-2.5 bg-[#FAF8F5] border border-[#E5DDD0] rounded-xl text-xs focus:outline-none focus:border-[#700B1A] focus:bg-white transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-700 p-0.5"
                  title={showConfirmPassword ? 'Hide' : 'Show'}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p className="text-[11px] text-red-500 mt-1">Passwords do not match</p>
              )}
            </div>

            <div className="pt-1">
              <label className="flex items-start gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 rounded text-[#700B1A] focus:ring-[#700B1A]"
                />
                <span className="text-[11px] text-gray-600 leading-tight">
                  I agree to the{' '}
                  <Link to="/terms" className="text-[#700B1A] underline">Terms of Service</Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-[#700B1A] underline">Privacy Policy</Link>
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#700B1A] hover:bg-[#580816] text-white text-xs font-bold py-3 rounded-xl shadow-md mt-3 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Create Account & Claim ₹300 Coupon</span>
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-gray-500 pt-3 border-t border-gray-100">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-[#700B1A] hover:underline">
              Sign In to Account
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
};

export default RegisterPage;
