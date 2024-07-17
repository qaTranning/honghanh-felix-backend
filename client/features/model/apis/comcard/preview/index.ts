import { useQuery } from '@tanstack/vue-query';
import { axiosClient } from '~/common/libs';
import { allQueriesKeys, type QueryConfig } from '~/queries';

interface PreviewComcardRequest {
  params: {
    id: number;
  };
}
async function previewComcardRequest(req: PreviewComcardRequest) {
  const { params } = req;
  const { id } = params;
  const res = await axiosClient({
    baseURL: 'https://felix-comcard.zack.vn',
    method: 'GET',
    url: `/comcard/${id}/preview`,
  });

  return res.data;
}

interface IUseQueryPreviewComcardProps {
  configs?: QueryConfig<typeof previewComcardRequest>;
}

export function useQueryPreviewComcard(props: IUseQueryPreviewComcardProps = {}) {
  const { configs } = props;
  const modelId = ref<number | undefined>(undefined);

  const queryKey = computed(() => {
    return allQueriesKeys.model.comcard(modelId.value as number).queryKey;
  });
  const enabled = computed(() => !!modelId.value);

  const query = useQuery({
    queryFn: () =>
      previewComcardRequest({
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
