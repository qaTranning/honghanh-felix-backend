import { useQuery } from '@tanstack/vue-query';
import type { IUser } from '../../models';
import { requestApi } from '~/common/libs';
import type { IResponseApi } from '~/common/models';
import { allQueriesKeys, type QueryConfig } from '~/queries';

interface IGetUsersByIdsRequest {
  params: { listIds: number[] };
}

function getUsersByIdsRequest(req: IGetUsersByIdsRequest) {
  const { params } = req;
  return requestApi<any, IResponseApi<IUser[]>>({
    method: 'POST',
    url: 'user/get-by-ids',
    data: {
      idList: params.listIds,
    },
  });
}

interface UseGetUsersByIdsQueryProps {
  configs?: QueryConfig<typeof getUsersByIdsRequest>;
  listIds?: Ref<number[]>;
}

export function useGetUsersByIdsQuery(props: UseGetUsersByIdsQueryProps = {}) {
  const { listIds, configs } = props;

  const queryKey = computed(() => {
    return allQueriesKeys.user.listIds(listIds?.value || []).queryKey;
  });

  const enabled = computed(() => !!listIds?.value.length);

  const params = computed(() => {
    return { listIds: listIds?.value || [] };
  });

  const query = useQuery({
    queryKey,
    queryFn: () =>
      getUsersByIdsRequest({
        params: params.value,
      }),
    enabled,
    ...configs,
  });

  return query;
}
