import { useQueryPreviewComcard } from '../../apis/comcard';

export function usePreviewComcardService() {
  const { query: queryQueryPreviewComcard, modelId } = useQueryPreviewComcard();
  const { refetch } = queryQueryPreviewComcard;

  async function handlePreviewComcard(id: number, onSuccess?: () => void) {
    modelId.value = id;
    await refetch();
    onSuccess?.();
  }

  return {
    queryQueryPreviewComcard,
    handlePreviewComcard,
  };
}
