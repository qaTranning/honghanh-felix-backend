import { useQueryDetailPayment } from '../../apis';
import type { IPayment } from '../../models';
import { useRouteQuery } from '~/common/hooks/route-query';

export function useDetailPayment() {
  const id = useRouteQuery('id');

  const { currentId, data, ...query } = useQueryDetailPayment();

  const payment = computed(() => data.value?.data as IPayment | undefined);

  onMounted(() => {
    currentId.value = Number(id.value);
  });

  return { ...query, payment };
}
