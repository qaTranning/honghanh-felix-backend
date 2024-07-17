import { createQueryKeys } from '@lukemorales/query-key-factory';

export const paymentQueryKey = createQueryKeys('PAYMENT', {
  list: null,
  detail: (id: number | null) => ({ queryKey: [`detail-${id}`] }),
  commentList: null,
});
