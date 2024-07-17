import { useMutation, useQueryClient } from '@tanstack/vue-query';
import type { IPayment } from '../../models';
import { MESSAGE_LIBS, requestApi } from '~/common/libs';
import type { IResponseApi } from '~/common/models';
import { allQueriesKeys, type MutationConfig } from '~/queries';

interface IInput {
  params: { id: number };

  body: {
    image: any;
    referenceCode?: string;
    invoiceStatus?: IPayment['invoiceStatus'];
    paymentTime?: string;
  };
}

function mutate({ body, params }: IInput) {
  return requestApi<typeof body, IResponseApi<IPayment>>({
    method: 'PATCH',
    url: 'invoice/update-paid-invoice',
    data: { ...body },
    isFormData: true,
    params,
  });
}

interface IProps {
  configs?: MutationConfig<typeof mutate>;
}

export function useMutationUpdatePaidInvoice(props: IProps = {}) {
  const { configs } = props;
  const { onLoadMessager, onSuccessMessager, onErrorMessager } = MESSAGE_LIBS.handleMessageAndt(
    'Cập nhật',
    {}
  );
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: mutate,
    onMutate: () => {
      onLoadMessager();
    },
    onError: (error) => {
      onErrorMessager(error.message);
    },
    onSuccess: async (_, variables) => {
      onSuccessMessager();
      const {
        params: { id },
      } = variables;

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
