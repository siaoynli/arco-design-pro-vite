import axios from 'axios';

export interface KeyData {
  publicKey: string;
}

export function getPublicKey() {
  return axios.get<KeyData>('/publicKey');
}
