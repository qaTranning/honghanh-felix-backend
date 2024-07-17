import { createQueryKeys } from '@lukemorales/query-key-factory';

export const brandQueryKey = createQueryKeys('brand', {
  list: null,
  detail: (id: number) => ({ queryKey: [`detail-${id}`] }),
});
