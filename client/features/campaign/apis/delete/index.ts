import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { CAMPAIGN_FEATURE_NAME } from '../../constants';
import type { ICampaign } from '../../models';
import { MESSAGE_LIBS, requestApi } from '~/common/libs';
import type { IResponseApi } from '~/common/models';
import { allQueriesKeys, type MutationConfig } from '~/queries';
interface IDeleteCampaignRequest {
  campaignId: number;
}

function deleteCampaignRequest(req: IDeleteCampaignRequest) {
  const { campaignId } = req;

  return requestApi<FormData, IResponseApi<ICampaign>>({
    method: 'DELETE',
    url: 'campaign/remove',
    params: {
      id: campaignId,
    },
  });
}

interface IUseDeleteCampaignMutationProps {
  configs?: MutationConfig<typeof deleteCampaignRequest>;
}

export function useDeleteCampaignMutation(props: IUseDeleteCampaignMutationProps = {}) {
  const { configs } = props;

  const { onLoadMessager, onSuccessMessager, onErrorMessager } = MESSAGE_LIBS.handleMessageAndt(
    CAMPAIGN_FEATURE_NAME,
    {}
  );
  const queryClient = useQueryClient();

  const deleteCampaignMutation = useMutation({
    mutationFn: deleteCampaignRequest,
    onMutate: () => {
      onLoadMessager('Đang xóa...');
    },
    onSuccess: (_, { campaignId }) => {
      onSuccessMessager('Xóa thành công!');
      queryClient.invalidateQueries(allQueriesKeys.campaign.list);
      queryClient.removeQueries(allQueriesKeys.campaign.detail(campaignId));
    },
    onError: (errors) => {
      onErrorMessager(errors.messages || errors.message);
    },
    ...configs,
  });

  return deleteCampaignMutation;
}
