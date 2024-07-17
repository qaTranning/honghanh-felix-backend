import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { MESSAGE_LIBS, requestApi } from '~/common/libs';
import type { IResponseApi } from '~/common/models';
import type { IInvoiceComment } from '~/features/payment/models/comment';
import { allQueriesKeys, type MutationConfig } from '~/queries';

type ICreateInvoiceCommentRequest = Pick<IInvoiceComment, 'invoiceId' | 'comment'>;

interface IRequest {
  body: ICreateInvoiceCommentRequest;
}

function requestCreateInvoiceComment(req: IRequest) {
  const { body } = req;

  return requestApi<IRequest['body'], IResponseApi<IInvoiceComment>>({
    method: 'POST',
    url: 'invoice/comment',
    data: body,
  });
}

interface IProps {
  configs?: MutationConfig<typeof requestCreateInvoiceComment>;
}

export function useMutationCreateInvoiceComment(props: IProps = {}) {
  const { configs } = props;
  const { onLoadMessager, onSuccessMessager, onErrorMessager } = MESSAGE_LIBS.handleMessageAndt(
    'create',
    {}
  );

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: requestCreateInvoiceComment,
    onMutate: () => {
      onLoadMessager();
    },
    onError: (error) => {
      onErrorMessager(error.message);
    },
    onSuccess: async () => {
      onSuccessMessager();
      queryClient.invalidateQueries(allQueriesKeys.PAYMENT.commentList);
    },

    ...configs,
  });

  return {
    ...mutation,
  };
}
