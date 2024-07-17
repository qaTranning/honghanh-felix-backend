import { useQueryAllDataPaymentComment } from '../../apis';

export function usePaymentComment() {
  const { listData, meta } = useQueryAllDataPaymentComment({});

  return { listData };
}
