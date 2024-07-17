import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { MESSAGE_LIBS, requestApi } from '~/common/libs';
import type { IResponseApi } from '~/common/models';
import { allQueriesKeys, type MutationConfig } from '~/queries';

interface IInput {
  body: {
    ids: number[];
  };
}

function mutate({ body }: IInput) {
  return requestApi<typeof body, IResponseApi<any>>({
    method: 'DELETE',
    url: '/model/admin-delete-image',
    data: { ...body },
  });
}

interface IProps {
  configs?: MutationConfig<typeof mutate>;
}

export function useMutationRemoveModelImage(props: IProps) {
  const { configs } = props;
  const { onLoadMessager, onSuccessMessager, onErrorMessager } = MESSAGE_LIBS.handleMessageAndt(
    'remove',
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
    onSuccess: async (_) => {
      onSuccessMessager();

      await queryClient.invalidateQueries(allQueriesKeys.user.list);
    },

    ...configs,
  });

  return {
    ...mutation,
  };
}
