import { ref, computed } from 'vue';
import { AUTH_STORE_KEY } from '../constants';
import type { IAuthUserLoginResponse } from './../models/index';
import { KEY_HELPER } from '~~/client/common/helpers';

const DEFAULT_VALUE: Partial<IAuthUserLoginResponse> = {
  user: undefined,
  accessToken: '',
  refreshToken: '',
  expiredAt: 0,
};

export const useAuthStore = defineStore(
  KEY_HELPER.getKeyLocalStorage(AUTH_STORE_KEY),
  () => {
    const auth = ref<Partial<IAuthUserLoginResponse>>({ ...DEFAULT_VALUE });

    const accessToken = computed(() => (auth.value ? auth.value.accessToken : ''));
    const refreshToken = computed(() => (auth.value ? auth.value.refreshToken : ''));
    const user = computed(() => (auth.value ? auth.value.user : ''));
    function setAuth(data: IAuthUserLoginResponse) {
      auth.value = data;
    }

    function resetAuth() {
      auth.value = { ...DEFAULT_VALUE };
    }
    return { auth, setAuth, resetAuth, accessToken, refreshToken, user };
  },
  {
    persist: true,
  }
);

export type UseAuthStore = { auth: any | null };
