import { useDeleteUserMutation } from '../../apis';

export function useDeleteUserService() {
  const { mutateAsync, isPending } = useDeleteUserMutation();

  async function handleDeleteUser(userId: number) {
    // mutate(userId);
    try {
      await mutateAsync({ userId });
    } catch (error) {}
  }

  return {
    handleDeleteUser,
    isPending,
  };
}
