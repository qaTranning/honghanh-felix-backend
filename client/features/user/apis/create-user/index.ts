import { useMutation } from '@tanstack/vue-query';
import { USER_FEATURE_NAME } from '../../constants';
import type { IUser } from '../../models';
import { useRefetchUser } from '../utils';
import { MESSAGE_LIBS, requestApi } from '~/common/libs';
import type { IResponseApi } from '~/common/models';
import { type MutationConfig } from '~/queries';

interface CreateUserRequest {
  body: object;
}

function createUserRequest(req: CreateUserRequest) {
  const { body } = req;

  return requestApi<typeof body, IResponseApi<IUser>>({
    method: 'POST',
    url: `/user/create-auth-user`,
    data: body,
  });
}

interface UseCreateUserMutationProps {
  configs?: MutationConfig<typeof createUserRequest>;
}

export function useCreateUserMutation(props: UseCreateUserMutationProps = {}) {
  const { configs } = props;

  const { onLoadMessager, onSuccessMessager, onErrorMessager } = MESSAGE_LIBS.handleMessageAndt(
    USER_FEATURE_NAME,
    {}
  );

  const { refetchListUser } = useRefetchUser();

  const mutation = useMutation({
    mutationFn: createUserRequest,
    onMutate() {
      onLoadMessager('Đang tạo...');
    },
    async onSuccess(_) {
      await refetchListUser();
      onSuccessMessager('Tạo thành công!');
    },
    onError(errors) {
      onErrorMessager(errors.messages || errors.message);
    },
    ...configs,
  });

  return mutation;
}
