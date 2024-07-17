import { createQueryKeys } from '@lukemorales/query-key-factory';

export const reviewQueryKey = createQueryKeys('review', {
  list: null,
  detail: (id: number | null) => ({ queryKey: [`detail-${id}`] }),
});
