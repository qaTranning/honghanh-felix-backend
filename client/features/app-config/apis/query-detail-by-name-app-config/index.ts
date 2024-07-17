import { useQuery } from '@tanstack/vue-query';
import type { IAppConfig } from '../../models';
import { requestApi } from '~/common/libs';
import type { IResponseApi } from '~/common/models';
import { allQueriesKeys, type QueryConfig } from '~/queries';
import { useString } from '~/common/hooks';

interface IGetDetailAppConfigRequest {
  params: {
    name: string;
  };
}

function queryDetailAppConfig(req: IGetDetailAppConfigRequest) {
  const { params } = req;
  return requestApi<typeof params, IResponseApi<IAppConfig>>({
    method: 'GET',
    url: `config/detail-by-name`,
    params,
  });
}

interface UseGetDetailUserQueryProps {
  configs?: QueryConfig<typeof queryDetailAppConfig>;
  defaultValue: string;
}

export function useQueryDetailByNameAppConfig(
  props: UseGetDetailUserQueryProps = { defaultValue: '' }
) {
  const { configs, defaultValue } = props;

  const [name] = useString(defaultValue);

  const enabledRef = computed(() => !!name.value);

  const queryKey = computed(() => allQueriesKeys['APP-CONFIG'].detailName(name.value).queryKey);
  const query = useQuery({
    queryKey,
    enabled: enabledRef,
    queryFn: () =>
      queryDetailAppConfig({
        params: { name: name.value },
      }),
    ...configs,
  });

  return {
    ...query,
    name,
  };
}
