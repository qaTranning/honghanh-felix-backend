import type { UseAuthStore } from '../../stores/index.store';
import { getLocalStored, clearLocalStored } from '~/common/helpers/local-storage';

export function authGetAccessToken() {
  const stored: UseAuthStore | null = getLocalStored('auth');
  if (!stored) {
    return '';
  }

  return stored?.auth?.accessToken || '';
}

export function authDeleteAccessToken() {
  return clearLocalStored('auth');
}
