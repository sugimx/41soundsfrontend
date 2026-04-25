'use client';

import { useAuth } from '@/lib/auth-context';
import { authApi } from '@/lib/api';
import { useState } from 'react';
import Link from 'next/link';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';

export default function ProfilePage() {
  const { user, token, isLoading, updateProfile, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [formData, setFormData] = useState({
    fullName: user?.fullName || user?.name || '',
    email: user?.email || '',
    mobile: user?.mobile || user?.phone || '',
  });

  if (isLoading) {
    return (
      <div className="relative min-h-screen bg-black flex items-center justify-center px-4 overflow-hidden">
        <div className="absolute top-0 -z-10 left-1/3 w-96 h-96 bg-pink-600 blur-[300px] opacity-30"></div>
        <div className="absolute bottom-0 -z-10 right-1/4 w-96 h-96 bg-pink-500 blur-[300px] opacity-20"></div>
        <p className="text-gray-400">Loading profile...</p>
      </div>
    );
  }

  if (!token || !user) {
    return (
      <div className="relative min-h-screen bg-black flex items-center justify-center px-4 py-12 overflow-hidden">
        <div className="absolute top-0 -z-10 left-1/3 w-96 h-96 bg-pink-600 blur-[300px] opacity-30"></div>
        <div className="absolute bottom-0 -z-10 right-1/4 w-96 h-96 bg-pink-500 blur-[300px] opacity-20"></div>
        <motion.div 
          className="w-full max-w-md text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-gray-400 mb-6">Please log in to view your profile.</p>
          <Link
            href="/login"
            className="inline-block px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-lg transition-colors"
          >
            Go to Login
          </Link>
        </motion.div>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const getDisplayName = () => user?.fullName || user?.name || 'N/A';
  const getDisplayPhone = () => user?.mobile || user?.phone || 'Not provided';

  const handleSave = async () => {
    setError('');
    setSuccessMessage('');
    setIsSaving(true);

    try {
      await updateProfile({
        fullName: formData.fullName,
        mobile: formData.mobile,
      });
      setSuccessMessage('Profile updated successfully!');
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-black px-4 py-24 overflow-hidden">
      {/* Gradient blur background */}
      <div className="absolute top-0 -z-10 left-1/3 w-96 h-96 bg-pink-600 blur-[300px] opacity-30"></div>
      <div className="absolute bottom-0 -z-10 right-1/4 w-96 h-96 bg-pink-500 blur-[300px] opacity-20"></div>
      
      <motion.div 
        className="max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Back Link */}
        <Link href="/" className="inline-flex items-center text-pink-600 hover:text-pink-500 text-sm mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
          <p className="text-gray-400">Manage your account details and preferences</p>
        </motion.div>

        {/* Messages */}
        {error && (
          <motion.div 
            className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-red-400 text-sm">{error}</p>
          </motion.div>
        )}

        {successMessage && (
          <motion.div 
            className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-green-400 text-sm">{successMessage}</p>
          </motion.div>
        )}

        {/* Profile Card */}
        <motion.div 
          className="bg-gray-900/30 border border-gray-800 rounded-lg p-8 mb-6 backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Account Information</h2>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white font-medium rounded-lg transition-colors"
              >
                Edit
              </button>
            )}
          </div>

          <div className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
              {isEditing ? (
                <input
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-pink-600 focus:ring-1 focus:ring-pink-600/50 transition-all backdrop-blur-sm"
                />
              ) : (
                <div className="px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white backdrop-blur-sm">{getDisplayName()}</div>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
              <div className="px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-400 backdrop-blur-sm">
                {user.email}
                <span className="text-xs text-gray-500 ml-2">(Cannot be changed)</span>
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Phone Number</label>
              {isEditing ? (
                <input
                  name="mobile"
                  type="tel"
                  placeholder="+91 XXXXX XXXXX"
                  value={formData.mobile}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-pink-600 focus:ring-1 focus:ring-pink-600/50 transition-all backdrop-blur-sm"
                />
              ) : (
                <div className="px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white backdrop-blur-sm">
                  {getDisplayPhone()}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className="mt-6 flex gap-3">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 px-4 py-3 bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 active:scale-95"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setFormData({
                    fullName: user.fullName || user.name || '',
                    email: user.email,
                    mobile: user.mobile || user.phone || '',
                  });
                }}
                disabled={isSaving}
                className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          )}
        </motion.div>

        {/* Payment History */}
        <motion.div 
          className="bg-gray-900/30 border border-gray-800 rounded-lg p-8 mb-6 backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <h2 className="text-xl font-bold text-white mb-4">Recent Purchases</h2>
          <p className="text-gray-400 text-sm">Your payment history and tickets will appear here</p>
        </motion.div>

        {/* Logout Button */}
        <motion.button
          onClick={logout}
          className="w-full px-4 py-3 bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-lg transition-colors active:scale-95"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          Logout
        </motion.button>
      </motion.div>
    </div>
  );
}
