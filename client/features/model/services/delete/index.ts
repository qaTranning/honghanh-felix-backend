import { useDeleteUserMutation } from '~/features/user/apis';

export function useDeleteModelService() {
  const { mutateAsync, isPending } = useDeleteUserMutation();

  async function handleDeleteModel(modelId: number) {
    // mutate(modelId);
    await mutateAsync({ userId: modelId });
  }

  return {
    handleDeleteModel,
    isPending,
  };
}
