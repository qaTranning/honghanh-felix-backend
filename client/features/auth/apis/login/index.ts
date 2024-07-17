import { useMutation } from '@tanstack/vue-query';
import type { IAuthUserLoginResponse } from '../../models';
import { AUTH_FEATURE_NAME } from '../../constants';
import { useAuthStore } from '../../stores/index.store';
import type { MutationConfig } from '@/queries';
import type { IResponseApi } from '~/common/models';
import { requestApi } from '~/common/libs/request-api';
import { MESSAGE_LIBS } from '~/common/libs';

interface IAuthLoginRequest {
  body: {
    email: string;
    password: string;
  };
}
function authLoginRequest(req: IAuthLoginRequest) {
  const { body } = req;
  return requestApi<typeof body, IResponseApi<IAuthUserLoginResponse>>({
    method: 'POST',
    url: 'auth/login',
    data: body,
  });
}

interface IAuthLoginMutationProps {
  configs?: MutationConfig<typeof authLoginRequest>;
}

export function useAuthLoginMutation(props: IAuthLoginMutationProps = {}) {
  const { configs } = props;

  const { onLoadMessager, onSuccessMessager, onErrorMessager } = MESSAGE_LIBS.handleMessageAndt(
    AUTH_FEATURE_NAME,
    {}
  );

  const { setAuth } = useAuthStore();

  const { t } = useI18n();

  const mutation = useMutation({
    mutationFn: authLoginRequest,
    onMutate: ({ body }) => {
      const { email } = body;
      onLoadMessager(t('auth.logining_to', { name: email }));
    },
    onError: (error) => {
      onErrorMessager(error.message);
    },
    onSuccess: async (res) => {
      if (res.data.user.role !== 'ADMIN') {
        return onErrorMessager('only Admin ');
      }
      setAuth(res.data);
      onSuccessMessager(t('auth.logined_to', { name: res.data.user.email }));
      await navigateTo({ name: 'index' }, { replace: true, redirectCode: 301 });
    },
    ...configs,
  });

  return mutation;
}
