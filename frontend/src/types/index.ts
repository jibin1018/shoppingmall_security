export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  stock: number;
  category: string;
  sellerId?: number;
  sellerBrandName?: string;
}

export interface User {
  id: number;
  username: string;
  password: string;
  email: string;
  phone: string;
  address: string;
  role: string;
  brandName?: string;
}

export interface LoginResponse {
  token: string;
  tokenType: string;
  userId: number;
  username: string;
  role: string;
}

export interface CartItem {
  id: number;
  productId: number;
  quantity: number;
}

export interface OrderItemRequest {
  productId: number;
  productName: string;
  price: number;
  quantity: number;
}

export interface OrderRequest {
  items: OrderItemRequest[];
  totalPrice: number;
  deliveryAddress: string;
  paymentMethod: string;
}

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: number;
  userId: number;
  totalPrice: number;
  status: string;
  deliveryAddress: string;
  paymentMethod: string;
  createdAt: string;
  items: OrderItem[];
}

export interface Event {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  discountRate: number;
  startDate: string;
  endDate: string;
  active: boolean;
}

export interface AuthState {
  token: string | null;
  userId: number | null;
  username: string | null;
  role: string | null;
}
