import { useQuery } from '@tanstack/vue-query';
import type { ICategory } from '../../models';
import { requestApi } from '~/common/libs';
import type { IResponseApi } from '~/common/models';
import { allQueriesKeys, type QueryConfig } from '~/queries';

interface IRequest {
  params: {
    id: number;
  };
}

function queryDetailCategory(req: IRequest) {
  const { params } = req;
  return requestApi<typeof params, IResponseApi<ICategory>>({
    method: 'GET',
    url: `category/detail`,
    params,
  });
}
interface UseConfig {
  configs?: QueryConfig<typeof queryDetailCategory>;
}

export function useQueryDetailCategory(props: UseConfig) {
  const { configs } = props;
  const categoryId = ref<number | null>(null);

  const enabled = computed(() => !!categoryId.value);
  const queryKey = computed(
    () => allQueriesKeys.CATEGORY.detail(categoryId.value as number).queryKey
  );

  const query = useQuery({
    queryKey,
    enabled,
    queryFn: () =>
      queryDetailCategory({
        params: { id: categoryId.value as number },
      }),
    ...configs,
  });

  return {
    query,
    categoryId,
  };
}
