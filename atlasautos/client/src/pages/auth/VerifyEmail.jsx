import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, Mail, Loader2, ArrowRight } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'error' | 'no-token'
  const [message, setMessage] = useState('');
  const [resendEmail, setResendEmail] = useState('');
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (token) {
      verifyToken();
    } else {
      setStatus('no-token');
      setMessage('No verification token found. Please check your email for the verification link.');
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

  const handleResend = async (e) => {
    e.preventDefault();
    if (!resendEmail.trim()) return;
    
    setResending(true);
    try {
      const response = await axios.post(`${API_URL}/auth/resend-verification`, {
        email: resendEmail.trim()
      });
      setMessage(response.data.message);
      setStatus('resent');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to resend verification email.');
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

        <div className="bg-dark-50 rounded-2xl p-6 md:p-8 border border-dark-100">
          {/* Loading State */}
          {status === 'loading' && (
            <div className="text-center py-8">
              <Loader2 className="w-16 h-16 text-primary mx-auto mb-4 animate-spin" />
              <h2 className="text-xl font-semibold text-white mb-2">Verifying your email...</h2>
              <p className="text-gray-400">Please wait while we verify your email address.</p>
            </div>
          )}

          {/* Success State */}
          {status === 'success' && (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">Email Verified!</h2>
              <p className="text-gray-400 mb-6">{message}</p>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                <span>Go to Login</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          )}

          {/* Resent State */}
          {status === 'resent' && (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail className="w-12 h-12 text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">Email Sent!</h2>
              <p className="text-gray-400 mb-6">{message}</p>
              <p className="text-sm text-gray-500">Check your inbox and spam folder.</p>
            </div>
          )}

          {/* Error / No-Token State */}
          {(status === 'error' || status === 'no-token') && (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <XCircle className="w-12 h-12 text-red-500" />
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">Verification Failed</h2>
              <p className="text-gray-400 mb-8">{message}</p>

              {/* Resend Form */}
              <div className="bg-dark rounded-xl p-4 border border-dark-100">
                <p className="text-sm text-gray-400 mb-3">Enter your email to receive a new verification link:</p>
                <form onSubmit={handleResend} className="flex gap-2">
                  <div className="flex-1 relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      value={resendEmail}
                      onChange={(e) => setResendEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full bg-dark-50 border border-dark-100 rounded-lg py-2.5 pl-9 pr-4 text-white placeholder-gray-500 text-sm focus:border-primary transition-colors"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={resending}
                    className="bg-primary hover:bg-primary-600 disabled:opacity-50 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
                  >
                    {resending ? 'Sending...' : 'Resend'}
                  </button>
                </form>
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
