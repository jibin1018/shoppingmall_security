export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  stock: number;
  category: string;
}

export interface User {
  id: number;
  username: string;
  password: string; // [VULN] 서버가 비밀번호를 응답에 포함해서 넘겨줌
  email: string;
  phone: string;
  address: string;
  role: string;
}

export interface LoginResponse {
  token: string;
  tokenType: string;
  userId: number;
  username: string;
  role: string;
}

export interface AuthState {
  token: string | null;
  userId: number | null;
  username: string | null;
  role: string | null;
}
