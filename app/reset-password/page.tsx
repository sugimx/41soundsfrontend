'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authApi } from '@/lib/api';
import Link from 'next/link';
import { AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { motion } from 'motion/react';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (tokenParam) {
      setToken(tokenParam);
    }
  }, [searchParams]);

  const validatePassword = (pwd: string) => {
    if (pwd.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (!/[A-Z]/.test(pwd)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/[a-z]/.test(pwd)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/[0-9]/.test(pwd)) {
      return 'Password must contain at least one number';
    }
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('Invalid or missing reset token');
      return;
    }

    if (!password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await authApi.resetPassword(token, password, confirmPassword);
      setSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="relative min-h-screen bg-black flex items-center justify-center px-4 py-12 overflow-hidden">
        {/* Gradient blur background */}
        <div className="absolute top-0 -z-10 left-1/3 w-96 h-96 bg-pink-600 blur-[300px] opacity-30"></div>
        <div className="absolute bottom-0 -z-10 right-1/4 w-96 h-96 bg-pink-500 blur-[300px] opacity-20"></div>
        
        <div className="w-full max-w-md">
          <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-8 text-center backdrop-blur-sm">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Invalid Link</h1>
            <p className="text-gray-400 mb-6">
              The password reset link is invalid or has expired.
            </p>
            <Link
              href="/forgot-password"
              className="inline-block px-6 py-2.5 bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-lg transition-colors"
            >
              Request New Link
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
          {!success ? (
            <>
              <h1 className="text-3xl font-bold text-white mb-2">Reset Your Password</h1>
              <p className="text-gray-400 mb-6">
                Enter a new password for your account. Make it strong!
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="flex items-center gap-3 p-4 bg-red-900 bg-opacity-20 border border-red-800 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter new password"
                      required
                      className="w-full px-4 py-2.5 pr-10 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-pink-600 focus:ring-1 focus:ring-pink-600/50 transition-all backdrop-blur-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-400"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    • At least 8 characters<br/>
                    • One uppercase letter<br/>
                    • One lowercase letter<br/>
                    • One number
                  </p>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      required
                      className="w-full px-4 py-2.5 pr-10 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-pink-600 focus:ring-1 focus:ring-pink-600/50 transition-all backdrop-blur-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-400"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-2.5 bg-pink-600 hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
                >
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-gray-800 text-center">
                <p className="text-gray-400 text-sm">
                  Remember your password?{' '}
                  <Link href="/login" className="text-pink-600 hover:text-pink-700 font-semibold">
                    Sign In
                  </Link>
                </p>
              </div>
            </>
          ) : (
            <div className="text-center">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-white mb-2">Password Reset Successful!</h1>
              <p className="text-gray-400 mb-6">
                Your password has been successfully reset. You will be redirected to the login page in a moment.
              </p>
              <Link
                href="/login"
                className="inline-block px-6 py-2.5 bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-lg transition-colors"
              >
                Go to Login
              </Link>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
