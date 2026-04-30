'use client';

import { useAuth } from '@/lib/auth-context';
import { authApi, paymentApi } from '@/lib/api';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AlertCircle, ArrowLeft, CheckCircle, Clock, XCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface Payment {
  _id: string;
  orderId: string;
  amount: number;
  status: string;
  createdAt: string;
  orderDetails?: {
    itemCount?: number;
    items?: Array<{ name: string; quantity: number; unitPrice: number }>;
  };
}

export default function ProfilePage() {
  const { user, token, isLoading, updateProfile, logout } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [payments, setPayments] = useState<Payment[]>([]);
  const [paymentsLoading, setPaymentsLoading] = useState(false);
  const [paymentsError, setPaymentsError] = useState('');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
  });

  // Update formData whenever user changes
  useEffect(() => {
    if (user) {
      const name = user?.fullName || user?.name || '';
      const email = user?.email || '';
      const phone = user?.mobile || user?.phone || '';
      
      console.log('✅ Syncing user to formData:', { fullName: name, email, mobile: phone });
      
      setFormData({
        fullName: name,
        email: email,
        mobile: phone,
      });
    }
  }, [user]);

  // Fetch payment history
  useEffect(() => {
    const fetchPaymentHistory = async () => {
      if (!token) return;
      
      setPaymentsLoading(true);
      setPaymentsError('');
      try {
        console.log('✅ Fetching payment history...');
        const data = await paymentApi.getPaymentHistory(token);
        console.log('✅ Payments fetched:', data);
        
        // API now returns array directly
        setPayments(Array.isArray(data) ? data : []);
        console.log('✅ Total payments:', data?.length || 0);
      } catch (err: any) {
        console.error('❌ Error fetching payment history:', err.message);
        setPaymentsError('Failed to load purchase history');
      } finally {
        setPaymentsLoading(false);
      }
    };

    fetchPaymentHistory();
  }, [token, user?.id, user?._id]);

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

  // Wait for formData to be populated with user info
  if (!formData.email) {
    return (
      <div className="relative min-h-screen bg-black flex items-center justify-center px-4 overflow-hidden">
        <div className="absolute top-0 -z-10 left-1/3 w-96 h-96 bg-pink-600 blur-[300px] opacity-30"></div>
        <div className="absolute bottom-0 -z-10 right-1/4 w-96 h-96 bg-pink-500 blur-[300px] opacity-20"></div>
        <p className="text-gray-400">Syncing profile data...</p>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'SUCCESS':
      case 'PAID':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'PENDING':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'FAILED':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'SUCCESS':
      case 'PAID':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'PENDING':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'FAILED':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getDisplayName = () => formData.fullName || 'Not provided';
  const getDisplayPhone = () => formData.mobile || 'Not provided';

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

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleLogoutConfirm = async () => {
    setShowLogoutConfirm(false);
    await handleLogout();
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
                  // Reset to current user data (which is now synced in formData)
                }}
                disabled={isSaving}
                className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          )}
        </motion.div>

        {/* Recent Purchases */}
        <motion.div 
          className="bg-gray-900/30 border border-gray-800 rounded-lg p-8 mb-6 backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Recent Purchases</h2>
            <button
              onClick={async () => {
                setPaymentsLoading(true);
                try {
                  const data = await paymentApi.getPaymentHistory(token);
                  const paymentsArray = Array.isArray(data) ? data : [];
                  setPayments(paymentsArray);
                  console.log('Refreshed payments:', paymentsArray);
                } catch (err: any) {
                  console.error('Failed to refresh:', err);
                  setPaymentsError('Failed to refresh purchase history');
                } finally {
                  setPaymentsLoading(false);
                }
              }}
              disabled={paymentsLoading}
              className="text-sm px-3 py-1 bg-pink-600/20 hover:bg-pink-600/30 text-pink-400 border border-pink-600/30 rounded transition-colors disabled:opacity-50"
            >
              {paymentsLoading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>

          {paymentsError && (
            <motion.div 
              className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3 mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <p className="text-red-400 text-sm">{paymentsError}</p>
            </motion.div>
          )}

          {paymentsLoading ? (
            <div className="text-center py-8">
              <p className="text-gray-400">Loading your purchase history...</p>
            </div>
          ) : payments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">No purchases yet. Start buying tickets to see them here!</p>
              <p className="text-gray-500 text-sm mt-2">Purchases will appear here after successful payment.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {payments.map((payment, index) => (
                <motion.div
                  key={payment._id || index}
                  className="bg-gray-900/50 border border-gray-700 rounded-lg p-4 hover:border-pink-600/30 transition-all"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 flex items-start gap-3">
                      {getStatusIcon(payment.status)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-white font-medium">Order {payment.orderId.slice(-8)}</p>
                          <span className={`inline-block px-2 py-1 rounded text-xs font-medium border ${getStatusColor(payment.status)}`}>
                            {payment.status?.toUpperCase() || 'UNKNOWN'}
                          </span>
                        </div>
                        <p className="text-gray-400 text-sm mb-1">
                          {payment.orderDetails?.itemCount
                            ? `${payment.orderDetails.itemCount} item${payment.orderDetails.itemCount > 1 ? 's' : ''}`
                            : 'Tickets'}
                        </p>
                        <p className="text-gray-500 text-xs">{formatDate(payment.createdAt)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-semibold">₹{payment.amount.toFixed(2)}</p>
                    </div>
                  </div>

                  {/* Items details */}
                  {payment.orderDetails?.items && payment.orderDetails.items.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-700">
                      <div className="space-y-1">
                        {payment.orderDetails.items.map((item, itemIndex) => (
                          <p key={itemIndex} className="text-gray-400 text-xs">
                            • {item.name} × {item.quantity}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Logout Button */}
        <motion.button
          onClick={handleLogoutClick}
          className="w-full px-4 py-3 bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-lg transition-colors active:scale-95"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          Logout
        </motion.button>

        {/* Logout Confirmation Popup */}
        {showLogoutConfirm && (
          <div 
            className="fixed z-50 bg-black bg-opacity-50 flex items-center justify-center"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: '100vw',
              height: '100vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }}
          >
            <div className="bg-gray-900 rounded-lg p-6 max-w-sm mx-4 border border-gray-700 shadow-2xl">
              <h3 className="text-xl font-semibold text-white mb-4">Confirm Logout</h3>
              <p className="text-gray-300 mb-6">Are you sure you want to log out?</p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogoutConfirm}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
