import { useQuery } from '@tanstack/vue-query';
import { merge } from 'lodash-es';
import type { IBrand } from '../../models';
import { usePaginateReq, useString } from '~/common';
import { requestApi } from '~/common/libs';
import type { DeepPartial, IBaseQueryParams, IMetaResponse, IResponseApi } from '~/common/models';
import { allQueriesKeys, type QueryConfig } from '~/queries';

interface Filter {
  search: string;
  status: string;
}
export interface IParamsGetAllBrand extends IBaseQueryParams<Filter> {}

interface IGetAllBrandRequest {
  params: IParamsGetAllBrand;
}

interface IGetAllBrandResponse {
  data: IBrand[];
  meta: IMetaResponse;
}

export function getAllBrandsRequest(req: IGetAllBrandRequest) {
  const { params } = req;
  return requestApi<typeof params, IResponseApi<IGetAllBrandResponse>>({
    method: 'POST',
    url: 'brand/all',
    data: params,
  });
}

interface UseGetAllBrandsQueryProps {
  configs?: QueryConfig<typeof getAllBrandsRequest>;
  defaultParams?: DeepPartial<IParamsGetAllBrand>;
}

export function useGetAllBrandsQuery(props: UseGetAllBrandsQueryProps = {}) {
  const { page, pageSize } = usePaginateReq();
  const { configs, defaultParams } = props;
  const [search, { onChangeDebounce }] = useString();
  const statusRef = ref<string[]>([]);
  const status = ref<string | undefined>(undefined);

  function changeStatus(tStatus: string) {
    status.value = tStatus;
    // const isInclude = statusRef.value.includes(status);

    // if (isInclude) {
    //   statusRef.value = [];
    // } else {
    //   statusRef.value = [status];
    // }
  }

  const currentParams = computed<IParamsGetAllBrand>(() =>
    merge(
      {
        paginate: {
          perPage: pageSize.value,
          page: page.value,
        },
        filter: {
          search: search.value,
          status: status.value !== 'ALL' ? status.value : '',
          // ...(statusRef.value?.[0]
          //   ? {
          //       status: statusRef.value?.[0] === 'ALL' ? undefined : statusRef.value?.[0],
          //     }
          //   : {}),
        },
      },
      defaultParams
    )
  );

  const queryKeyRef = computed(() => [...allQueriesKeys.brand.list.queryKey, currentParams]);

  const query = useQuery({
    queryKey: queryKeyRef,
    queryFn: () =>
      getAllBrandsRequest({
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
    statusRef,
    changeStatus,
  };
}
