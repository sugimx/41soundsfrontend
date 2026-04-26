'use client'

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { LogOut } from 'lucide-react';

export function NavbarAuthSection() {
  const [isMounted, setIsMounted] = useState(false);
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

    const handleLogout = async () => {
      await logout();
      router.push('/');
    };

    return (
      <div className="hidden md:flex items-center gap-4">
        <Link 
          href="/profile" 
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <div className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center text-white font-semibold">
            {userInitial}
          </div>
          <span className="text-sm text-white hidden lg:block">
            {displayName || 'Profile'}
          </span>
        </Link>
        <button
          onClick={handleLogout}
          className="text-gray-400 hover:text-red-500 transition-colors p-2"
          title="Logout"
        >
          <LogOut size={20} />
        </button>
      </div>
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

    const handleLogout = async () => {
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
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 active:scale-95 transition-all rounded-full flex items-center gap-2"
        >
          <LogOut size={18} />
          Logout
        </button>
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
