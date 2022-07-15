import axios from 'axios';
import type { RouteRecordNormalized } from 'vue-router';
import { UserState } from '@/store/modules/user/types';

export interface LoginData {
  email?: string;
  password?: string;
  phone?: string;
  code?: string;
  key?: string;
  loginType: string;
}

export interface LoginRes {
  token: string;
  expireAt: string;
}

export function login(data: LoginData) {
  return axios.post<LoginRes>('/login', data);
}

export function logout() {
  return axios.post<LoginRes>('/user/logout');
}

export function getUserInfo() {
  return axios.post<UserState>('/user/current');
}

export function clearCache() {
  return axios.get('/clearCache');
}

export function getMenuList() {
  return axios.post<RouteRecordNormalized[]>('/api/user/menu');
}
