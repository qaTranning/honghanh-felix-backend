import { useInfiniteQuery } from '@tanstack/vue-query';
import { getAllCategoriesRequest, type IParamsGetAllCategory } from '../query-all-category';
import { usePaginateReq, useString } from '~/common';
import { allQueriesKeys, type InfiniteQueryConfig } from '~/queries';

interface UseGetInfinityCategoriesQueryProps {
  configs?: InfiniteQueryConfig<typeof getAllCategoriesRequest>;

  defaultParams?: {
    search?: string;
  };
}

export function useGetInfinityCategoriesQuery(props: UseGetInfinityCategoriesQueryProps = {}) {
  const { configs } = props;
  const { page, pageSize } = usePaginateReq();
  const [search, { onChangeDebounce }] = useString();

  const currentParams = computed<IParamsGetAllCategory>(() => ({
    paginate: {
      page: page.value,
      perPage: pageSize.value,
    },
    filter: {
      name: search.value,
    },
    order: {
      createAt: 'desc',
    },
  }));

  const queryKey = computed(() => [
    ...allQueriesKeys.CATEGORY.listInfinity.queryKey,
    currentParams,
  ]);

  const query = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam }) => {
      if (pageParam) page.value = pageParam;

      return getAllCategoriesRequest({ params: currentParams.value });
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
    onChangeDebounce,
  };
}
