'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { paymentApi } from '@/lib/api';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'motion/react';

interface CheckoutItem {
  name: string;
  price: number;
  quantity: number;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { user, token } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [items, setItems] = useState<CheckoutItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load cart from localStorage on mount
  useEffect(() => {
    const cartData = localStorage.getItem('cart');
    if (cartData) {
      try {
        setItems(JSON.parse(cartData));
      } catch (e) {
        console.error('Failed to parse cart:', e);
      }
    }
    setIsLoading(false);
  }, []);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.18; // 18% GST
  const total = subtotal + tax;

  // Redirect to login if not authenticated
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
          <h1 className="text-2xl font-bold text-white mb-4">Login Required</h1>
          <p className="text-gray-400 mb-6">You must be logged in to proceed with checkout.</p>
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

  if (isLoading) {
    return (
      <div className="relative min-h-screen bg-black flex items-center justify-center px-4 overflow-hidden">
        <div className="absolute top-0 -z-10 left-1/3 w-96 h-96 bg-pink-600 blur-[300px] opacity-30"></div>
        <div className="absolute bottom-0 -z-10 right-1/4 w-96 h-96 bg-pink-500 blur-[300px] opacity-20"></div>
        <p className="text-gray-400">Loading checkout...</p>
      </div>
    );
  }

  if (items.length === 0) {
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
          <h1 className="text-2xl font-bold text-white mb-4">Your Cart is Empty</h1>
          <p className="text-gray-400 mb-6">Add tickets to your cart before checking out.</p>
          <Link
            href="/tickets"
            className="inline-block px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-lg transition-colors"
          >
            Continue Shopping
          </Link>
        </motion.div>
      </div>
    );
  }

  const handlePayment = async () => {
    setIsProcessing(true);
    setError('');

    try {
      // Generate unique order ID
      const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Create payment order
      const paymentResponse = await paymentApi.createOrder(
        token,
        total,
        orderId,
        {
          name: user.fullName || user.name || 'N/A',
          email: user.email,
          phone: user.mobile || user.phone || '9999999999',
        }
      );

      // If payment link is returned, redirect to it
      if (paymentResponse && paymentResponse.paymentLink) {
        window.location.href = paymentResponse.paymentLink;
      } else if (paymentResponse) {
        // Handle alternative payment flow
        router.push(`/payment-status/${paymentResponse.orderId}`);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to process payment. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-black px-4 py-12 overflow-hidden">
      {/* Gradient blur background */}
      <div className="absolute top-0 -z-10 left-1/3 w-96 h-96 bg-pink-600 blur-[300px] opacity-30"></div>
      <div className="absolute bottom-0 -z-10 right-1/4 w-96 h-96 bg-pink-500 blur-[300px] opacity-20"></div>

      <motion.div
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Back Link */}
        <Link href="/tickets" className="inline-flex items-center text-pink-600 hover:text-pink-500 text-sm mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Tickets
        </Link>

        <h1 className="text-4xl font-bold text-white mb-2">Checkout</h1>
        <p className="text-gray-400 mb-8">Review your order and complete payment</p>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-2">
            <motion.div
              className="bg-gray-900/30 border border-gray-800 rounded-lg p-8 backdrop-blur-sm mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>

              {/* Order Items */}
              <div className="space-y-4 mb-6">
                {items.map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex justify-between items-center pb-4 border-b border-gray-800"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                  >
                    <div>
                      <p className="text-white font-medium">{item.name}</p>
                      <p className="text-gray-400 text-sm">₹{item.price} × {item.quantity}</p>
                    </div>
                    <p className="text-white font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
                  </motion.div>
                ))}
              </div>

              {/* Price Breakdown */}
              <motion.div
                className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 space-y-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <div className="flex justify-between text-gray-300">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Tax (18% GST)</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-white font-bold text-lg pt-3 border-t border-gray-700">
                  <span>Total</span>
                  <span className="text-pink-600">₹{total.toFixed(2)}</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Customer Details */}
            <motion.div
              className="bg-gray-900/30 border border-gray-800 rounded-lg p-8 backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <h3 className="text-lg font-bold text-white mb-4">Billing Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Name</label>
                  <div className="px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white backdrop-blur-sm">{user.fullName || user.name || 'N/A'}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                  <div className="px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white backdrop-blur-sm">{user.email}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Phone</label>
                  <div className="px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white backdrop-blur-sm">{user.mobile || user.phone || 'Not provided'}</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Payment Section */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-6 backdrop-blur-sm sticky top-24">
              <h3 className="text-lg font-bold text-white mb-6">Complete Payment</h3>

              {/* Error Message */}
              {error && (
                <motion.div
                  className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-red-400 text-sm">{error}</p>
                </motion.div>
              )}

              {/* Total Amount */}
              <div className="mb-6 p-4 bg-gray-900/50 border border-gray-800 rounded-lg">
                <p className="text-gray-400 text-sm mb-1">Amount to Pay</p>
                <p className="text-3xl font-bold text-pink-600">₹{total.toFixed(2)}</p>
              </div>

              {/* Payment Methods */}
              <div className="mb-6">
                <p className="text-gray-400 text-sm mb-3">Payment Method</p>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-3 bg-gray-900/50 border border-gray-800 rounded-lg cursor-pointer hover:border-gray-700 transition-colors">
                    <input type="radio" name="payment" defaultChecked className="accent-pink-600" />
                    <span className="text-white font-medium">Debit/Credit Card</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 bg-gray-900/50 border border-gray-800 rounded-lg cursor-pointer hover:border-gray-700 transition-colors">
                    <input type="radio" name="payment" className="accent-pink-600" />
                    <span className="text-white font-medium">UPI</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 bg-gray-900/50 border border-gray-800 rounded-lg cursor-pointer hover:border-gray-700 transition-colors">
                    <input type="radio" name="payment" className="accent-pink-600" />
                    <span className="text-white font-medium">Wallet</span>
                  </label>
                </div>
              </div>

              {/* Pay Button */}
              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full py-3 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-3 active:scale-95"
              >
                {isProcessing ? 'Processing...' : `Pay ₹${total.toFixed(2)}`}
              </button>

              {/* Security Info */}
              <p className="text-xs text-gray-500 text-center">
                Powered by <span className="font-semibold">Cashfree Payments</span>. Your payment is secure.
              </p>

              {/* Promo Code */}
              <div className="mt-6 pt-6 border-t border-gray-800">
                <input
                  type="text"
                  placeholder="Enter promo code"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-600 text-sm focus:outline-none focus:border-white transition-colors"
                />
                <button className="w-full mt-2 py-2 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors text-sm">
                  Apply
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
