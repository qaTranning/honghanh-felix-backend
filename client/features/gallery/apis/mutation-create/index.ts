import { useMutation, useQueryClient } from '@tanstack/vue-query';
import type { IGallery } from '../../models';
import { MESSAGE_LIBS, requestApi } from '~/common/libs';
import type { IResponseApi } from '~/common/models';
import { allQueriesKeys, type MutationConfig } from '~/queries';

interface IInput {
  body: {
    name: string;
    image: File;
  };
}

function mutate({ body }: IInput) {
  return requestApi<typeof body, IResponseApi<IGallery>>({
    method: 'POST',
    url: 'gallery/create',
    data: { ...body },
    isFormData: true,
  });
}

interface IProps {
  configs?: MutationConfig<typeof mutate>;
}

export function useMutationCreateGallery(props: IProps) {
  const { configs } = props;
  const { onLoadMessager, onSuccessMessager, onErrorMessager } = MESSAGE_LIBS.handleMessageAndt(
    'create',
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
    onSuccess: async (res) => {
      onSuccessMessager();
      await queryClient.invalidateQueries(allQueriesKeys.gallery.list);
    },

    ...configs,
  });

  return {
    ...mutation,
  };
}
