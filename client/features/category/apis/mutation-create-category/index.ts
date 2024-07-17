import { useMutation, useQueryClient } from '@tanstack/vue-query';
import type { ICategory } from '../../models';
import { CATEGORY_MODULE_NAME } from '../../constants';
import { MESSAGE_LIBS, requestApi } from '~/common/libs';
import type { IResponseApi } from '~/common/models';
import { allQueriesKeys, type MutationConfig } from '~/queries';

export interface ICreateCategoryInput {
  body: {
    name: string;
    order: number;
  };
}

function mutate({ body }: ICreateCategoryInput) {
  return requestApi<typeof body, IResponseApi<ICategory>>({
    method: 'POST',
    url: 'category/create',
    data: { ...body },
  });
}

interface IProps {
  configs?: MutationConfig<typeof mutate>;
}

export function useMutationCreateCategory(props: IProps) {
  const { configs } = props;

  const { onLoadMessager, onSuccessMessager, onErrorMessager } = MESSAGE_LIBS.handleMessageAndt(
    CATEGORY_MODULE_NAME,
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
      queryClient.invalidateQueries(allQueriesKeys.CATEGORY.list);
    },
    ...configs,
  });

  return {
    mutation,
  };
}
