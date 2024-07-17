import { useQuery } from '@tanstack/vue-query';
import { merge } from 'lodash-es';
import type { ICampaignRole } from '@/features/campaign/models';
import { usePaginateReq, useString } from '~/common';
import { requestApi } from '~/common/libs';
import type { DeepPartial, IBaseQueryParams, IResponseListApi } from '~/common/models';
import { allQueriesKeys, type QueryConfig } from '~/queries';

interface Filter {
  name: string;
  campaignId: number;
}
export interface IParamsGetAllCampaignRole extends IBaseQueryParams<Filter> {}

interface IGetAllCampaignRoleRequest {
  params: IParamsGetAllCampaignRole;
  query: {
    id: number;
  };
}

export function getAllCampaignRolesRequest(req: IGetAllCampaignRoleRequest) {
  const { params, query } = req;
  return requestApi<typeof params, IResponseListApi<ICampaignRole>>({
    method: 'POST',
    url: 'campaign-role/all',
    data: params,
    params: query,
  });
}

interface UseGetAllCampaignRolesQueryProps {
  configs?: QueryConfig<typeof getAllCampaignRolesRequest>;
  defaultParams?: DeepPartial<IParamsGetAllCampaignRole>;
}

export function useGetAllCampaignRolesQuery(props: UseGetAllCampaignRolesQueryProps = {}) {
  const { page, pageSize } = usePaginateReq();
  const { configs, defaultParams } = props;

  const campaignId = ref(0);
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

  const currentParams = computed<IParamsGetAllCampaignRole>(() =>
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

  const queryKeyRef = computed(() => [...allQueriesKeys.campaign.role.queryKey, currentParams]);

  const enableRef = computed(() => !!campaignId.value);

  const query = useQuery({
    enabled: enableRef,
    queryKey: queryKeyRef,
    queryFn: () =>
      getAllCampaignRolesRequest({
        params: currentParams.value,
        query: {
          id: campaignId.value,
        },
      }),
    ...configs,
  });

  return {
    campaignId,
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
