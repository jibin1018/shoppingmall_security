import api from './axios';
import { Order, OrderRequest } from '../types';

export const createOrder = (data: OrderRequest) =>
  api.post<Order>('/orders', data);
export const getMyOrders = () =>
  api.get<Order[]>('/orders/my');
export const getOrder = (id: number) =>
  api.get<Order>(`/orders/${id}`);
