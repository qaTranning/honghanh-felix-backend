import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { useRefetchUser } from '../utils';
import { requestApi } from '~/common/libs';
import type { IResponseApi } from '~/common/models';
import { allQueriesKeys, type MutationConfig } from '~/queries';

interface DeleteUserRequest {
  userId: number;
}

function deleteUserRequest(req: DeleteUserRequest) {
  const { userId } = req;
  return requestApi<{}, IResponseApi>({
    method: 'DELETE',
    url: `/user/remove?id=${userId}`,
  });
}

interface UseDeleteUserMutationProps {
  configs?: MutationConfig<typeof deleteUserRequest>;
}

export function useDeleteUserMutation(props: UseDeleteUserMutationProps = {}) {
  const { configs } = props;

  const queryClient = useQueryClient();

  const { refetchListUser } = useRefetchUser();

  const mutation = useMutation({
    mutationFn: deleteUserRequest,
    async onSuccess(_, { userId }) {
      queryClient.removeQueries(allQueriesKeys.user.detail(userId));
      await refetchListUser();
    },
    ...configs,
  });

  return mutation;
}
