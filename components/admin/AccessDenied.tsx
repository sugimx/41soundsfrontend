'use client';

import { useRouter } from 'next/navigation';
import { Shield, Home } from 'lucide-react';
import { motion } from 'motion/react';

export function AccessDenied() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-3 sm:p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 sm:p-8 text-center shadow-2xl">
          {/* Icon */}
          <motion.div
            animate={{ rotate: [0, -10, 10, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex justify-center mb-6"
          >
            <div className="bg-red-900/20 p-3 sm:p-4 rounded-full border border-red-700/30">
              <Shield className="w-10 h-10 sm:w-12 sm:h-12 text-red-500" />
            </div>
          </motion.div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Access Denied</h1>

          {/* Description */}
          <p className="text-gray-400 mb-6 text-xs sm:text-sm">
            You don't have permission to access the admin dashboard. Only administrators can access this area.
          </p>

          {/* Warning Box */}
          <div className="bg-red-900/10 border border-red-700/30 rounded-lg p-3 sm:p-4 mb-6">
            <p className="text-red-400 text-xs sm:text-sm font-medium">
              If you believe this is an error, please contact support.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
            <button
              onClick={() => router.push('/')}
              className="flex-1 bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 px-3 sm:px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <Home className="w-4 h-4" />
              Go Home
            </button>
            <button
              onClick={() => router.back()}
              className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2 px-3 sm:px-4 rounded-lg transition-colors duration-200 text-sm sm:text-base"
            >
              Go Back
            </button>
          </div>

          {/* Footer */}
          <p className="text-gray-500 text-xs mt-6">
            41 Sounds Admin Dashboard
          </p>
        </div>
      </motion.div>
    </div>
  );
}
