'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from './auth-context';
import { isAdminRole } from './adminApi';

interface AdminContextType {
  isAdmin: boolean;
  isLoading: boolean;
  adminRole?: string;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const { user, isLoading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminRole, setAdminRole] = useState<string>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user has admin role (you may need to add role field to user object from backend)
    const userRole = (user as any)?.role;
    const hasAdminAccess = isAdminRole(userRole);
    
    setIsAdmin(hasAdminAccess);
    setAdminRole(userRole);
    setIsLoading(authLoading);
  }, [user, authLoading]);

  return (
    <AdminContext.Provider value={{ isAdmin, isLoading, adminRole }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
}
