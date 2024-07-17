import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { CAMPAIGN_FEATURE_NAME } from '@/features/campaign/constants';
import type { IRegisterCampaign } from '@/features/campaign/models';
import { MESSAGE_LIBS, requestApi } from '~/common/libs';
import type { IResponseApi } from '~/common/models';
import { allQueriesKeys, type MutationConfig } from '~/queries';

export interface IBodyAdminConfirmRegisterCampaignRequest {
  campaignId?: number;
  campaignRoleId: number;
  modelId: number;
  status: string;
}

interface IAdminConfirmRegisterCampaignRequest {
  body: IBodyAdminConfirmRegisterCampaignRequest;
}

function adminConfirmRegisterCampaignRequest(req: IAdminConfirmRegisterCampaignRequest) {
  const { body } = req;

  const data = {
    ...body,
  };

  return requestApi<typeof data, IResponseApi<IRegisterCampaign>>({
    method: 'PATCH',
    url: 'register-campaign/admin-confirm',
    data,
  });
}

interface IUseAdminConfirmRegisterCampaignMutationProps {
  configs?: MutationConfig<typeof adminConfirmRegisterCampaignRequest>;
}

export function useAdminConfirmRegisterCampaignMutation(
  props: IUseAdminConfirmRegisterCampaignMutationProps = {}
) {
  const { configs } = props;

  const { onLoadMessager, onSuccessMessager, onErrorMessager } = MESSAGE_LIBS.handleMessageAndt(
    CAMPAIGN_FEATURE_NAME,
    {}
  );
  const queryClient = useQueryClient();

  const adminconfirmRegisterCampaignMutation = useMutation({
    mutationFn: adminConfirmRegisterCampaignRequest,
    onMutate: () => {
      onLoadMessager('Updating...');
    },
    async onSuccess(_, { body: { campaignId } }) {
      onSuccessMessager('Updated!');
      await queryClient.invalidateQueries(allQueriesKeys.campaign.register);
      queryClient.invalidateQueries(allQueriesKeys.campaign.list);
      queryClient.invalidateQueries(allQueriesKeys.campaign.detail(campaignId as number));
    },
    onError: (errors) => {
      onErrorMessager(errors.messages || errors.message);
    },
    ...configs,
  });

  return adminconfirmRegisterCampaignMutation;
}
