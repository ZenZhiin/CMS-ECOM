import { LoginDto, AuthResponse } from '@cms/shared';
import { apiFetch } from '../lib/api';
import Cookies from 'js-cookie';

export const authService = {
  async login(dto: LoginDto): Promise<AuthResponse> {
    const response: AuthResponse = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify(dto),
    });

    // Store token in cookie for 7 days
    Cookies.set('auth_token', response.accessToken, { expires: 7 });
    Cookies.set('user_data', JSON.stringify(response.user), { expires: 7 });

    return response;
  },

  async register(dto: any): Promise<AuthResponse> {
    const response: AuthResponse = await apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify(dto),
    });
    return response;
  },

  logout() {
    Cookies.remove('auth_token');
    Cookies.remove('user_data');
    window.location.href = '/admin';
  },

  getUser() {
    const user = Cookies.get('user_data');
    return user ? JSON.parse(user) : null;
  }
};
