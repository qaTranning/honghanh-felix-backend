import { useQuery } from '@tanstack/vue-query';
import { merge } from 'lodash-es';
import type { IPayment, InvoiceStatusType } from '../../models';
import { usePaginateReq, useString } from '~/common';
import { requestApi } from '~/common/libs';
import type { DeepPartial, IBaseQueryParams, IResponseListApi } from '~/common/models';
import { allQueriesKeys, type QueryConfig } from '~/queries';

interface Filter {
  name?: string;
  invoiceStatus?: InvoiceStatusType;
  campaignId?: number;
}

interface Order {
  workingHours?: 'desc' | 'asc' | undefined;
  otHours?: 'desc' | 'asc' | undefined;
}

export interface IParamsGetAllPayment extends IBaseQueryParams<Filter, Order> {}

interface IGetAllCategoryRequest {
  params: IParamsGetAllPayment;
}

function onQuery(req: IGetAllCategoryRequest) {
  const { params } = req;
  return requestApi<typeof params, IResponseListApi<IPayment>>({
    method: 'POST',
    url: 'invoice/all',
    data: params,
  });
}

interface IProps {
  configs?: QueryConfig<typeof onQuery>;
  defaultParams?: DeepPartial<IParamsGetAllPayment>;
}

export function useQueryAllDataPayment(props: IProps = {}) {
  const { page, pageSize } = usePaginateReq();
  const { configs, defaultParams } = props;
  const [search, { onChangeDebounce }] = useString();
  const [invoiceStatus] = useString(defaultParams?.filter?.invoiceStatus);

  const orderRef = ref<IParamsGetAllPayment['order']>({});

  const currentParams = computed<IParamsGetAllPayment>(() =>
    merge({
      paginate: {
        perPage: pageSize.value,
        page: page.value,
      },
      filter: {
        name: search.value || undefined,
        invoiceStatus: invoiceStatus.value || undefined,
        campaignId: defaultParams?.filter?.campaignId,
      },
      order: {
        createdAt: 'desc',
        ...orderRef.value,
      },
    })
  );

  const queryKeyRef = computed(() => [...allQueriesKeys.PAYMENT.list.queryKey, currentParams]);

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
    invoiceStatus,
    orderRef,
  };
}
