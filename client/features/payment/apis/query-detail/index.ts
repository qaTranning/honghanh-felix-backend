import { useQuery } from '@tanstack/vue-query';
import type { IPayment } from '../../models';
import { requestApi } from '~/common/libs';
import type { IResponseApi } from '~/common/models';
import { allQueriesKeys, type QueryConfig } from '~/queries';

interface IQueryInput {
  params: {
    id: number;
  };
}

function onQuery(req: IQueryInput) {
  const { params } = req;
  return requestApi<never, IResponseApi<IPayment>>({
    method: 'GET',
    url: `invoice/detail`,
    params: {
      ...params,
    },
  });
}

interface IProps {
  configs?: QueryConfig<typeof onQuery>;
}

export function useQueryDetailPayment(props: IProps = {}) {
  const { configs } = props;

  const currentId = ref<number | null>(null);

  const enabledRef = computed(() => !!currentId.value ?? false);

  const queryKey = computed(() => allQueriesKeys.PAYMENT.detail(currentId.value).queryKey);

  const query = useQuery({
    enabled: enabledRef,
    queryKey,

    queryFn: () =>
      onQuery({
        params: { id: currentId.value as number },
      }),
    ...configs,
  });

  return { ...query, currentId };
}
