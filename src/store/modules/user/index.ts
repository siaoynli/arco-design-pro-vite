import { defineStore } from 'pinia';
import {
  login as userLogin,
  logout as userLogout,
  clearCache,
  getUserInfo,
  LoginData,
} from '@/api/user';
import { setToken, clearToken } from '@/utils/auth';
import { removeRouteListener } from '@/utils/route-listener';
import rsaEncrypt from '@/utils/rsa';
import { RoleType, UserState } from './types';
import useAppStore from '../app';

const useUserStore = defineStore('user', {
  state: (): UserState => ({
    id: undefined,
    name: undefined,
    email: undefined,
    email_verified_at: undefined,
    created_at: undefined,
    updated_at: undefined,
    phone: undefined,
    avatar: undefined,
    nick_name: undefined,
    cn_name: undefined,
    gender: undefined,
    qq: undefined,
    address: undefined,
    login_count: undefined,
    login_error_count: undefined,
    login_time: undefined,
    login_ip: undefined,
    status: undefined,
    remarks: undefined,
    role_id: undefined,
    department_id: undefined,
    is_admin: undefined,
    login_notification: undefined,
    phone_verified_at: undefined,
    wx_openid: undefined,
    qq_openid: undefined,
    ios_openid: undefined,
    device_hash: undefined,
    open_comment: undefined,
    certification: undefined,
    invite_code: undefined,
    deleted_at: undefined,
    role: '',
  }),

  getters: {
    userInfo(state: UserState): UserState {
      return { ...state };
    },
  },

  actions: {
    switchRoles() {
      return new Promise((resolve) => {
        this.role = this.role === 'user' ? 'admin' : 'user';
        resolve(this.role);
      });
    },
    // 设置userStore
    setInfo(partial: Partial<UserState>) {
      this.$patch(partial);
    },

    // 重置用户信息
    resetInfo() {
      this.$reset();
    },

    // 获取用户信息
    async info() {
      const res = await getUserInfo();
      this.setInfo(res.data);
    },

    // 登陆
    async login(loginForm: LoginData, publicKey: string) {
      try {
        // 密码加密
        if (loginForm.password && publicKey) {
          loginForm.password = rsaEncrypt(loginForm.password, publicKey);
        }

        const res = await userLogin(loginForm);
        setToken(res.data.token);
      } catch (err) {
        clearToken();
        throw err;
      }
    },

    // 清除缓存
    async clearCache() {
      await clearCache();
    },

    // 不管是否退出，执行这个清理动作
    logoutCallBack() {
      const appStore = useAppStore();
      this.resetInfo();
      clearToken();
      removeRouteListener();
      appStore.clearServerMenu();
    },
    // 退出
    async logout() {
      try {
        await userLogout();
      } finally {
        this.logoutCallBack();
      }
    },
  },
});

export default useUserStore;
