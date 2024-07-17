import { useQuery } from '@tanstack/vue-query';
import type { IAppConfig } from '../../models';
import { requestApi } from '~/common/libs';
import type { IResponseApi } from '~/common/models';
import { allQueriesKeys, type QueryConfig } from '~/queries';

function queryListAppConfig() {
  return requestApi<undefined, IResponseApi<IAppConfig[]>>({
    method: 'GET',
    url: 'config/all',
  });
}
interface UseQueryAllAppConfigProps {
  configs?: QueryConfig<typeof queryListAppConfig>;
}
export function useQueryAllAppConfig(props: UseQueryAllAppConfigProps = {}) {
  const { configs } = props;

  const query = useQuery({
    queryKey: [...allQueriesKeys['APP-CONFIG'].list.queryKey],
    queryFn: () => queryListAppConfig(),
    ...configs,
  });

  return {
    query,
  };
}
