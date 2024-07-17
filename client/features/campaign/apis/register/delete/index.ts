import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { CAMPAIGN_FEATURE_NAME } from '@/features/campaign/constants';
import type { IRegisterCampaign } from '@/features/campaign/models';
import { MESSAGE_LIBS, requestApi } from '~/common/libs';
import type { IResponseApi } from '~/common/models';
import { allQueriesKeys, type MutationConfig } from '~/queries';

export interface IBodyDeleteRegisterCampaignRequest {
  campaignRoleId: number;
  modelId: number;
}
interface IDeleteRegisterCampaignRequest {
  body: IBodyDeleteRegisterCampaignRequest;
}

function deleteRegisterCampaignRequest(req: IDeleteRegisterCampaignRequest) {
  const { body } = req;

  return requestApi<typeof body, IResponseApi<IRegisterCampaign>>({
    method: 'DELETE',
    url: 'register-campaign/remove',
    data: body,
  });
}

interface IUseDeleteRegisterCampaignMutationProps {
  configs?: MutationConfig<typeof deleteRegisterCampaignRequest>;
}

export function useDeleteRegisterCampaignMutation(
  props: IUseDeleteRegisterCampaignMutationProps = {}
) {
  const { configs } = props;

  const { onLoadMessager, onSuccessMessager, onErrorMessager } = MESSAGE_LIBS.handleMessageAndt(
    CAMPAIGN_FEATURE_NAME,
    {}
  );
  const queryClient = useQueryClient();

  const deleteRegisterCampaignMutation = useMutation({
    mutationFn: deleteRegisterCampaignRequest,
    onMutate: () => {
      onLoadMessager('Deleting register campaign...');
    },
    async onSuccess(_) {
      onSuccessMessager('Register campaign deleted!');
      await queryClient.invalidateQueries(allQueriesKeys.campaign.register);
      queryClient.invalidateQueries(allQueriesKeys.campaign.list);
    },
    onError: (errors) => {
      onErrorMessager(errors.messages || errors.message);
    },
    ...configs,
  });

  return deleteRegisterCampaignMutation;
}
