import { useMutation, useQueryClient } from '@tanstack/vue-query';
import type { IPayment } from '../../models';
import { MESSAGE_LIBS, requestApi } from '~/common/libs';
import type { IResponseApi } from '~/common/models';
import { allQueriesKeys, type MutationConfig } from '~/queries';

interface IRequest {
  body: {
    campaignRoleId: number;
    modelId: number;
    workingHours: {
      startDate: Date;
      endDate: Date;
    }[];

    salary: string;
    description?: string | undefined;
    currency?: string | undefined;
    otSalary?: string | undefined;
  };
}

function onMutate(req: IRequest) {
  const { body } = req;

  return requestApi<IRequest['body'], IResponseApi<IPayment>>({
    method: 'POST',
    url: 'invoice/admin-create-invoice',
    data: body,
  });
}

interface IProps {
  configs?: MutationConfig<typeof onMutate>;
}

export function useMutationCreatePayment(props: IProps) {
  const { configs } = props;
  const { onLoadMessager, onSuccessMessager, onErrorMessager } = MESSAGE_LIBS.handleMessageAndt(
    'Tạo mới',
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
    onSuccess: async () => {
      onSuccessMessager();

      await Promise.all([queryClient.invalidateQueries(allQueriesKeys.PAYMENT.list)]);
    },

    ...configs,
  });

  return {
    ...mutation,
  };
}
