import { useQueryDownloadComcard } from '../../apis/comcard';

export function useDownloadComcardService() {
  const { query: queryQueryDownloadComcard, modelId: modelIdQueryDownloadComcard } =
    useQueryDownloadComcard();

  const { refetch: refetchQueryDownloadComcard } = queryQueryDownloadComcard;

  async function handleDownloadComcard(id: number, onSuccess?: () => void) {
    modelIdQueryDownloadComcard.value = id;
    const res = await refetchQueryDownloadComcard();
    if (res.data?.url) {
      onSuccess?.();
    }
  }

  return {
    queryQueryDownloadComcard,
    handleDownloadComcard,
  };
}
