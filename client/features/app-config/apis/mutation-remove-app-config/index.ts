import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { APP_CONFIG_MODULE_NAME } from '../../constants';
import { MESSAGE_LIBS, requestApi } from '~/common/libs';
import type { IResponseApi } from '~/common/models';
import { allQueriesKeys, type MutationConfig } from '~/queries';

interface IMutateRemoveAppConfigInput {
  params: { id: number };
}

function mutateRemoveAppConfig({ params }: IMutateRemoveAppConfigInput) {
  return requestApi<undefined, IResponseApi<any>>({
    method: 'DELETE',
    url: 'config/remove',
    params,
  });
}

interface UseMutateRemoveAppConfigProps {
  configs?: MutationConfig<typeof mutateRemoveAppConfig>;
}

export function useMutationRemoveAppConfig(props: UseMutateRemoveAppConfigProps = {}) {
  const { configs } = props;
  const { onLoadMessager, onSuccessMessager, onErrorMessager } = MESSAGE_LIBS.handleMessageAndt(
    APP_CONFIG_MODULE_NAME,
    {}
  );
  const { t } = useI18n();

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: mutateRemoveAppConfig,
    onMutate: ({ params }) => {
      onLoadMessager();
    },
    onError: (error) => {
      onErrorMessager(error.message);
    },
    onSuccess: async (res, { params: { id } }) => {
      onSuccessMessager();
      queryClient.invalidateQueries({
        queryKey: allQueriesKeys['APP-CONFIG']._def,
      });

      queryClient.invalidateQueries(allQueriesKeys['APP-CONFIG'].list);
      queryClient.removeQueries(allQueriesKeys['APP-CONFIG'].detail(id));
      queryClient.removeQueries({ queryKey: allQueriesKeys['APP-CONFIG'].detailName._def });

      await navigateTo({ name: 'data-app-config-all' });
    },
    ...configs,
  });

  return {
    mutation,
  };
}
