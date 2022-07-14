import { defineStore } from 'pinia';
import { getCode } from '@/api/code';

import { CodeState } from './types';

const useCodeStore = defineStore('code', {
  state: (): CodeState => ({
    key: undefined,
    expireAt: undefined,
    error: undefined,
  }),

  getters: {
    codeInfo(state: CodeState): CodeState {
      return { ...state };
    },
  },

  actions: {
    async sendCode(phoneNumber: string) {
      const res = await getCode(phoneNumber);
      this.setInfo(res.data);
    },
    setInfo(partial: Partial<CodeState>) {
      this.$patch(partial);
    },
  },
});

export default useCodeStore;
