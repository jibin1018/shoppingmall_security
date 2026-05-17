import api from './axios';
import { CartItem } from '../types';

export const getCart = () => api.get<CartItem[]>('/cart');
export const addToCart = (productId: number, quantity: number) =>
  api.post<CartItem>('/cart', { productId, quantity });
export const updateQuantity = (itemId: number, quantity: number) =>
  api.put<CartItem>(`/cart/${itemId}`, { quantity });
export const deleteCartItem = (itemId: number) =>
  api.delete(`/cart/${itemId}`);
