'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { tokenStorage, authApi, UserProfile } from './api';

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, fullName: string, password: string, mobile: string, gender: string, dateOfBirth: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth from localStorage
  useEffect(() => {
    const storedToken = tokenStorage.getToken();
    if (storedToken) {
      setToken(storedToken);
      // Fetch user profile
      authApi
        .getProfile(storedToken)
        .then((user) => {
          console.log('✅ User profile loaded:', user);
          if (user) {
            setUser(user);
          }
        })
        .catch((err) => {
          console.error('❌ Failed to fetch profile:', err);
          // Don't clear token immediately - might be temporary error
          // tokenStorage.removeToken();
          // setToken(null);
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.login(email, password);
      if (response && response.token) {
        tokenStorage.setToken(response.token);
        setToken(response.token);
        if (response.user) {
          setUser(response.user as UserProfile);
        }
      }
    } catch (error) {
      throw error;
    }
  };

  const register = async (email: string, fullName: string, password: string, mobile: string, gender: string, dateOfBirth: string) => {
    try {
      const response = await authApi.register(email, fullName, password, mobile, gender, dateOfBirth);
      if (response && response.token) {
        tokenStorage.setToken(response.token);
        setToken(response.token);
        if (response.user) {
          setUser(response.user as UserProfile);
        }
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await authApi.logout(token);
      }
    } finally {
      tokenStorage.removeToken();
      setToken(null);
      setUser(null);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!token) throw new Error('Not authenticated');
    const updatedUser = await authApi.updateProfile(token, updates);
    if (updatedUser) {
      setUser(updatedUser);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
