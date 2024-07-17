import { useMutation, useQueryClient } from '@tanstack/vue-query';
import type { IPayment, PenaltyFeeType } from '../../models';
import { MESSAGE_LIBS, requestApi } from '~/common/libs';
import type { IResponseApi } from '~/common/models';
import { allQueriesKeys, type MutationConfig } from '~/queries';

interface IInput {
  params: { id: number };

  body: {
    // otHours?: string;
    description?: string;
    invoiceType?: string;
    penaltyFee?: PenaltyFeeType[];
    bonusFees?: PenaltyFeeType[];
    paymentTime?: string;
    // imageLicenseFee?: string;

    salary: string;
    currency?: string | undefined;
    // otSalary?: string | undefined;
    workingHours?: IPayment['workingHours'];

    othersFee?: string;
  };
}

function mutate({ body, params }: IInput) {
  return requestApi<typeof body, IResponseApi>({
    method: 'PATCH',
    url: 'invoice/update',
    data: { ...body },
    params,
  });
}

interface IProps {
  configs?: MutationConfig<typeof mutate>;
}

export function useMutationUpdatePayment(props: IProps) {
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
