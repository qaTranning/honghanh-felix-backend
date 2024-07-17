import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { CAMPAIGN_FEATURE_NAME } from '@/features/campaign/constants';
import type { IReview } from '@/features/review/models';
import { MESSAGE_LIBS, requestApi } from '~/common/libs';
import type { IResponseApi } from '~/common/models';
import { allQueriesKeys, type MutationConfig } from '~/queries';

interface ICreateReviewRequest {
  body: {
    campaignId: number;
    modelId: number;
    rate: number;
    comment: string;
    status?: string;
  };
}

function createReviewRequest(req: ICreateReviewRequest) {
  const { body } = req;

  return requestApi<typeof body, IResponseApi<IReview>>({
    method: 'POST',
    url: 'review/create',
    data: body,
  });
}

interface IUseCreateReviewMutationProps {
  configs?: MutationConfig<typeof createReviewRequest>;
}

export function useMutationCreateReview(props: IUseCreateReviewMutationProps = {}) {
  const { configs } = props;

  const queryClient = useQueryClient();

  const { onLoadMessager, onSuccessMessager, onErrorMessager } = MESSAGE_LIBS.handleMessageAndt(
    CAMPAIGN_FEATURE_NAME,
    {}
  );

  const createReviewMutation = useMutation({
    mutationFn: createReviewRequest,
    onMutate: () => {
      onLoadMessager('Đang tạo...');
    },
    onSuccess: (res, { body: { campaignId } }) => {
      onSuccessMessager('Tạo thành công!');
      queryClient.invalidateQueries(allQueriesKeys.review.list);
      queryClient.invalidateQueries(allQueriesKeys.campaign.detail(campaignId as number));
      queryClient.invalidateQueries(allQueriesKeys.campaign.list);
      navigateTo({ name: 'data-review-update', query: { id: res.data.id } });
    },
    onError: (errors) => {
      onErrorMessager(errors.messages || errors.message);
    },
    ...configs,
  });

  return createReviewMutation;
}
