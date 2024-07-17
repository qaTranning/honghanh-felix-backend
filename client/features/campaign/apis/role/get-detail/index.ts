import { useQuery } from '@tanstack/vue-query';
import { computed } from 'vue';
import { requestApi } from '~/common/libs';
import type { IResponseApi } from '~/common/models';
import type { ICampaign, ICampaignRole } from '~/features/campaign/models';
import { allQueriesKeys, type QueryConfig } from '~/queries';

interface IGetDetailCampaignRoleRequest {
  params: {
    id: number;
  };
}

function getDetailCampaignRoleRequest(req: IGetDetailCampaignRoleRequest) {
  const { params } = req;
  return requestApi<never, IResponseApi<ICampaignRole>>({
    method: 'GET',
    url: `campaign-role/detail`,
    params: {
      ...params,
    },
  });
}

interface UseGetDetailCampaignRoleQueryProps {
  configs?: QueryConfig<typeof getDetailCampaignRoleRequest>;
}

export function useGetDetailCampaignRoleQuery(props: UseGetDetailCampaignRoleQueryProps = {}) {
  const { configs } = props;

  const currentCampaignRoleId = ref<number | null>(null);

  const enabledRef = computed(() => !!currentCampaignRoleId.value ?? false);

  const campaignQueryKey = computed(
    () => allQueriesKeys.campaign.detail(currentCampaignRoleId.value).queryKey
  );

  const query = useQuery({
    enabled: enabledRef,
    queryKey: campaignQueryKey,

    queryFn: () =>
      getDetailCampaignRoleRequest({
        params: { id: currentCampaignRoleId.value as number },
      }),
    ...configs,
  });

  return {
    query,
    currentCampaignRoleId,
  };
}
