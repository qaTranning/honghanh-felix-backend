export type TMode = 'production' | 'dev';

export const MODE = import.meta.env.MODE as TMode;

export const isProduction = MODE === 'production';

export const isDevelopment = MODE === 'dev';

export const isClient = typeof window !== 'undefined';

export const API_ENDPOINT = process.env.NUXT_API_ENDPOINT || 'https://felix-api.zackco.com/api/v1';

function getApiEndpoint() {
  const config = useRuntimeConfig();
  return config.public.API_ENDPOINT || 'https://felix-api.zackco.com/api/v1';
}

export const ENV_FUNC = { getApiEndpoint };
