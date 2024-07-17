import { createQueryKeys } from '@lukemorales/query-key-factory';

export const userQueryKey = createQueryKeys('user', {
  list: null,
  listInfinity: null,
  listIds: (ids: number[] | null) => ({ queryKey: [`list-${ids?.join('-')}`] }),
  detail: (id: number | null) => ({ queryKey: [`detail-${id}`] }),
  // detail: null,
});
