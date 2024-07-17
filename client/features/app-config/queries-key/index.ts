import { createQueryKeys } from '@lukemorales/query-key-factory';

export const appConfigQueryKey = createQueryKeys('APP-CONFIG', {
  list: null,
  detail: (id: number) => ({ queryKey: [`detail-${id}`] }),
  detailName: (name: string) => ({ queryKey: [`detail-name-${name}`] }),
});
