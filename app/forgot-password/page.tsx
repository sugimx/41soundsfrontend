'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';
import Link from 'next/link';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [resetToken, setResetToken] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authApi.forgotPassword(email);
      setSubmitted(true);
      
      // In development, the token is returned in response
      // In production, it would be sent via email
      if (response.data?.token) {
        setResetToken(response.data.token);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process request');
    } finally {
      setLoading(false);
    }
  };

  const handleResetNow = () => {
    if (resetToken) {
      router.push(`/reset-password?token=${resetToken}`);
    }
  };

  return (
    <div className="relative min-h-screen bg-black flex items-center justify-center px-4 py-12 overflow-hidden">
      {/* Gradient blur background */}
      <div className="absolute top-0 -z-10 left-1/3 w-96 h-96 bg-pink-600 blur-[300px] opacity-30"></div>
      <div className="absolute bottom-0 -z-10 right-1/4 w-96 h-96 bg-pink-500 blur-[300px] opacity-20"></div>
      
      <motion.div 
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link href="/" className="text-pink-600 hover:text-pink-500 text-sm mb-6 inline-block transition-colors">
          ← Back to Home
        </Link>

        <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-8 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-white mb-2">Forgot Password?</h1>
            <p className="text-gray-400 mb-6">
              No worries! Enter your email and we'll send you a link to reset your password.
            </p>
          </motion.div>

          {!submitted ? (
            <motion.form 
              onSubmit={handleSubmit} 
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              {error && (
                <div className="flex items-center gap-3 p-4 bg-red-900 bg-opacity-20 border border-red-800 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full px-4 py-2.5 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-pink-600 focus:ring-1 focus:ring-pink-600/50 transition-all backdrop-blur-sm"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-2.5 bg-pink-600 hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </motion.form>
          ) : (
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div className="flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
              
              <div className="text-center">
                <h2 className="text-xl font-semibold text-white mb-2">Check Your Email</h2>
                <p className="text-gray-400 text-sm mb-4">
                  We've sent a password reset link to <strong>{email}</strong>
                </p>
                <p className="text-gray-500 text-xs mb-6">
                  The link will expire in 10 minutes
                </p>
              </div>

              {resetToken && (
                <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4 mb-4 backdrop-blur-sm">
                  <p className="text-xs text-gray-400 mb-2">Development Mode: Reset Token</p>
                  <p className="text-xs text-gray-300 break-all font-mono">{resetToken}</p>
                  <button
                    onClick={handleResetNow}
                    className="mt-3 w-full px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white text-sm font-semibold rounded-lg transition-colors active:scale-95"
                  >
                    Reset Password Now
                  </button>
                </div>
              )}

              <div className="space-y-3">
                <p className="text-gray-400 text-sm text-center">
                  Didn't receive the email? Check your spam folder.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setEmail('');
                    setError('');
                  }}
                  className="w-full px-6 py-2.5 border border-gray-700 hover:border-gray-600 text-white font-semibold rounded-lg transition-colors"
                >
                  Try Another Email
                </button>
              </div>
            </motion.div>
          )}

          <div className="mt-6 pt-6 border-t border-gray-800 text-center">
            <p className="text-gray-400 text-sm">
              Remember your password?{' '}
              <Link href="/login" className="text-pink-600 hover:text-pink-500 font-semibold transition-colors">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
