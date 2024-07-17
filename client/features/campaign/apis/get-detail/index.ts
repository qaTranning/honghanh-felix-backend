import { useQuery } from '@tanstack/vue-query';
import { computed } from 'vue';
import { requestApi } from '~/common/libs';
import type { IResponseApi } from '~/common/models';
import type { ICampaign } from '~/features/campaign/models';
import { allQueriesKeys, type QueryConfig } from '~/queries';

interface IGetDetailCampaignRequest {
  params: {
    id: number;
  };
}

function getDetailCampaignRequest(req: IGetDetailCampaignRequest) {
  const { params } = req;
  return requestApi<never, IResponseApi<ICampaign>>({
    method: 'GET',
    url: `campaign/detail`,
    params: {
      ...params,
    },
  });
}

interface UseGetDetailCampaignQueryProps {
  configs?: QueryConfig<typeof getDetailCampaignRequest>;
}

export function useGetDetailCampaignQuery(props: UseGetDetailCampaignQueryProps = {}) {
  const { configs } = props;

  const currentCampaignId = ref<number | null>(null);

  const enabledRef = computed(() => !!currentCampaignId.value ?? false);

  const campaignQueryKey = computed(
    () => allQueriesKeys.campaign.detail(currentCampaignId.value).queryKey
  );

  const query = useQuery({
    enabled: enabledRef,
    queryKey: campaignQueryKey,

    queryFn: () =>
      getDetailCampaignRequest({
        params: { id: currentCampaignId.value as number },
      }),
    ...configs,
  });

  return {
    query,
    currentCampaignId,
  };
}
