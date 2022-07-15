import axios, { AxiosError } from 'axios';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Message } from '@arco-design/web-vue';
import { useUserStore } from '@/store';
import { getToken } from '@/utils/auth';

export interface HttpResponse<T = unknown> {
  message: string;
  error: number;
  data: T;
}

if (import.meta.env.VITE_API_BASE_URL) {
  axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
}

// 添加请求拦截器
axios.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // 每个请求头部都带token
    const token = getToken();
    if (token) {
      if (!config.headers) {
        config.headers = {};
      }
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // 出现错误，抛出异常
    return Promise.reject(error);
  }
);
// 添加响应拦截器
axios.interceptors.response.use(
  (response: AxiosResponse<HttpResponse>) => {
    console.log('response:', response);
    const res = response.data;
    if (res.error) {
      Message.error({
        content: res.message || 'Error',
        duration: 5 * 1000,
      });

      return Promise.reject(new Error(res.message || 'Error'));
    }
    if (res.message) {
      Message.success(res.message);
    }
    return res;
  },
  async (error: AxiosError) => {
    const { response } = error;
    console.log('reject response:', response);
    Message.error({
      content: response?.data.message || '请求错误，请检查网络!',
      duration: 5 * 1000,
    });
    // 没有权限，token失效
    if (response && [401].includes(response.status)) {
      const userStore = useUserStore();
      await userStore.logout();
    }

    return Promise.reject(error);
  }
);
