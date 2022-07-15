import { createPinia } from 'pinia';
import useAppStore from './modules/app';
import useUserStore from './modules/user';
import usePublicKeyStore from './modules/public-key';
import useCodeStore from './modules/code';
import useTabBarStore from './modules/tab-bar';

const pinia = createPinia();

export {
  useAppStore,
  useUserStore,
  useCodeStore,
  usePublicKeyStore,
  useTabBarStore,
};
export default pinia;
