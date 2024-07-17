import { createQueryKeys } from '@lukemorales/query-key-factory';

export const campaignQueryKey = createQueryKeys('campaign', {
  list: null,
  detail: (id: number | null) => ({ queryKey: [`detail-${id}`] }),

  // role
  role: null,
  roleDetail: (id: number | null) => ({ queryKey: [`role-detail-${id}`] }),

  // register
  register: null,

  // review
  review: null,
});
