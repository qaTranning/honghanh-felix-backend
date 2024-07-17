import { useMutation, useQueryClient } from '@tanstack/vue-query';
import type { IUser } from '../../models';
import { USER_FEATURE_NAME } from '../../constants';
import { useRefetchUser } from '../utils';
import { MESSAGE_LIBS, requestApi } from '~/common/libs';
import type { IResponseApi } from '~/common/models';
import { allQueriesKeys, type MutationConfig } from '~/queries';

interface UpdateUserRequest {
  userId: number;
  body: object;
}

function updateUserRequest(req: UpdateUserRequest) {
  const { userId, body } = req;

  return requestApi<typeof body, IResponseApi<IUser>>({
    method: 'PATCH',
    url: `/user/update`,
    params: {
      id: userId,
    },
    isFormData: true,
    data: body,
  });
}

interface UseUpdateUserMutationProps {
  configs?: MutationConfig<typeof updateUserRequest>;
}

export function useUpdateUserMutation(props: UseUpdateUserMutationProps = {}) {
  const { configs } = props;
  const queryClient = useQueryClient();

  const { refetchListUser } = useRefetchUser();

  const { onLoadMessager, onSuccessMessager, onErrorMessager } = MESSAGE_LIBS.handleMessageAndt(
    USER_FEATURE_NAME,
    {}
  );

  const mutation = useMutation({
    mutationFn: updateUserRequest,
    onMutate() {
      onLoadMessager('Updating user...');
    },
    async onSuccess(_, { userId }) {
      console.log('userId: ', allQueriesKeys.user.detail(userId));
      await Promise.all([
        queryClient.invalidateQueries(allQueriesKeys.user.detail(userId)),
        refetchListUser(),
      ]);
      onSuccessMessager('Cập nhật thành công!');
    },
    onError(errors) {
      onErrorMessager(errors.messages || errors.message);
    },
    ...configs,
  });

  return mutation;
}
