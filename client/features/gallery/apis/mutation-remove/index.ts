import { useMutation, useQueryClient } from '@tanstack/vue-query';
import type { IGallery } from '../../models';
import { MESSAGE_LIBS, requestApi } from '~/common/libs';
import type { IResponseApi } from '~/common/models';
import { allQueriesKeys, type MutationConfig } from '~/queries';

interface IInput {
  body: {
    ids: number[];
  };
}

function mutate({ body }: IInput) {
  return requestApi<typeof body, IResponseApi<IGallery>>({
    method: 'DELETE',
    url: 'gallery/remove',
    data: { ...body },
  });
}

interface IProps {
  configs?: MutationConfig<typeof mutate>;
}

export function useMutationRemoveGallery(props: IProps) {
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
    onSuccess: async () => {
      onSuccessMessager();
      await queryClient.invalidateQueries(allQueriesKeys.gallery.list);
    },

    ...configs,
  });

  return {
    ...mutation,
  };
}
