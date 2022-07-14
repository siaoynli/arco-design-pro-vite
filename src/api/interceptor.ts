import axios, { AxiosError } from 'axios';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Message, Modal } from '@arco-design/web-vue';
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
    // let each request carry token
    // this example using the JWT token
    // Authorization is a custom headers key
    // please modify it according to the actual situation
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
    // do something
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
      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      // if (
      //   [50008, 50012, 50014].includes(res.code) &&
      //   response.config.url !== '/api/user/info'
      // ) {
      //   Modal.error({
      //     title: 'Confirm logout',
      //     content:
      //       'You have been logged out, you can cancel to stay on this page, or log in again',
      //     okText: 'Re-Login',
      //     async onOk() {
      //       const userStore = useUserStore();
      //
      //       await userStore.logout();
      //       window.location.reload();
      //     },
      //   });
      // }
      return Promise.reject(new Error(res.message || 'Error'));
    }
    return res;
  },
  (error: AxiosError) => {
    const { response } = error;
    Message.error({
      content: response?.data.message || '请求错误，请检查网络!',
      duration: 5 * 1000,
    });
    return Promise.reject(error);
  }
);
