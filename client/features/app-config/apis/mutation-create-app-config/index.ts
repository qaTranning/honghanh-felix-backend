import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { APP_CONFIG_MODULE_NAME } from '../../constants';
import type { IAppConfig } from '../../models';
import { MESSAGE_LIBS, requestApi } from '~/common/libs';
import type { IResponseApi } from '~/common/models';
import { allQueriesKeys, type MutationConfig } from '~/queries';

interface IMutateRemoveAppConfigInput {
  body: {
    name: string;
    value: string;
  };
}

function mutateCreateAppConfig({ body }: IMutateRemoveAppConfigInput) {
  return requestApi<typeof body, IResponseApi<IAppConfig>>({
    method: 'POST',
    url: 'config/create',
    data: { ...body },
  });
}

interface UseMutateCreateAppConfigProps {
  configs?: MutationConfig<typeof mutateCreateAppConfig>;
}

export function useMutationCreateAppConfig(props: UseMutateCreateAppConfigProps = {}) {
  const { configs } = props;
  const { onLoadMessager, onSuccessMessager, onErrorMessager } = MESSAGE_LIBS.handleMessageAndt(
    APP_CONFIG_MODULE_NAME,
    {}
  );
  const { t } = useI18n();

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: mutateCreateAppConfig,
    onMutate: () => {
      onLoadMessager();
    },
    onError: (error) => {
      onErrorMessager(error.message);
    },
    onSuccess: async (res) => {
      onSuccessMessager();
      queryClient.invalidateQueries(allQueriesKeys['APP-CONFIG'].list);
    },
    ...configs,
  });

  return {
    mutation,
  };
}
