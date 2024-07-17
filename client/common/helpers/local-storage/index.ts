import { getKeyLocalStorage } from '../key';
import { isClient } from '~/common/env';

// Set localStorage common
export function getLocalStored<T = unknown>(key: string): T | null {
  if (!isClient) return null;

  const stored = localStorage.getItem(getKeyLocalStorage(key));

  return stored ? (JSON.parse(stored) as T) : null;
}

export function setLocalStored<T = unknown>(key: string, data: T): void {
  if (!isClient) return;

  localStorage.setItem(getKeyLocalStorage(key), JSON.stringify(data));
}

export function clearLocalStored(key: string): void {
  if (!isClient) return;

  localStorage.removeItem(getKeyLocalStorage(key));
}
