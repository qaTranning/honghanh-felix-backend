import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { serialize } from 'object-to-formdata';
import type { IBrand } from '../../models';
import { BRAND_MODULE_NAME } from '../../constants';
import { MESSAGE_LIBS, requestApi } from '~/common/libs';
import type { IResponseApi } from '~/common/models';
import { allQueriesKeys, type MutationConfig } from '~/queries';

export interface IUpdateBrandInput {
  params: { id: number };
  body: {
    userId: number;
    title: string;
    taxCode: string;
    address?: string;
    email: string;
    phone?: string;
    description?: string;
    thumbnail?: File;
    website?: string;
    status?: string;
    deleteThumbnail?: string;
  };
}

function mutate({ body, params }: IUpdateBrandInput) {
  const data = serialize(body, { indices: true });

  return requestApi<typeof data, IResponseApi<IBrand>>({
    method: 'PATCH',
    url: 'brand/update',
    data,
    params,
    isFormData: true,
  });
}

interface IProps {
  configs?: MutationConfig<typeof mutate>;
}

export function useMutationUpdateBrand(props: IProps) {
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
    onSuccess: async (_, { params: { id } }) => {
      onSuccessMessager();
      await Promise.all([
        queryClient.invalidateQueries(allQueriesKeys.brand.list),
        queryClient.invalidateQueries(allQueriesKeys.brand.detail(id)),
      ]);
    },
    ...configs,
  });

  return {
    mutation,
  };
}
