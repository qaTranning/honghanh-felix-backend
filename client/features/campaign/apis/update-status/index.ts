import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { serialize } from 'object-to-formdata';
import type { ICampaign } from '../../campaigns';
import { CAMPAIGN_FEATURE_NAME } from '../../constants';
import { MESSAGE_LIBS, requestApi } from '~/common/libs';
import type { IResponseApi } from '~/common/campaigns';
import { allQueriesKeys, type MutationConfig } from '~/queries';

interface UpdateCampaignRequest {
  body: {
    id: number;
    status: string;
  };
}

// 'PROCESSING', 'PENDING', 'COMPLETED', 'CANCELED', 'WAITING_PAYMENT', 'PAID'

function updateCampaignRequest(req: UpdateCampaignRequest) {
  const { body } = req;

  return requestApi<typeof body, IResponseApi<ICampaign>>({
    method: 'PATCH',
    url: `/campaign/update-status`,
    data: body,
  });
}

interface UseUpdateCampaignMutationProps {
  configs?: MutationConfig<typeof updateCampaignRequest>;
}

export function useUpdateStatusCampaignMutation(props: UseUpdateCampaignMutationProps = {}) {
  const { configs } = props;
  const queryClient = useQueryClient();

  const { onLoadMessager, onSuccessMessager, onErrorMessager } = MESSAGE_LIBS.handleMessageAndt(
    CAMPAIGN_FEATURE_NAME,
    {}
  );

  const mutation = useMutation({
    mutationFn: updateCampaignRequest,
    onMutate() {
      onLoadMessager('Đang cập nhật trạng thái...');
    },
    async onSuccess(_, { body }) {
      await queryClient.invalidateQueries(allQueriesKeys.campaign.detail(body.id));
      queryClient.invalidateQueries(allQueriesKeys.campaign.list);
      onSuccessMessager('Cập nhật trạng thái thành công!');
    },
    onError(errors) {
      onErrorMessager(errors.messages || errors.message);
    },
    ...configs,
  });

  return mutation;
}
