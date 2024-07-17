import { useQuery } from '@tanstack/vue-query';
import type { IBrand } from '../../models';
import { requestApi } from '~/common/libs';
import type { IResponseApi } from '~/common/models';
import { allQueriesKeys, type QueryConfig } from '~/queries';

interface IRequest {
  params: {
    id: number;
  };
}

export function onQuery(req: IRequest) {
  const { params } = req;

  return requestApi<typeof params, IResponseApi<IBrand>>({
    method: 'GET',
    url: 'brand/detail',
    params,
  });
}

interface IProps {
  configs?: QueryConfig<typeof onQuery>;
}

export function useQueryDetailBrand(props: IProps) {
  const { configs } = props;
  const brandId = ref<number | null>(null);

  const enabled = computed(() => !!brandId.value);
  const queryKey = computed(() => allQueriesKeys.brand.detail(brandId.value as number).queryKey);

  const query = useQuery({
    queryKey,
    enabled,
    queryFn: () =>
      onQuery({
        params: { id: brandId.value as number },
      }),
    ...configs,
  });

  return {
    query,
    brandId,
  };
}
