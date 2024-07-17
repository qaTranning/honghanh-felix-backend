import { useQuery } from '@tanstack/vue-query';
import { axiosClient } from '~/common/libs';
import { allQueriesKeys, type QueryConfig } from '~/queries';

interface DetailComcardRequest {
  params: {
    id: number;
  };
}
function detailComcardRequest(req: DetailComcardRequest) {
  const { params } = req;
  const { id } = params;
  return axiosClient({
    baseURL: 'https://felix-comcard.zack.vn',
    method: 'GET',
    url: `/comcard/${id}`,
  });
}

interface IUseQueryDetailComcardProps {
  configs?: QueryConfig<typeof detailComcardRequest>;
  modelId: Ref<number | undefined>;
}

export function useDetailComcardQuery(props: IUseQueryDetailComcardProps) {
  const { configs, modelId } = props;

  const queryKey = computed(
    () => allQueriesKeys.model.comcardDetail(modelId?.value as number).queryKey
  );

  const enabled = computed(() => !!modelId.value);

  const query = useQuery({
    enabled,
    queryFn: () =>
      detailComcardRequest({
        params: {
          id: modelId.value as number,
        },
      }),
    queryKey: queryKey.value,

    ...configs,
  });

  watch(modelId, () => {
    if (!modelId.value) return;
    query.refetch();
  });

  return query;
}
