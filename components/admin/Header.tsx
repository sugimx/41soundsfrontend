'use client';

import { useAuth } from '@/lib/auth-context';

export function AdminHeader() {
  const { user } = useAuth();

  return (
    <header className="bg-gray-900 border-b border-gray-800 px-4 lg:px-6 lg:sticky top-0 z-30 shrink-0">
      <div className="flex items-center justify-between gap-4">
      </div>
    </header>
  );
}
