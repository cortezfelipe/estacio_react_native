import React, { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/api';



/**
 * Authentication context used to share user state across the application.
 * Exposes functions to sign in, sign up, and sign out.  Stores
 * authentication token and user info in persistent storage using AsyncStorage.
 */
export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  // Load any existing token/user from AsyncStorage on mount
  const loadStorageData = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('@parkingapp:user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        api.defaults.headers.common['Authorization'] = `Bearer ${parsedUser.accessToken}`; // ✅ setando o token
      }
    } catch (err) {
      console.error('Failed to load user from storage', err);
    } finally {
      setLoading(false);
    }
  };
  loadStorageData();
}, []);


  const signIn = async (email, password) => {
    try {
      const response = await api.post('/auth/signin', { email, password });
      // The backend returns `{ user: { ... }, accessToken }`. Consolidate the
      // response so screens can access user fields directly without drilling
      // into `user`.
      const userData = {
        ...response.data.user,
        role: response.data.user.isManager ? 'manager' : 'user',
        accessToken: response.data.accessToken,
      };

      setUser(userData);
      await AsyncStorage.setItem('@parkingapp:user', JSON.stringify(userData));
      api.defaults.headers.common['Authorization'] = `Bearer ${userData.accessToken}`;
      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, message: err?.response?.data?.message || 'Login failed' };
    }
  };

  const signUp = async (name, email, password) => {
    try {
      await api.post('/auth/signup', { name, email, password });
      // After successful signup, automatically sign in
      return signIn(email, password);
    } catch (err) {
      console.error(err);
      return { success: false, message: err?.response?.data?.message || 'Signup failed' };
    }
  };

  const signOut = async () => {
    setUser(null);
    api.defaults.headers.common['Authorization'] = '';
    await AsyncStorage.removeItem('@parkingapp:user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};