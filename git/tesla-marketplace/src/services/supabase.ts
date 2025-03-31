import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';

// Replace with your Supabase URL and anon key
const supabaseUrl = 'https://wxhcssvgueaxvjfvpzqz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4aGNzc3ZndWVheHZqZnZwenF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0OTA5MzIsImV4cCI6MjA1ODA2NjkzMn0.uTtFVNixi2OHmx7zGvXDGrM6nBjcGLkw-1EbdsrAhEo';

// Custom storage implementation for React Native using Expo's SecureStore
const ExpoSecureStoreAdapter = {
  getItem: (key: string) => {
    return SecureStore.getItemAsync(key);
  },
  setItem: (key: string, value: string) => {
    return SecureStore.setItemAsync(key, value);
  },
  removeItem: (key: string) => {
    return SecureStore.deleteItemAsync(key);
  },
};

// Initialize the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Authentication helper functions
export const signUp = async (email: string, password: string) => {
  return await supabase.auth.signUp({ email, password });
};

export const signIn = async (email: string, password: string) => {
  return await supabase.auth.signInWithPassword({ email, password });
};

export const signOut = async () => {
  return await supabase.auth.signOut();
};

export const getCurrentUser = async () => {
  return await supabase.auth.getUser();
};
