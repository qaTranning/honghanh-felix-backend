import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { serialize } from 'object-to-formdata';
import type { ICampaignRole } from '@/features/campaign/models';
import { CAMPAIGN_FEATURE_NAME } from '@/features/campaign/constants';
import { MESSAGE_LIBS, requestApi } from '~/common/libs';
import type { IResponseApi } from '~/common/models';
import { allQueriesKeys, type MutationConfig } from '~/queries';

interface IUpdateCampaignRoleRequest {
  body: object & { campaignId: number };
  campaignRoleId: number;
}

function updateCampaignRoleRequest(req: IUpdateCampaignRoleRequest) {
  const { body, campaignRoleId } = req;
  const formData = serialize(body, { indices: true });

  return requestApi<FormData, IResponseApi<ICampaignRole>>({
    method: 'PATCH',
    url: 'campaign-role/update',
    data: formData,
    params: {
      id: campaignRoleId,
    },
  });
}

interface IUseUpdateCampaignRoleMutationProps {
  configs?: MutationConfig<typeof updateCampaignRoleRequest>;
}

export function useUpdateCampaignRoleMutation(props: IUseUpdateCampaignRoleMutationProps = {}) {
  const { configs } = props;

  const { onLoadMessager, onSuccessMessager, onErrorMessager } = MESSAGE_LIBS.handleMessageAndt(
    CAMPAIGN_FEATURE_NAME,
    {}
  );

  const queryClient = useQueryClient();

  const updateCampaignRoleMutation = useMutation({
    mutationFn: updateCampaignRoleRequest,
    onMutate: () => {
      onLoadMessager('Đang cập nhật...');
    },
    async onSuccess(_, { body: { campaignId } }) {
      onSuccessMessager('Cập nhật thành công!');
      await queryClient.invalidateQueries({ queryKey: allQueriesKeys.campaign.role.queryKey });
      queryClient.invalidateQueries(allQueriesKeys.campaign.list);
      queryClient.invalidateQueries(allQueriesKeys.campaign.detail(campaignId));
    },
    onError: (errors) => {
      onErrorMessager(errors.messages || errors.message);
    },
    ...configs,
  });

  return updateCampaignRoleMutation;
}
