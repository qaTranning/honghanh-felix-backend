import { useMutation, useQueryClient } from '@tanstack/vue-query';
import type { KycStatusType } from '../../models';
import { MESSAGE_LIBS, requestApi } from '~/common/libs';
import type { IResponseApi } from '~/common/models';
import { allQueriesKeys, type MutationConfig } from '~/queries';
import type { IModel } from '~/features/model/models';

interface IRequest {
  body: {
    id: number;
    kycComment?: string;
    action: KycStatusType;
  };
}

function onMutate(req: IRequest) {
  const { body } = req;

  return requestApi<IRequest['body'], IResponseApi<IModel>>({
    method: 'POST',
    url: 'model/update-kyc-status',
    data: body,
  });
}

interface IProps {
  configs?: MutationConfig<typeof onMutate>;
}

export function useMutationUpdateKycStatus(props: IProps) {
  const { configs } = props;
  const { onLoadMessager, onSuccessMessager, onErrorMessager } = MESSAGE_LIBS.handleMessageAndt(
    'cập nhật trạng thái',
    {}
  );
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: onMutate,
    onMutate: () => {
      onLoadMessager();
    },
    onError: (error) => {
      onErrorMessager(error.message);
    },
    onSuccess: async (res) => {
      onSuccessMessager();

      await Promise.all([
        queryClient.invalidateQueries(allQueriesKeys.user.list),
        queryClient.invalidateQueries(allQueriesKeys.user.detail(res.data.id)),
      ]);
    },

    ...configs,
  });

  return {
    ...mutation,
  };
}
