/**
 * Authentication Context
 * Manages authentication state throughout the application
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { tokenStorage, storage } from '../utils';
import { STORAGE_KEYS } from '../constants';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User, token: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user data from storage on mount
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const [storedUser, token] = await Promise.all([
        storage.getItem<User>(STORAGE_KEYS.USER_DATA),
        tokenStorage.getAccessToken(),
      ]);

      if (storedUser && token) {
        setUser(storedUser);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (userData: User, token: string) => {
    try {
      await Promise.all([
        tokenStorage.setAccessToken(token),
        storage.setItem(STORAGE_KEYS.USER_DATA, userData),
      ]);
      setUser(userData);
    } catch (error) {
      console.error('Error saving user data:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await Promise.all([
        tokenStorage.clearTokens(),
        storage.removeItem(STORAGE_KEYS.USER_DATA),
      ]);
      setUser(null);
    } catch (error) {
      console.error('Error clearing user data:', error);
    }
  };

  const updateUser = (userData: User) => {
    setUser(userData);
    storage.setItem(STORAGE_KEYS.USER_DATA, userData);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
