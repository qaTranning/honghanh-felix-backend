import { useMutation, useQueryClient } from '@tanstack/vue-query';
import type { ICategory } from '../../models';
import { CATEGORY_MODULE_NAME } from '../../constants';
import { MESSAGE_LIBS, requestApi } from '~/common/libs';
import type { IResponseApi } from '~/common/models';
import { allQueriesKeys, type MutationConfig } from '~/queries';

export interface IUpdateCategoryInput {
  body: {
    name?: string;
    order?: number;
  };
  params: {
    id: number;
  };
}

function mutate({ body, params }: IUpdateCategoryInput) {
  return requestApi<typeof body, IResponseApi<ICategory>>({
    method: 'PATCH',
    url: 'category/update',
    data: { ...body },
    params,
  });
}

interface IProps {
  configs?: MutationConfig<typeof mutate>;
}

export function useMutationUpdateCategory(props: IProps) {
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
    onSuccess: async (_, { params: { id } }) => {
      onSuccessMessager();
      queryClient.invalidateQueries(allQueriesKeys.CATEGORY.list);
      queryClient.invalidateQueries(allQueriesKeys.CATEGORY.detail(id));
    },
    ...configs,
  });

  return {
    mutation,
  };
}
