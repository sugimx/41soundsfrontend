'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { CheckCircle, AlertCircle, Home } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

function PaymentStatusContent() {
  const searchParams = useSearchParams();
  const status = searchParams.get('status') || 'success';
  const orderId = searchParams.get('orderId') || '';

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md text-center">
        {status === 'success' ? (
          <>
            <div className="mb-6 flex justify-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </div>

            <h1 className="text-3xl font-bold text-white mb-2">Payment Successful!</h1>
            <p className="text-gray-400 mb-6">
              Your payment has been processed successfully. Your concert tickets have been sent to your email.
            </p>

            {orderId && (
              <div className="mb-6 p-4 bg-gray-900 rounded-lg">
                <p className="text-gray-400 text-sm">Order ID</p>
                <p className="text-white font-mono font-semibold">{orderId}</p>
              </div>
            )}

            <div className="space-y-3">
              <p className="text-gray-400 text-sm">
                Check your email for ticket details and further instructions.
              </p>
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Home size={20} />
                Back to Home
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="mb-6 flex justify-center">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
            </div>

            <h1 className="text-3xl font-bold text-white mb-2">Payment Failed</h1>
            <p className="text-gray-400 mb-6">
              Your payment could not be processed. Please try again or contact support.
            </p>

            {orderId && (
              <div className="mb-6 p-4 bg-gray-900 rounded-lg">
                <p className="text-gray-400 text-sm">Order ID</p>
                <p className="text-white font-mono font-semibold">{orderId}</p>
              </div>
            )}

            <div className="space-y-3">
              <Link
                href="/tickets"
                className="block px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition-colors"
              >
                Try Again
              </Link>
              <Link
                href="/"
                className="block px-6 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function PaymentStatusPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center"><p className="text-gray-400">Loading...</p></div>}>
      <PaymentStatusContent />
    </Suspense>
  );
}
