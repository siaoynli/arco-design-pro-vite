import axios from 'axios';

export interface CodeData {
  key: string;
  expireAt: string;
  error: number;
}

export function getCode(phone: string) {
  return axios.post<CodeData>('/code', { phone });
}
