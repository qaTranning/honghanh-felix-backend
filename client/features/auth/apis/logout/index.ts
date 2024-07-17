import { useMutation, QueryClient, useQueryClient } from '@tanstack/vue-query';
import type { IAuthLogoutResponse } from '../../models';
import { AUTH_FEATURE_NAME } from '../../constants';
import { useAuthStore } from '../../stores/index.store';
import type { MutationConfig } from '@/queries';
import type { IResponseApi } from '~/common/models';
import { requestApi } from '~/common/libs/request-api';
import { MESSAGE_LIBS } from '~/common/libs';

function authLogoutMutation() {
  return requestApi<null, IResponseApi<IAuthLogoutResponse>>({
    method: 'POST',
    url: 'auth/logout',
  });
}

interface IAuthLogoutMutationProps {
  configs?: MutationConfig<typeof authLogoutMutation>;
}

export function useAuthLogoutMutation(props: IAuthLogoutMutationProps = {}) {
  const { configs } = props;

  const { onLoadMessager, onSuccessMessager, onErrorMessager } = MESSAGE_LIBS.handleMessageAndt(
    AUTH_FEATURE_NAME,
    {
      loadingContent: 'Logouting',
    }
  );
  const { resetAuth } = useAuthStore();

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: authLogoutMutation,

    onMutate: () => {
      onLoadMessager();
    },
    onError: async () => {
      onErrorMessager();
      resetAuth();
      queryClient.clear();
      await navigateTo({ name: 'auth-login' });
    },
    onSuccess: async () => {
      onSuccessMessager();
      resetAuth();
      queryClient.clear();
      await navigateTo({ name: 'auth-login' });
    },
    ...configs,
  });

  return mutation;
}
