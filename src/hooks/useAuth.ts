import { useState, useEffect } from 'react';
import { UserProfile } from '../types';

const STORAGE_KEY = 'recall_user_profile';

export function useAuth() {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load user from localStorage', e);
    }
    return null;
  });

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (e) {
      console.error('Failed to save user to localStorage', e);
    }
  }, [user]);

  const loginWithGoogle = (name: string, email: string) => {
    const newUser: UserProfile = {
      id: 'g_' + Math.random().toString(36).substring(2, 9),
      name: name.trim() || 'Scholar',
      email: email.trim(),
      provider: 'google',
      createdAt: new Date().toISOString(),
    };
    setUser(newUser);
    return newUser;
  };

  const loginWithPhone = (phone: string, name: string) => {
    const newUser: UserProfile = {
      id: 'p_' + Math.random().toString(36).substring(2, 9),
      name: name.trim() || 'Scholar',
      phone: phone.trim(),
      provider: 'phone',
      createdAt: new Date().toISOString(),
    };
    setUser(newUser);
    return newUser;
  };

  const logout = () => {
    setUser(null);
  };

  const updateName = (newName: string) => {
    if (!user) return;
    const updated = { ...user, name: newName.trim() || user.name };
    setUser(updated);
  };

  return {
    user,
    isLoggedIn: !!user,
    loginWithGoogle,
    loginWithPhone,
    logout,
    updateName,
  };
}
