import type { Router, LocationQueryRaw } from 'vue-router';
import NProgress from 'nprogress'; // progress bar

import { useUserStore } from '@/store';
import { isLogin } from '@/utils/auth';

// 路由守卫
export default function setupUserLoginInfoGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    NProgress.start();
    const userStore = useUserStore();
    if (isLogin()) {
      console.log('user role:', userStore.role);
      if (userStore.role) {
        // 如果登陆状态，直接输入login地址，跳转到Workplace
        if (to.name === 'login') {
          next({
            name: 'Workplace',
            query: {
              ...to.query,
            } as LocationQueryRaw,
          });
        } else {
          next();
        }
      } else {
        try {
          await userStore.info();
          next();
        } catch (error) {
          next({
            name: 'login',
            query: {
              redirect: to.name,
              ...to.query,
            } as LocationQueryRaw,
          });
        }
      }
    } else {
      // 不是登陆状态,进入到内页，直接跳转到login
      if (to.name === 'login') {
        next();
        return;
      }
      next({
        name: 'login',
        query: {
          redirect: to.name,
          ...to.query,
        } as LocationQueryRaw,
      });
    }
  });
}
