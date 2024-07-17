import { isProduction } from '@/common/env';

const devKey = isProduction ? '' : '-dev';

export function getKeyLocalStorage(key: string) {
  return key + devKey;
}
