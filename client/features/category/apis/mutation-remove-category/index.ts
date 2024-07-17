import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { CATEGORY_MODULE_NAME } from '../../constants';
import type { ICategory } from '../../models';
import { MESSAGE_LIBS, requestApi } from '~/common/libs';
import type { IResponseApi } from '~/common/models';
import { allQueriesKeys, type MutationConfig } from '~/queries';

interface IRequest {
  params: { id: number };
}

function mutate({ params }: IRequest) {
  return requestApi<typeof params, IResponseApi<ICategory>>({
    method: 'DELETE',
    url: 'category/remove',
    params,
  });
}

interface IProps {
  configs?: MutationConfig<typeof mutate>;
}
export function useMutationRemoveCategory(props: IProps) {
  const { configs } = props;
  const { onLoadMessager, onSuccessMessager, onErrorMessager } = MESSAGE_LIBS.handleMessageAndt(
    CATEGORY_MODULE_NAME,
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
      queryClient.invalidateQueries(allQueriesKeys.CATEGORY.list);
      queryClient.removeQueries(allQueriesKeys.CATEGORY.detail(id));
    },
    ...configs,
  });

  return {
    mutation,
  };
}
