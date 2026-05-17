import api from './axios';
import { LoginResponse } from '../types';

export const login = (username: string, password: string) =>
  api.post<LoginResponse>('/auth/login', { username, password });

export const register = (data: {
  username: string;
  password: string;
  email: string;
  phone: string;
  address: string;
}) => api.post<string>('/auth/register', data);
