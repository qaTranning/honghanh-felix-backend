import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { CAMPAIGN_FEATURE_NAME } from '@/features/campaign/constants';
import type { ICampaignRole } from '@/features/campaign/models';
import { MESSAGE_LIBS, requestApi } from '~/common/libs';
import type { IResponseApi } from '~/common/models';
import { allQueriesKeys, type MutationConfig } from '~/queries';

interface ICreateCampaignRoleRequest {
  body: object & { campaignId: number };
}

function createCampaignRoleRequest(req: ICreateCampaignRoleRequest) {
  const { body } = req;

  const data = body;

  return requestApi<typeof data, IResponseApi<ICampaignRole>>({
    method: 'POST',
    url: 'campaign-role/create',
    data,
  });
}

interface IUseCreateCampaignRoleMutationProps {
  configs?: MutationConfig<typeof createCampaignRoleRequest>;
}

export function useCreateCampaignRoleMutation(props: IUseCreateCampaignRoleMutationProps = {}) {
  const { configs } = props;

  const { onLoadMessager, onSuccessMessager, onErrorMessager } = MESSAGE_LIBS.handleMessageAndt(
    CAMPAIGN_FEATURE_NAME,
    {}
  );
  const queryClient = useQueryClient();

  const createCampaignRoleMutation = useMutation({
    mutationFn: createCampaignRoleRequest,
    onMutate: () => {
      onLoadMessager('Đang tạo...');
    },
    async onSuccess(_, { body: { campaignId } }) {
      onSuccessMessager('Tạo thành công!');
      await queryClient.invalidateQueries({ queryKey: allQueriesKeys.campaign.role.queryKey });
      queryClient.invalidateQueries(allQueriesKeys.campaign.detail(campaignId));
      queryClient.invalidateQueries(allQueriesKeys.campaign.list);
    },
    onError: (errors) => {
      onErrorMessager(errors.messages || errors.message);
    },
    ...configs,
  });

  return createCampaignRoleMutation;
}
