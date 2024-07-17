import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { serialize } from 'object-to-formdata';
import type { ICampaign } from '../../campaigns';
import { CAMPAIGN_FEATURE_NAME } from '../../constants';
import { MESSAGE_LIBS, requestApi } from '~/common/libs';
import type { IResponseApi } from '~/common/campaigns';
import { allQueriesKeys, type MutationConfig } from '~/queries';

interface UpdateCampaignRequest {
  campaignId: number;
  body: object;
}

function updateCampaignRequest(req: UpdateCampaignRequest) {
  const { campaignId, body } = req;

  const formData = serialize(body, { indices: true });

  return requestApi<typeof formData, IResponseApi<ICampaign>>({
    method: 'PATCH',
    url: `/campaign/update`,
    params: {
      id: campaignId,
    },
    isFormData: true,
    data: formData,
  });
}

interface UseUpdateCampaignMutationProps {
  configs?: MutationConfig<typeof updateCampaignRequest>;
}

export function useUpdateCampaignMutation(props: UseUpdateCampaignMutationProps = {}) {
  const { configs } = props;
  const queryClient = useQueryClient();

  const { onLoadMessager, onSuccessMessager, onErrorMessager } = MESSAGE_LIBS.handleMessageAndt(
    CAMPAIGN_FEATURE_NAME,
    {}
  );

  const mutation = useMutation({
    mutationFn: updateCampaignRequest,
    onMutate() {
      onLoadMessager('Đang cập nhật...');
    },
    async onSuccess(_, { campaignId }) {
      await queryClient.invalidateQueries(allQueriesKeys.campaign.detail(campaignId));
      queryClient.invalidateQueries(allQueriesKeys.campaign.list);
      onSuccessMessager('Cập nhật thành công!');
    },
    onError(errors) {
      onErrorMessager(errors.messages || errors.message);
    },
    ...configs,
  });

  return mutation;
}
