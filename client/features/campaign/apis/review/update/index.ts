import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { MESSAGE_LIBS, requestApi } from '~/common/libs';
import type { IResponseApi } from '~/common/models';
import { allQueriesKeys, type MutationConfig } from '~/queries';
import type { IReviewCampaign } from '~/features/campaign/models';

export interface IUpdateReviewInput {
  body: {
    modelId?: number;
    campaignId?: number;
    rate?: number;
    comment?: string;
  };
  params: {
    id: number;
  };
}

function mutate({ body, params }: IUpdateReviewInput) {
  return requestApi<typeof body, IResponseApi<IReviewCampaign>>({
    method: 'PATCH',
    url: 'review/update',
    data: { ...body },
    params,
  });
}

interface IProps {
  configs?: MutationConfig<typeof mutate>;
}

export function useMutationUpdateReview(props: IProps) {
  const { configs } = props;

  const { onLoadMessager, onSuccessMessager, onErrorMessager } = MESSAGE_LIBS.handleMessageAndt(
    'REVIEW',
    {}
  );

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: mutate,
    onMutate: () => {
      onLoadMessager();
    },
    onError: (error) => {
      onErrorMessager(error.message);
    },
    onSuccess: async (_, { body: { campaignId } }) => {
      onSuccessMessager();
      queryClient.invalidateQueries(allQueriesKeys.campaign.review);
      queryClient.invalidateQueries(allQueriesKeys.campaign.list);
      queryClient.invalidateQueries(allQueriesKeys.campaign.detail(campaignId as number));
    },
    ...configs,
  });

  return {
    mutation,
  };
}
