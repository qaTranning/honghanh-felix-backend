import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { CAMPAIGN_FEATURE_NAME } from '@/features/campaign/constants';
import type { IReviewCampaign } from '@/features/campaign/models';
import { MESSAGE_LIBS, requestApi } from '~/common/libs';
import type { IResponseApi } from '~/common/models';
import { allQueriesKeys, type MutationConfig } from '~/queries';
interface ICreateReviewRequest {
  body: {
    campaignId: number;
    modelId: number;
    rate: number;
    comment: string;
  };
}

function createReviewRequest(req: ICreateReviewRequest) {
  const { body } = req;

  return requestApi<typeof body, IResponseApi<IReviewCampaign>>({
    method: 'POST',
    url: 'review/create',
    data: body,
  });
}

interface IUseCreateReviewMutationProps {
  configs?: MutationConfig<typeof createReviewRequest>;
}

export function useCreateReviewMutation(props: IUseCreateReviewMutationProps = {}) {
  const { configs } = props;

  const queryClient = useQueryClient();

  const { onLoadMessager, onSuccessMessager, onErrorMessager } = MESSAGE_LIBS.handleMessageAndt(
    CAMPAIGN_FEATURE_NAME,
    {}
  );

  const createReviewMutation = useMutation({
    mutationFn: createReviewRequest,
    onMutate: () => {
      onLoadMessager('Creating review...');
    },
    onSuccess: (_, { body: { campaignId } }) => {
      onSuccessMessager('Review created!');
      queryClient.invalidateQueries(allQueriesKeys.campaign.review);
      queryClient.invalidateQueries(allQueriesKeys.campaign.list);
      queryClient.invalidateQueries(allQueriesKeys.campaign.detail(campaignId));
    },
    onError: (errors) => {
      onErrorMessager(errors.messages || errors.message);
    },
    ...configs,
  });

  return createReviewMutation;
}
