import { useMutation, useQueryClient } from '@tanstack/vue-query';
import type { IBrand } from '../../models';
import { BRAND_MODULE_NAME } from '../../constants';
import { MESSAGE_LIBS, requestApi } from '~/common/libs';
import type { IResponseApi } from '~/common/models';
import { allQueriesKeys, type MutationConfig } from '~/queries';

export interface ICreateBrandInput {
  body: {
    title: string;
    taxCode: string;
    address?: string;
    email: string;
    phone?: string;
    description?: string;
    thumbnail?: File;
    website?: string;
    status?: string;
    userId: number;
  };
}

function mutate({ body }: ICreateBrandInput) {
  const data = new FormData();
  for (const [k, v] of Object.entries(body)) {
    data.append(k, v);
  }

  return requestApi<typeof data, IResponseApi<IBrand>>({
    method: 'POST',
    url: 'brand/create',
    data,
    isFormData: true,
  });
}

interface IProps {
  configs?: MutationConfig<typeof mutate>;
}

export function useMutationCreateBrand(props: IProps) {
  const { configs } = props;

  const { onLoadMessager, onSuccessMessager, onErrorMessager } = MESSAGE_LIBS.handleMessageAndt(
    BRAND_MODULE_NAME,
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
      queryClient.invalidateQueries(allQueriesKeys.brand.list);
    },
    ...configs,
  });

  return {
    mutation,
  };
}
