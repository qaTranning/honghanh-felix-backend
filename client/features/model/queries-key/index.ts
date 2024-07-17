import { createQueryKeys } from '@lukemorales/query-key-factory';

export const modelQueryKey = createQueryKeys('model', {
  // list: null,
  comcard: (id: number | null) => ({ queryKey: [`comcard-preview-${id}`] }),
  comcardDetail: (id: number | null) => ({ queryKey: [`comcard-detail-${id}`] }),
});
