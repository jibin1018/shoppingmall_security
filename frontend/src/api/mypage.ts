import api from './axios';
import { User } from '../types';

// [VULN] IDOR - 클라이언트가 userId를 직접 URL에 넣어서 요청
export const getMypage = (userId: number) =>
  api.get<User>(`/mypage/${userId}`);

export const updateMypage = (userId: number, data: { phone: string; address: string }) =>
  api.put<User>(`/mypage/${userId}`, data);
