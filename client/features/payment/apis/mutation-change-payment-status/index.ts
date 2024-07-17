import { useMutation, useQueryClient } from '@tanstack/vue-query';
import type { IPayment, InvoiceStatusType } from '../../models';
import { MESSAGE_LIBS, requestApi } from '~/common/libs';
import type { IResponseApi } from '~/common/models';
import { allQueriesKeys, type MutationConfig } from '~/queries';

interface IRequest {
  body: {
    invoiceStatus: InvoiceStatusType;
    rejectReason?: string;
  };
  params: {
    id: number;
  };
}

function onMutate(req: IRequest) {
  const { body, params } = req;

  return requestApi<IRequest['body'], IResponseApi<IPayment>>({
    method: 'PATCH',
    url: 'invoice/update-status',
    data: body,
    params,
  });
}

interface IProps {
  configs?: MutationConfig<typeof onMutate>;
}

export function useMutationUpdatePaymentStatus(props: IProps) {
  const { configs } = props;
  const { onLoadMessager, onSuccessMessager, onErrorMessager } = MESSAGE_LIBS.handleMessageAndt(
    'create',
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
    onSuccess: async (_, variables) => {
      const {
        params: { id },
      } = variables;
      onSuccessMessager();

      await Promise.all([
        queryClient.invalidateQueries(allQueriesKeys.PAYMENT.list),
        queryClient.invalidateQueries(allQueriesKeys.PAYMENT.detail(id)),
      ]);
    },

    ...configs,
  });

  return {
    ...mutation,
  };
}
