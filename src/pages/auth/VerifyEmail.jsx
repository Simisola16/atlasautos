import { useState, useEffect } from 'react';
import { Link, useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Mail, Loader2, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { verifyCode: authVerifyCode } = useAuth();
  
  const token = searchParams.get('token');
  const initialEmail = location.state?.email || searchParams.get('email') || '';

  const [email, setEmail] = useState(initialEmail);
  const [code, setCode] = useState('');
  const [status, setStatus] = useState(token ? 'loading' : 'input-code'); // 'loading' | 'success' | 'error' | 'input-code' | 'resent'
  const [message, setMessage] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (token) {
      verifyToken();
    }
  }, [token]);

  const verifyToken = async () => {
    try {
      setStatus('loading');
      const response = await axios.get(`${API_URL}/auth/verify-email/${token}`);
      setStatus('success');
      setMessage(response.data.message);
    } catch (error) {
      setStatus('error');
      setMessage(error.response?.data?.message || 'Verification failed. The link may have expired.');
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    if (!email.trim() || code.trim().length !== 6) {
      return;
    }

    setVerifying(true);
    const result = await authVerifyCode(email.trim(), code.trim());
    setVerifying(false);

    if (result.success) {
      setStatus('success');
      setMessage('Your email has been verified! Redirecting to dashboard...');
      setTimeout(() => {
        if (result.user?.role === 'seller') {
          navigate('/seller/dashboard');
        } else {
          navigate('/browse');
        }
      }, 1500);
    }
  };

  const handleResend = async (e) => {
    if (e) e.preventDefault();
    if (!email.trim()) return;
    
    setResending(true);
    try {
      const response = await axios.post(`${API_URL}/auth/resend-code`, {
        email: email.trim()
      });
      setMessage(response.data.message || 'A new 6-digit code has been sent to your email.');
      setStatus('resent');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to resend verification code.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <span className="text-3xl font-bold">
              <span className="text-primary">ATLAS</span>
              <span className="text-white">AUTOS</span>
            </span>
          </Link>
        </div>

        <div className="bg-dark-50 rounded-2xl p-6 md:p-8 border border-dark-100 shadow-2xl">
          {/* Loading State */}
          {status === 'loading' && (
            <div className="text-center py-8">
              <Loader2 className="w-16 h-16 text-primary mx-auto mb-4 animate-spin" />
              <h2 className="text-xl font-semibold text-white mb-2">Verifying your email...</h2>
              <p className="text-gray-400 text-sm">Please wait while we confirm your code.</p>
            </div>
          )}

          {/* Success State */}
          {status === 'success' && (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/20">
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Email Verified!</h2>
              <p className="text-gray-300 mb-6 text-sm">{message}</p>
              <Link
                to="/seller/dashboard"
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg shadow-primary/20"
              >
                <span>Continue to Dashboard</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          )}

          {/* 6-Digit Code Input State */}
          {(status === 'input-code' || status === 'resent' || status === 'error') && (
            <div>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/20">
                  <ShieldCheck className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-1">Verify Your Email</h2>
                <p className="text-sm text-gray-400">
                  We've sent a 6-digit verification code to
                </p>
                <p className="text-sm font-semibold text-primary mt-0.5">
                  {email || 'your registered email'}
                </p>
              </div>

              {status === 'resent' && (
                <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-xs text-center">
                  {message}
                </div>
              )}

              {status === 'error' && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs text-center">
                  {message}
                </div>
              )}

              <form onSubmit={handleVerifyCode} className="space-y-4">
                {!initialEmail && (
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="w-full bg-dark border border-dark-100 rounded-lg py-2.5 pl-9 pr-4 text-white text-sm focus:border-primary transition-colors"
                        required
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">
                    Enter 6-Digit Code
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="000000"
                    className="w-full text-center text-3xl font-extrabold tracking-[12px] bg-dark border-2 border-dark-100 rounded-xl py-3 text-primary focus:border-primary transition-all outline-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={verifying || code.length !== 6}
                  className="w-full bg-primary hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                >
                  {verifying ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <span>Verify Account</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>

              {/* Resend button */}
              <div className="mt-6 text-center pt-4 border-t border-dark-100">
                <p className="text-xs text-gray-400 mb-2">Didn't receive the code?</p>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resending || !email}
                  className="inline-flex items-center gap-1.5 text-xs text-primary hover:text-primary-400 font-medium disabled:opacity-50 transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${resending ? 'animate-spin' : ''}`} />
                  <span>{resending ? 'Sending...' : 'Resend 6-digit Code'}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-gray-400 hover:text-white text-sm transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
