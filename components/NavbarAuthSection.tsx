'use client'

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { LogOut } from 'lucide-react';

export function NavbarAuthSection() {
  const [isMounted, setIsMounted] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { user, token, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Only render after client-side hydration AND auth loading is complete
  if (!isMounted || isLoading) {
    // Render placeholder with same width to prevent layout shift
    return (
      <div className="hidden md:flex items-center gap-4">
        <div className="px-4 py-2 text-sm text-transparent">Loading...</div>
      </div>
    );
  }

  // Desktop view
  if (token && user) {
    const displayName = user.fullName || user.name;
    const userInitial = displayName
      ? displayName.trim().split(' ')[0].charAt(0).toUpperCase()
      : 'U';

    const handleLogoutConfirm = async () => {
      setShowLogoutConfirm(false);
      await logout();
      router.push('/');
    };

    return (
      <>
        <div className="hidden md:flex items-center gap-4">
          <Link 
            href="/profile" 
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            {user.profileImage ? (
              <img 
                src={user.profileImage} 
                alt={displayName || 'Profile'}
                className="w-10 h-10 rounded-full object-cover border-2 border-pink-500"
              />
            ) : (
              <div className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center text-white font-semibold">
                {userInitial}
              </div>
            )}
            <span className="text-sm text-white hidden lg:block">
              {displayName || 'Profile'}
            </span>
          </Link>
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="text-gray-400 hover:text-red-500 transition-colors p-2"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>

        {/* Logout Confirmation Popup - Desktop */}
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
      </>
    );
  }

  // Not authenticated
  return (
    <div className="hidden md:flex items-center gap-4">
              <Link
        href="/register"
        className="px-4 py-1.5 text-sm bg-white text-black hover:bg-gray-200 active:scale-95 transition-all rounded-full"
      >
        Sign Up
      </Link>
      <Link
        href="/login"
        className="px-6 py-2.5 bg-pink-600 hover:bg-pink-700 active:scale-95 transition-all rounded-full"
      >
        Sign In
      </Link>
    </div>
  );
}

export function NavbarMobileAuthSection({ onClose }: { onClose?: () => void }) {
  const [isMounted, setIsMounted] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { user, token, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Only render after client-side hydration AND auth loading is complete
  if (!isMounted || isLoading) {
    return null;
  }

  // Mobile view - authenticated
  if (token && user) {
    const handleLogoutConfirm = async () => {
      setShowLogoutConfirm(false);
      await logout();
      onClose?.();
      router.push('/');
    };

    return (
      <>
        <Link 
          href="/profile" 
          onClick={onClose} 
          className="px-4 py-2 bg-pink-600 hover:bg-pink-700 active:scale-95 transition-all rounded-full"
        >
          Profile
        </Link>
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 active:scale-95 transition-all rounded-full flex items-center gap-2"
        >
          <LogOut size={18} />
          Logout
        </button>

        {/* Logout Confirmation Popup - Mobile */}
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
      </>
    );
  }

  // Mobile view - not authenticated
  return (
    <>
          <Link
        href="/register"
        onClick={onClose}
        className="px-4 py-2 bg-white text-black hover:bg-gray-100 active:scale-95 transition-all rounded-full"
      >
        Sign Up
      </Link>
      <Link
        href="/login"
        onClick={onClose}
        className="px-6 py-2.5 bg-pink-600 hover:bg-pink-700 active:scale-95 transition-all rounded-full"
      >
        Sign In
      </Link>
    </>
  );
}
