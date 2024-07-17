import { useQuery } from '@tanstack/vue-query';
import { merge } from 'lodash-es';
import type { ICategory } from '../../models';
import { usePaginateReq, useString } from '~/common';
import { requestApi } from '~/common/libs';
import type { DeepPartial, IBaseQueryParams, IResponseListApi } from '~/common/models';
import { allQueriesKeys, type QueryConfig } from '~/queries';

interface Filter {
  name: string;
}
export interface IParamsGetAllCategory extends IBaseQueryParams<Filter> {}

interface IGetAllCategoryRequest {
  params: IParamsGetAllCategory;
}

export function getAllCategoriesRequest(req: IGetAllCategoryRequest) {
  const { params } = req;
  return requestApi<typeof params, IResponseListApi<ICategory>>({
    method: 'POST',
    url: 'category/all',
    data: params,
  });
}

interface UseGetAllCategorysQueryProps {
  configs?: QueryConfig<typeof getAllCategoriesRequest>;
  defaultParams?: DeepPartial<IParamsGetAllCategory>;
}

export function useGetAllCategorysQuery(props: UseGetAllCategorysQueryProps = {}) {
  const { page, pageSize } = usePaginateReq();
  const { configs, defaultParams } = props;
  const [search, { onChangeDebounce }] = useString();

  const currentParams = computed<IParamsGetAllCategory>(() =>
    merge(
      {
        paginate: {
          perPage: pageSize.value,
          page: page.value,
        },
        filter: {
          name: search.value || undefined,
        },
        order: {
          createAt: 'desc',
        },
      },
      defaultParams
    )
  );

  const queryKeyRef = computed(() => [
    ...allQueriesKeys.CATEGORY.list.queryKey,
    currentParams.value,
  ]);

  const query = useQuery({
    queryKey: queryKeyRef,
    queryFn: () =>
      getAllCategoriesRequest({
        params: currentParams.value,
      }),
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
