import { useQuery } from '@tanstack/vue-query';
import { axiosClient } from '~/common/libs';
import { allQueriesKeys, type QueryConfig } from '~/queries';

interface DownloadComcardRequest {
  params: {
    id: number;
  };
}
async function downloadComcardRequest(req: DownloadComcardRequest) {
  const { params } = req;
  const { id } = params;
  const rest = await axiosClient({
    baseURL: 'https://felix-comcard.zack.vn',
    method: 'GET',
    url: `/comcard/${id}/export`,
  });

  return rest.data as { url: string };
}

interface IUseQueryDownloadComcardProps {
  configs?: QueryConfig<typeof downloadComcardRequest>;
}

export function useQueryDownloadComcard(props: IUseQueryDownloadComcardProps = {}) {
  const { configs } = props;

  const modelId = ref<number | undefined>(undefined);

  const queryKey = computed(() => {
    return allQueriesKeys.model.comcard(modelId.value as number).queryKey;
  });
  const enabled = computed(() => !!modelId.value);

  const query = useQuery({
    queryFn: () =>
      downloadComcardRequest({
        params: {
          id: modelId.value as number,
        },
      }),
    queryKey,
    enabled,
    ...configs,
  });

  return {
    query,
    modelId,
  };
}
