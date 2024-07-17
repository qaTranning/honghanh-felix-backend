import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { CAMPAIGN_FEATURE_NAME } from '@/features/campaign/constants';
import type { ICampaignRole } from '@/features/campaign/models';
import { MESSAGE_LIBS, requestApi } from '~/common/libs';
import type { IResponseApi } from '~/common/models';
import { allQueriesKeys, type MutationConfig } from '~/queries';

interface IDeleteCampaignRoleRequest {
  id: number;
}

function deleteCampaignRoleRequest(req: IDeleteCampaignRoleRequest) {
  const { id } = req;

  return requestApi<never, IResponseApi<ICampaignRole>>({
    method: 'DELETE',
    url: 'campaign-role/remove',
    params: {
      id,
    },
  });
}

interface IUseDeleteCampaignRoleMutationProps {
  configs?: MutationConfig<typeof deleteCampaignRoleRequest>;
}

export function useDeleteCampaignRoleMutation(props: IUseDeleteCampaignRoleMutationProps = {}) {
  const { configs } = props;

  const { onLoadMessager, onSuccessMessager, onErrorMessager } = MESSAGE_LIBS.handleMessageAndt(
    CAMPAIGN_FEATURE_NAME,
    {}
  );
  const queryClient = useQueryClient();

  const deleteCampaignRoleMutation = useMutation({
    mutationFn: deleteCampaignRoleRequest,
    onMutate: () => {
      onLoadMessager('Đang xóa...');
    },
    async onSuccess(res) {
      onSuccessMessager('Xóa thành công!');
      await queryClient.invalidateQueries(allQueriesKeys.campaign.role);
      queryClient.invalidateQueries(allQueriesKeys.campaign.list);
      queryClient.invalidateQueries(allQueriesKeys.campaign.detail(res?.data?.campaignId));
    },
    onError: (errors) => {
      onErrorMessager(errors.messages || errors.message);
    },
    ...configs,
  });

  return deleteCampaignRoleMutation;
}
