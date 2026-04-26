'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { pricingData } from '@/data/pricing';
import { ArrowLeft, Minus, Plus, ShoppingCart, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'motion/react';
import Script from 'next/script';
import { paymentApi } from '@/lib/api';

interface CashfreeCheckoutOptions {
  paymentSessionId: string;
  redirectTarget?: string;
}

interface CashfreeInstance {
  checkout: (options: CashfreeCheckoutOptions) => Promise<any>;
}

declare global {
  var Cashfree: ((config: { mode: string }) => CashfreeInstance) | undefined;
}

interface CartItem {
  name: string;
  price: number;
  quantity: number;
}

export default function TicketsPage() {
  const router = useRouter();
  const { token, user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [cashfreeReady, setCashfreeReady] = useState(false);

  // Initialize Cashfree SDK when script loads
  const handleCashfreeLoad = () => {
    if (typeof window !== 'undefined' && typeof window.Cashfree === 'function') {
      setCashfreeReady(true);
    }
  };

  // Redirect to login if not authenticated
  if (!token) {
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
          <p className="text-gray-400 mb-6">You must be logged in to buy tickets.</p>
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

  const handleAddToCart = () => {
    if (!selectedTicket || quantity <= 0) return;

    const ticket = pricingData.find(t => t.name === selectedTicket);
    if (!ticket) return;

    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.name === selectedTicket);
      if (existingItem) {
        return prevCart.map(item =>
          item.name === selectedTicket
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { name: selectedTicket, price: ticket.price, quantity }];
    });

    setSelectedTicket('');
    setQuantity(1);
  };

  const handleRemoveFromCart = (ticketName: string) => {
    setCart(prevCart => prevCart.filter(item => item.name !== ticketName));
  };

  const handleUpdateQuantity = (ticketName: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveFromCart(ticketName);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.name === ticketName
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.18;
  const total = subtotal + tax;

  const handlePayment = async () => {
    if (!cashfreeReady) {
      setError('Cashfree SDK is still loading. Please try again.');
      return;
    }

    if (!user) {
      setError('User information not available. Please log in again.');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      // Step 1: Create payment order on backend
      const paymentResponse = await paymentApi.createOrder(
        token,
        total,
        'Ticket purchase',
        {
          email: user.email,
          phone: user.mobile || user.phone || '9999999999',
        }
      );

      // Step 2: Verify we got the payment session ID
      const paymentSessionId = paymentResponse?.paymentSessionId || paymentResponse?.payment_session_id;
      
      if (!paymentSessionId) {
        throw new Error('Failed to create payment session. Please try again.');
      }

      // Step 3: Initialize Cashfree SDK
      if (!window.Cashfree || typeof window.Cashfree !== 'function') {
        throw new Error('Cashfree SDK not loaded. Please refresh and try again.');
      }

      const cashfree = window.Cashfree({
        mode: process.env.NEXT_PUBLIC_CASHFREE_MODE || 'sandbox',
      });

      // Step 4: Open Cashfree checkout
      const checkoutOptions: CashfreeCheckoutOptions = {
        paymentSessionId: paymentSessionId,
        redirectTarget: '_self',
      };

      // Open the checkout - this will redirect on success
      await cashfree.checkout(checkoutOptions);
    } catch (err: any) {
      console.error('Payment error:', err);
      setError(err.message || 'Failed to process payment. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <>
      {/* Cashfree SDK Script */}
      <Script
        src="https://sdk.cashfree.com/js/v3/cashfree.js"
        onLoad={handleCashfreeLoad}
        strategy="afterInteractive"
      />

      <div className="relative min-h-screen bg-black px-4 py-12 overflow-hidden">
      {/* Gradient blur background */}
      <div className="absolute top-0 -z-10 left-1/3 w-96 h-96 bg-pink-600 blur-[300px] opacity-30"></div>
      <div className="absolute bottom-0 -z-10 right-1/4 w-96 h-96 bg-pink-500 blur-[300px] opacity-20"></div>

      <motion.div
        className="max-w-6xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Back Link */}
        <Link href="/" className="inline-flex items-center text-pink-600 hover:text-pink-500 text-sm mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <h1 className="text-4xl font-bold text-white mb-2">Choose Your Tickets</h1>
        <p className="text-gray-400 mb-8">Select ticket types and quantities to add to your cart</p>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Ticket Selection */}
          <div className="lg:col-span-2">
            <motion.div
              className="bg-gray-900/30 border border-gray-800 rounded-lg p-8 backdrop-blur-sm mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold text-white mb-6">Available Tickets</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {pricingData.map((ticket, index) => (
                  <motion.button
                    key={ticket.name}
                    onClick={() => setSelectedTicket(ticket.name)}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      selectedTicket === ticket.name
                        ? 'border-pink-600 bg-pink-600/10'
                        : 'border-gray-700 bg-gray-900/50 hover:border-gray-600'
                    }`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-white">{ticket.name}</h3>
                      <span className="text-pink-600 font-bold text-lg">₹{ticket.price}</span>
                    </div>
                    <ul className="text-sm text-gray-400 space-y-1">
                      {ticket.features.slice(0, 2).map((feature, i) => (
                        <li key={i}>• {feature}</li>
                      ))}
                    </ul>
                  </motion.button>
                ))}
              </div>

              {selectedTicket && (
                <motion.div
                  className="border-t border-gray-800 pt-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-white font-semibold">Quantity:</span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-white transition-colors"
                      >
                        <Minus size={18} />
                      </button>
                      <span className="text-white font-semibold w-8 text-center">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-white transition-colors"
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className="w-full mt-6 px-4 py-3 bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-lg transition-colors active:scale-95"
                  >
                    <ShoppingCart className="w-5 h-5 inline mr-2" />
                    Add {quantity} x {selectedTicket} to Cart
                  </button>
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Cart Summary */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-6 backdrop-blur-sm sticky top-24">
              <h3 className="text-xl font-bold text-white mb-6">Order Summary</h3>

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

              {cart.length === 0 ? (
                <p className="text-gray-400 text-center py-8">Your cart is empty</p>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.map((item) => (
                      <motion.div
                        key={item.name}
                        className="flex justify-between items-center pb-4 border-b border-gray-800"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="flex-1">
                          <p className="text-white font-semibold">{item.name}</p>
                          <p className="text-gray-400 text-sm">₹{item.price} × {item.quantity}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleUpdateQuantity(item.name, item.quantity - 1)}
                              className="p-1 text-gray-400 hover:text-white"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="w-6 text-center text-white text-sm">{item.quantity}</span>
                            <button
                              onClick={() => handleUpdateQuantity(item.name, item.quantity + 1)}
                              className="p-1 text-gray-400 hover:text-white"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                          <button
                            onClick={() => handleRemoveFromCart(item.name)}
                            className="ml-2 text-red-500 hover:text-red-400 text-sm font-semibold"
                          >
                            Remove
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="space-y-3 pb-6 border-b border-gray-800">
                    <div className="flex justify-between text-gray-400">
                      <span>Subtotal</span>
                      <span>₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>Tax (18% GST)</span>
                      <span>₹{tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-white font-bold text-lg">
                      <span>Total</span>
                      <span className="text-pink-600">₹{total.toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    onClick={handlePayment}
                    disabled={isProcessing || !cashfreeReady}
                    className="w-full mt-6 px-4 py-3 bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-lg transition-colors active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {!cashfreeReady ? 'Loading Payment...' : isProcessing ? 'Processing...' : `Pay Now ₹${total.toFixed(2)}`}
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
    </>
  );
}
