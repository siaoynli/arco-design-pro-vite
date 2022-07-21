import { createPinia } from 'pinia';
import useAppStore from './modules/app';
import useUserStore from './modules/user';
import usePublicKeyStore from './modules/public-key';
import useTabBarStore from './modules/tab-bar';

const pinia = createPinia();

export { useAppStore, useUserStore, usePublicKeyStore, useTabBarStore };
export default pinia;
