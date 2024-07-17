import { useQuery } from '@tanstack/vue-query';
import { merge } from 'lodash-es';
import type { IPayment } from '../../models';
import { usePaginateReq, useString } from '~/common';
import { requestApi } from '~/common/libs';
import type { DeepPartial, IBaseQueryParams, IResponseListApi } from '~/common/models';
import { allQueriesKeys, type QueryConfig } from '~/queries';

interface Filter {
  invoiceId?: number;
  userId?: number;
}
export interface IParamsAllPaymentComment extends IBaseQueryParams<Filter> {}

interface IGetAllCategoryRequest {
  params: IParamsAllPaymentComment;
}

function onQuery(req: IGetAllCategoryRequest) {
  const { params } = req;
  return requestApi<typeof params, IResponseListApi<IPayment>>({
    method: 'POST',
    url: 'invoice/comment/all',
    data: params,
  });
}

interface IProps {
  configs?: QueryConfig<typeof onQuery>;
  defaultParams?: DeepPartial<IParamsAllPaymentComment>;
}

export function useQueryAllDataPaymentComment(props: IProps = {}) {
  const { page, pageSize } = usePaginateReq();
  const { configs, defaultParams } = props;
  const [search, { onChangeDebounce }] = useString();

  const currentParams = computed<IParamsAllPaymentComment>(() =>
    merge(
      {
        paginate: {
          perPage: pageSize.value,
          page: page.value,
        },
        filter: {},
        order: {
          // createAt: 'asc',
        },
      },
      defaultParams
    )
  );

  const queryKeyRef = computed(() => [
    ...allQueriesKeys.PAYMENT.commentList.queryKey,
    currentParams,
  ]);

  const query = useQuery({
    queryKey: queryKeyRef,
    queryFn: () =>
      onQuery({
        params: currentParams.value,
      }),
    ...configs,
  });

  const listData = computed(() => query.data.value?.data.data || []);
  const meta = computed(() => query.data.value?.data.meta);

  return {
    page,
    pageSize,
    search,
    onChangeDebounce,
    ...query,
    listData,
    meta,
  };
}
