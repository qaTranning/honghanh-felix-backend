import { useQuery } from '@tanstack/vue-query';
import type { UnwrapRef } from 'vue';
import { requestApi } from '~/common/libs';
import type { DeepPartial, IPaginateReq, IResponseApi, IResponseListApi } from '~/common/models';
import type { IInvoiceComment } from '~/features/payment/models/comment';
import { paymentQueryKey } from '~/features/payment/queries-key';
import type { QueryConfig } from '~/queries';

type IBody = DeepPartial<{
  paginate: IPaginateReq;

  filter: {
    invoiceId: number;
    userId: number;
  };
}>;

export interface IInvoiceCommentRequest {
  body: Ref<IBody | undefined>;
}
function getAll(req: IInvoiceCommentRequest) {
  const { body } = req;

  return requestApi<UnwrapRef<IInvoiceCommentRequest['body']>, IResponseListApi<IInvoiceComment>>({
    url: '/invoice/comment/all',
    method: 'POST',
    data: { ...body.value },
  });
}

interface IUseQueryAllInvoiceComments {
  configs?: QueryConfig<typeof getAll>;
}

export function useQueryAllInvoiceComments({ configs }: IUseQueryAllInvoiceComments = {}) {
  const queryParams = ref<IBody>({
    paginate: {
      page: 1,
      perPage: 5,
    },
    filter: {
      invoiceId: 0,
    },
  });

  const isEnable = computed(() => {
    return !!queryParams.value.filter?.invoiceId;
  });

  const query = useQuery({
    ...configs,
    enabled: isEnable,
    queryKey: [paymentQueryKey.commentList.queryKey, queryParams],
    queryFn: () => getAll({ body: queryParams }),
  });

  return {
    query,
    queryParams,
  };
}
