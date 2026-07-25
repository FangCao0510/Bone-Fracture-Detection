'use client';

import type { User } from '@/types/user';
import axiosInstance from "@/lib/axios/axios";

function generateToken(): string {
  const arr = new Uint8Array(12);
  window.crypto.getRandomValues(arr);
  return Array.from(arr, (v) => v.toString(16).padStart(2, '0')).join('');
}

export interface SignUpParams {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface SignInWithOAuthParams {
  provider: 'google' | 'discord';
}

export interface SignInWithPasswordParams {
  username: string;
  password: string;
}

export interface ResetPasswordParams {
  email: string;
}

class AuthClient {
  async signUp(_: SignUpParams): Promise<{ error?: string }> {
    // Make API request

    // We do not handle the API, so we'll just generate a token and store it in localStorage.
    const token = generateToken();
    localStorage.setItem('custom-auth-token', token);

    return {};
  }

  async signInWithPassword(params: SignInWithPasswordParams): Promise<{ error?: string }> {
    // Make API request
    try {
      const res = await axiosInstance.post('/auth/login', params)
      const token = res.data.token as string;
      localStorage.setItem('access_token', token);
      return {};
    }catch(err) {
      return { error: 'Tên đăng nhập hoặc mật khẩu không đúng.' };
    }
  }

  async resetPassword(_: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: 'Password reset not implemented' };
  }

  async getUser(): Promise<{ data?: User | null; error?: string }> {
    // Make API request

    // We do not handle the API, so just check if we have a token in localStorage.
    const token = localStorage.getItem('access_token');

    if (!token) {
      return { data: null };
    }
    try{
      const response = await axiosInstance.get('/auth/current-user')
      const user = response.data
      return { data: user };
    }catch (err) {
      return { error: "Phiên đăng nhập hết hạn." };
    }

  }

  async signOut(): Promise<{ error?: string }> {
    localStorage.removeItem('access_token');

    return {};
  }
}

export const authClient = new AuthClient();
