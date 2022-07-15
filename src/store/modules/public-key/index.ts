import { defineStore } from 'pinia';

import { getPublicKey } from '@/api/public-key';
import { PublicKeyState } from './types';

const usePublicKeyStore = defineStore('publicKey', {
  state: (): PublicKeyState => ({
    publicKey: undefined,
  }),

  getters: {
    keyInfo(state: PublicKeyState): PublicKeyState {
      return { ...state };
    },
  },

  actions: {
    setInfo(partial: Partial<PublicKeyState>) {
      this.$patch(partial);
    },

    async getPublicKey() {
      const res = await getPublicKey();
      this.setInfo(res.data);
    },
  },
});

export default usePublicKeyStore;
