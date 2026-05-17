import api from './axios';
import { Product } from '../types';

export const getProducts = () => api.get<Product[]>('/products');
export const searchProducts = (name: string) => api.get<Product[]>(`/products/search?name=${name}`);
export const getByCategory = (category: string) => api.get<Product[]>(`/products/category/${category}`);
