import { useQuery } from '@tanstack/vue-query';
import { merge } from 'lodash-es';
import type { ICampaign } from '../../models';
import { usePaginateReq, useString } from '~/common';
import { requestApi } from '~/common/libs';
import type { DeepPartial, IBaseQueryParams, IMetaResponse, IResponseApi } from '~/common/models';
import { allQueriesKeys, type QueryConfig } from '~/queries';

interface Filter {
  startDate: string;
  endDate: string;
  name: string;
  slot: string;
  status: string;
  location: string;
  gender: string;
  startPrice: number;
  endPrice: number;
  categoryIds: number[];
}
export interface IParamsGetAllCampaign extends IBaseQueryParams<Filter> {}

interface IGetAllCampaignRequest {
  params: IParamsGetAllCampaign;
}

interface IGetAllCampaignResponse {
  data: ICampaign[];
  meta: IMetaResponse;
}

export function getAllCampaignsRequest(req: IGetAllCampaignRequest) {
  const { params } = req;
  return requestApi<typeof params, IResponseApi<IGetAllCampaignResponse>>({
    method: 'POST',
    url: 'campaign/all',
    data: params,
  });
}

interface UseGetAllCampaignsQueryProps {
  configs?: QueryConfig<typeof getAllCampaignsRequest>;
  defaultParams?: DeepPartial<IParamsGetAllCampaign>;
}

export function useGetAllCampaignsQuery(props: UseGetAllCampaignsQueryProps = {}) {
  const { page, pageSize } = usePaginateReq();
  const { configs, defaultParams } = props;
  const role = ref('');
  const [search, { onChangeDebounce }] = useString();
  const statusRef = ref<string[]>([]);

  function changeStatus(status: string) {
    const isInclude = statusRef.value.includes(status);
    // multiple
    // if (isInclude) {
    //   statusRef.value = statusRef.value.filter((s) => s !== status);
    // } else {
    //   statusRef.value = statusRef.value.concat(status);
    // }

    // single

    if (isInclude) {
      statusRef.value = [];
    } else {
      statusRef.value = [status];
    }
  }

  const currentParams = computed<IParamsGetAllCampaign>(() =>
    merge(
      {
        paginate: {
          perPage: pageSize.value,
          page: page.value,
        },
        filter: {
          ...(role.value ? { role: role.value } : {}),
          name: search.value || undefined,
          ...(statusRef.value?.[0]
            ? {
                status: statusRef.value?.[0] === 'ALL' ? undefined : statusRef.value?.[0],
              }
            : {}),
        },
        order: {
          createAt: 'desc',
        },
      },
      defaultParams
    )
  );

  const queryKeyRef = computed(() => [...allQueriesKeys.campaign.list.queryKey, currentParams]);

  const query = useQuery({
    queryKey: queryKeyRef,
    queryFn: () =>
      getAllCampaignsRequest({
        params: currentParams.value,
      }),
    ...configs,
  });

  return {
    page,
    pageSize,
    query,
    role,
    search,
    onChangeDebounce,
    statusRef,
    changeStatus,
  };
}
