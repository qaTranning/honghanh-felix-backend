import { useMutation, useQueryClient } from '@tanstack/vue-query';
import type { IBrand } from '../../models';
import { BRAND_MODULE_NAME } from '../../constants';
import { MESSAGE_LIBS, requestApi } from '~/common/libs';
import type { IResponseApi } from '~/common/models';
import { allQueriesKeys, type MutationConfig } from '~/queries';

interface IRequest {
  params: { id: number };
}

function mutate({ params }: IRequest) {
  return requestApi<typeof params, IResponseApi<IBrand>>({
    method: 'DELETE',
    url: 'brand/remove',
    params,
  });
}

interface IProps {
  configs?: MutationConfig<typeof mutate>;
}

export function useMutationRemoveBrand(props: IProps = {}) {
  const { configs } = props;
  const { onLoadMessager, onSuccessMessager, onErrorMessager } = MESSAGE_LIBS.handleMessageAndt(
    BRAND_MODULE_NAME,
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
      queryClient.invalidateQueries(allQueriesKeys.brand.list);
      queryClient.removeQueries(allQueriesKeys.brand.detail(id as number));
    },
    ...configs,
  });

  return {
    mutation,
  };
}
