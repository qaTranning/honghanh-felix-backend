import { useQuery } from '@tanstack/vue-query';
import { computed } from 'vue';
import { requestApi } from '~/common/libs';
import type { IResponseApi } from '~/common/models';
import type { IUser } from '~/features/user/models';
import { allQueriesKeys, type QueryConfig } from '~/queries';

interface IGetDetailUserRequest {
  params: {
    id: number;
  };
}

function getDetailUserRequest(req: IGetDetailUserRequest) {
  const { params } = req;

  if (!params.id) throw new Error('Missing id');

  return requestApi<never, IResponseApi<IUser>>({
    method: 'GET',
    url: `user/detail`,
    params: {
      ...params,
    },
  });
}

interface UseGetDetailUserQueryProps {
  configs?: QueryConfig<typeof getDetailUserRequest>;
}

export function useGetDetailUserQuery(props: UseGetDetailUserQueryProps = {}) {
  const { configs } = props;

  const currentUserId = ref<number | null>(null);

  const enabledRef = computed(() => !!currentUserId.value ?? false);

  const userQueryKey = computed(() => allQueriesKeys.user.detail(currentUserId.value).queryKey);

  const query = useQuery({
    enabled: enabledRef,
    queryKey: userQueryKey,

    queryFn: () =>
      getDetailUserRequest({
        params: { id: currentUserId.value as number },
      }),
    ...configs,
  });

  return {
    query,
    currentUserId,
  };
}
