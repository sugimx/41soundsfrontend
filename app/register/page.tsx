'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';
import { motion } from 'motion/react';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    mobile: '',
    gender: '',
    dateOfBirth: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.fullName.trim()) {
      setError('Full name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (!formData.mobile.trim()) {
      setError('Mobile number is required');
      return false;
    }
    if (!/^[0-9+\-\s()]{10,20}$/.test(formData.mobile)) {
      setError('Please enter a valid mobile number (10-20 digits)');
      return false;
    }
    if (!formData.gender) {
      setError('Please select your gender');
      return false;
    }
    if (!formData.dateOfBirth) {
      setError('Date of birth is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      await register(
        formData.email,
        formData.fullName,
        formData.password,
        formData.mobile,
        formData.gender,
        formData.dateOfBirth
      );
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
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
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Link href="/" className="inline-block mb-4 text-pink-600 hover:text-pink-500 text-sm transition-colors">
            ← Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-gray-400">Join 41Sounds today</p>
        </motion.div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Register Form */}
        <motion.form 
          onSubmit={handleSubmit} 
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {/* Full Name Input */}
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-white mb-2">
              Full Name
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              placeholder="John Doe"
              value={formData.fullName}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-pink-600 focus:ring-1 focus:ring-pink-600/50 transition-all disabled:opacity-50 backdrop-blur-sm"
            />
          </div>

          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-pink-600 focus:ring-1 focus:ring-pink-600/50 transition-all disabled:opacity-50 backdrop-blur-sm"
            />
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-pink-600 focus:ring-1 focus:ring-pink-600/50 transition-all disabled:opacity-50 backdrop-blur-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Confirm Password Input */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-white mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-pink-600 focus:ring-1 focus:ring-pink-600/50 transition-all disabled:opacity-50 backdrop-blur-sm"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isLoading}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile Input */}
          <div>
            <label htmlFor="mobile" className="block text-sm font-medium text-white mb-2">
              Mobile Number
            </label>
            <input
              id="mobile"
              name="mobile"
              type="tel"
              placeholder="+91 98765 43210"
              value={formData.mobile}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-pink-600 focus:ring-1 focus:ring-pink-600/50 transition-all disabled:opacity-50 backdrop-blur-sm"
            />
          </div>

          {/* Gender Select */}
          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-white mb-2">
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-pink-600 focus:ring-1 focus:ring-pink-600/50 transition-all disabled:opacity-50 backdrop-blur-sm"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </div>

          {/* Date of Birth Input */}
          <div>
            <label htmlFor="dateOfBirth" className="block text-sm font-medium text-white mb-2">
              Date of Birth
            </label>
            <input
              id="dateOfBirth"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-pink-600 focus:ring-1 focus:ring-pink-600/50 transition-all disabled:opacity-50 backdrop-blur-sm"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-6 px-4 py-3 bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </motion.form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-800"></div>
          <p className="text-gray-300 text-sm">Already have an account?</p>
          <div className="flex-1 h-px bg-gray-800"></div>
        </div>

        {/* Login Link */}
        <motion.p 
          className="text-center text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Link href="/login" className="text-pink-600 hover:text-pink-500 font-semibold transition-colors">
            Sign in here
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}
