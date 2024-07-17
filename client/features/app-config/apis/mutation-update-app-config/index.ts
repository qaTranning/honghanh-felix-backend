import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { APP_CONFIG_MODULE_NAME } from '../../constants';
import { MESSAGE_LIBS, requestApi } from '~/common/libs';
import type { IResponseApi } from '~/common/models';
import { allQueriesKeys, type MutationConfig } from '~/queries';

interface IMutateRemoveAppConfigInput {
  params: { id: number };
  body: {
    name?: string;
    value: string;
  };
}

function mutateUpdateAppConfig({ params, body }: IMutateRemoveAppConfigInput) {
  return requestApi<typeof body, IResponseApi<any>>({
    method: 'PATCH',
    url: 'config/update',
    data: { ...body },
    params,
  });
}

interface UseMutateUpdateAppConfigProps {
  configs?: MutationConfig<typeof mutateUpdateAppConfig>;
}

export function useMutationUpdateAppConfig(props: UseMutateUpdateAppConfigProps = {}) {
  const { configs } = props;
  const { onLoadMessager, onSuccessMessager, onErrorMessager } = MESSAGE_LIBS.handleMessageAndt(
    APP_CONFIG_MODULE_NAME,
    {}
  );
  const { t } = useI18n();

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: mutateUpdateAppConfig,
    onMutate: ({ params }) => {
      onLoadMessager();
    },
    onError: (error) => {
      onErrorMessager(error.message);
    },
    onSuccess: async (_, variables) => {
      console.log('variables: ', variables);
      const {
        params: { id },
        body: { name },
      } = variables;
      onSuccessMessager();
      queryClient.invalidateQueries(allQueriesKeys['APP-CONFIG'].list);
      queryClient.invalidateQueries(allQueriesKeys['APP-CONFIG'].detail(id));
      queryClient.invalidateQueries(allQueriesKeys['APP-CONFIG'].detailName(name as string));
    },
    ...configs,
  });

  return {
    mutation,
  };
}
