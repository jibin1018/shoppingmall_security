import api from './axios';
import { User, Product, Order, Event } from '../types';

export const getStats = () =>
  api.get<{ totalUsers: number; totalProducts: number; totalOrders: number; totalRevenue: number }>('/admin/stats');
export const getUsers = () => api.get<User[]>('/admin/users');
export const updateRole = (id: number, role: string, brandName?: string) =>
  api.put<User>(`/admin/users/${id}/role`, { role, ...(brandName ? { brandName } : {}) });
export const getAdminOrders = () => api.get<Order[]>('/admin/orders');
export const updateOrderStatus = (id: number, status: string) =>
  api.put<Order>(`/admin/orders/${id}/status`, { status });
export const updateProduct = (id: number, data: Partial<Product>) =>
  api.put<Product>(`/admin/products/${id}`, data);
export const deleteProduct = (id: number) =>
  api.delete(`/admin/products/${id}`);
export const createEvent = (data: Partial<Event>) =>
  api.post<Event>('/admin/events', data);
export const deleteEvent = (id: number) =>
  api.delete(`/admin/events/${id}`);
