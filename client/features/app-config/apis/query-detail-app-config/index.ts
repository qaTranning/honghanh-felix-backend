import { useQuery } from '@tanstack/vue-query';
import type { IAppConfig } from '../../models';
import { requestApi } from '~/common/libs';
import type { IResponseApi } from '~/common/models';
import { allQueriesKeys, type QueryConfig } from '~/queries';

interface IGetDetailAppConfigRequest {
  params: {
    id: number;
  };
}

function queryDetailAppConfig(req: IGetDetailAppConfigRequest) {
  const { params } = req;
  return requestApi<typeof params, IResponseApi<IAppConfig>>({
    method: 'GET',
    url: `config/detail`,
    params,
  });
}

interface UseGetDetailUserQueryProps {
  configs?: QueryConfig<typeof queryDetailAppConfig>;
}

export function useQueryDetailAppConfig(props: UseGetDetailUserQueryProps = {}) {
  const { configs } = props;

  const appConfigId = ref<number | null>(null);

  const enabledRef = computed(() => !!appConfigId.value);

  const queryKey = computed(
    () => allQueriesKeys['APP-CONFIG'].detail(appConfigId.value as number).queryKey
  );
  const query = useQuery({
    queryKey,
    enabled: enabledRef,
    queryFn: () =>
      queryDetailAppConfig({
        params: { id: appConfigId.value as number },
      }),
    ...configs,
  });

  return {
    query,
    appConfigId,
  };
}
