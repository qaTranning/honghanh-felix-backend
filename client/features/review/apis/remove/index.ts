import { useMutation, useQueryClient } from '@tanstack/vue-query';
import type { IReview } from '../../models';
import { MESSAGE_LIBS, requestApi } from '~/common/libs';
import type { IResponseApi } from '~/common/models';
import { allQueriesKeys, type MutationConfig } from '~/queries';

interface IRequest {
  params: { id: number };
}

function mutate({ params }: IRequest) {
  return requestApi<typeof params, IResponseApi<IReview>>({
    method: 'DELETE',
    url: 'review/remove',
    params,
  });
}

interface IProps {
  configs?: MutationConfig<typeof mutate>;
}
export function useMutationRemoveReview(props: IProps) {
  const { configs } = props;
  const { onLoadMessager, onSuccessMessager, onErrorMessager } = MESSAGE_LIBS.handleMessageAndt(
    'REVIEW',
    {}
  );

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: mutate,
    onMutate: ({ params }) => {
      onLoadMessager();
    },
    onError: (error) => {
      onErrorMessager(error.message);
    },
    onSuccess: async (_, { params: { id } }) => {
      onSuccessMessager();
      queryClient.invalidateQueries(allQueriesKeys.review.list);
      queryClient.removeQueries(allQueriesKeys.review.detail(id));
    },
    ...configs,
  });

  return {
    mutation,
  };
}
