import { createQueryKeys } from '@lukemorales/query-key-factory';

export const categoryQueryKey = createQueryKeys('CATEGORY', {
  list: null,
  listInfinity: null,
  detail: (id: number) => ({ queryKey: [`detail-${id}`] }),
});
