import { useQuery } from '@tanstack/vue-query';
import { merge } from 'lodash-es';
import { usePaginateReq, useString } from '~/common';
import { requestApi } from '~/common/libs';
import type { DeepPartial, IBaseQueryParams, IResponseListApi } from '~/common/models';
import type { IRegisterCampaign } from '~/features/campaign/models';
import { allQueriesKeys, type QueryConfig } from '~/queries';

interface Filter {
  campaignId: number;
  modelId: number;
  status: number;
  name: string;
  upcomingJob: boolean;
  startWorkingTime: Date;
  endWorkingTime: Date;
}
export interface IParamsGetAllRegisterCampaign extends IBaseQueryParams<Filter> {}

interface IGetAllRegisterCampaignRequest {
  params: IParamsGetAllRegisterCampaign;
}

export function getAllRegisterCampaignsRequest(req: IGetAllRegisterCampaignRequest) {
  const { params } = req;
  return requestApi<typeof params, IResponseListApi<IRegisterCampaign>>({
    method: 'POST',
    url: 'register-campaign/all',
    data: params,
  });
}

interface UseGetAllRegisterCampaignsQueryProps {
  configs?: QueryConfig<typeof getAllRegisterCampaignsRequest>;
  defaultParams?: DeepPartial<IParamsGetAllRegisterCampaign>;
}

export function useGetAllRegisterCampaignsQuery(props: UseGetAllRegisterCampaignsQueryProps = {}) {
  const { page, pageSize } = usePaginateReq();
  const { configs, defaultParams } = props;
  const role = ref('');
  const [search, { onChangeDebounce }] = useString();
  const statusRef = ref<string[]>([]);
  const campaignId = ref<number | undefined>(undefined);

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

  const currentParams = computed<IParamsGetAllRegisterCampaign>(() =>
    merge(
      {
        paginate: {
          perPage: pageSize.value,
          page: page.value,
        },
        filter: {
          ...(role.value ? { role: role.value } : {}),
          search: search.value || undefined,
          ...(statusRef.value?.[0]
            ? {
                status: statusRef.value?.[0] === 'ALL' ? undefined : statusRef.value?.[0],
              }
            : {}),
          ...(campaignId.value ? { campaignId: campaignId.value } : {}),
        },
        order: {
          createAt: 'desc',
        },
      },
      defaultParams
    )
  );

  const queryKeyRef = computed(() => [...allQueriesKeys.campaign.register.queryKey, currentParams]);

  const query = useQuery({
    queryKey: queryKeyRef,
    queryFn: () =>
      getAllRegisterCampaignsRequest({
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
    campaignId,
  };
}
