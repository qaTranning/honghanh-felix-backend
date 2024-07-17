import { useInfiniteQuery } from '@tanstack/vue-query';
import { getAllUsersRequest, type IParamsGetAllUser } from '../get-list-users';
import type { IUser } from '../../models';
import { allQueriesKeys, type InfiniteQueryConfig } from '~/queries';
import { usePaginateReq } from '~/common';

interface UseGetInfinityUsersQueryProps {
  configs?: InfiniteQueryConfig<typeof getAllUsersRequest>;

  defaultParams?: {
    role?: IUser['role'];
    search?: string;
    isModelNotExist?: string;
  };
}

export function useGetInfinityUsersQuery(props: UseGetInfinityUsersQueryProps = {}) {
  const { defaultParams, configs } = props;
  const { page, pageSize } = usePaginateReq();
  const search = ref('');
  const roleRef = ref(defaultParams?.role);
  const isModelNotExistRef = ref(defaultParams?.isModelNotExist);

  const currentParams = computed<IParamsGetAllUser>(() => ({
    paginate: {
      perPage: pageSize.value,
      page: page.value,
    },
    filter: {
      search: search.value || undefined,
      role: roleRef.value || undefined,
      isModelNotExist: isModelNotExistRef.value ? isModelNotExistRef.value === 'true' : undefined,
    },
    order: {
      createAt: 'desc',
    },
  }));

  const query = useInfiniteQuery({
    queryKey: [...allQueriesKeys.user.listInfinity.queryKey, currentParams],
    queryFn: ({ pageParam }) => {
      return getAllUsersRequest({
        params: {
          ...currentParams.value,
          paginate: {
            ...currentParams.value.paginate,
            page: pageParam || page.value,
          },
        },
      });
    },

    getNextPageParam: (...params) => {
      const [lastPage] = params;
      if (!lastPage?.data?.meta?.next) {
        return undefined;
      }
      return lastPage?.data?.meta?.currentPage + 1;
    },
    initialPageParam: 1,
    ...configs,
  });

  return {
    page,
    pageSize,
    query,
    search,
    roleRef,
  };
}
