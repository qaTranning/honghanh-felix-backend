import { useMutation } from '@tanstack/vue-query';
import { MESSAGE_LIBS, requestApi } from '~/common/libs';
import type { IResponseApi } from '~/common/models';
import { type MutationConfig } from '~/queries';

interface ICalculateInvoiceResponse {
  salary: string;
  otHours: string;
  workingHoursNumber: string;
}

interface IRequest {
  body: {
    campaignRoleId: number;
    modelId: number;
    invoiceId?: number;

    workingHours: {
      startDate: Date;
      endDate: Date;
    }[];
  };
}

function requestCalculateInvoice(req: IRequest) {
  const { body } = req;

  return requestApi<IRequest['body'], IResponseApi<ICalculateInvoiceResponse>>({
    method: 'POST',
    url: 'invoice/calculate-invoice',
    data: body,
  });
}

interface IProps {
  configs?: MutationConfig<typeof requestCalculateInvoice>;
}

export function useMutationCalculateInvoice(props: IProps = {}) {
  const { configs } = props;
  const { onLoadMessager, onSuccessMessager, onErrorMessager } = MESSAGE_LIBS.handleMessageAndt(
    'create',
    {}
  );

  const mutation = useMutation({
    mutationFn: requestCalculateInvoice,
    onMutate: () => {
      onLoadMessager();
    },
    onError: (error) => {
      onErrorMessager(error.message);
    },
    onSuccess: async () => {
      onSuccessMessager();
    },

    ...configs,
  });

  const responseCalculateInvoice = computed(() => mutation.data?.value?.data);

  return {
    ...mutation,
    responseCalculateInvoice,
  };
}
