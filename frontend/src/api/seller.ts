import api from './axios';
import { Product } from '../types';

export const getSellerStats = () =>
  api.get<{ productCount: number; totalStock: number }>('/seller/stats');

export const getSellerProducts = () => api.get<Product[]>('/seller/products');

export const createSellerProduct = (data: Partial<Product>) =>
  api.post<Product>('/seller/products', data);

// [VULN] IDOR: productId를 바꾸면 다른 판매자의 상품도 수정 가능
export const updateSellerProduct = (id: number, data: Partial<Product>) =>
  api.put<Product>(`/seller/products/${id}`, data);

// [VULN] IDOR: productId를 바꾸면 다른 판매자의 상품도 삭제 가능
export const deleteSellerProduct = (id: number) =>
  api.delete(`/seller/products/${id}`);
