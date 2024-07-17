import { useQueryClient } from '@tanstack/vue-query';
import { allQueriesKeys } from '~/queries';
export function useRefetchUser() {
  const queryClient = useQueryClient();

  async function refetchListUser() {
    await Promise.all([
      queryClient.invalidateQueries(allQueriesKeys.user.list),
      queryClient.invalidateQueries(allQueriesKeys.user.listInfinity),
    ]);
  }

  return {
    refetchListUser,
  };
}
