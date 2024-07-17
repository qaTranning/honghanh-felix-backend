import type { TableProps } from 'ant-design-vue';
import { useQueryAllDataPayment, type IParamsGetAllPayment } from '../../apis';
import type { InvoiceStatusType } from '../../models';

interface Props {
  defaultInvoiceStatus?: InvoiceStatusType;
  campaignId?: number;
  order?: IParamsGetAllPayment['order'];
}
export function useAllDataTablePayment({ defaultInvoiceStatus, campaignId, order }: Props) {
  const { listData, meta, page, pageSize, invoiceStatus, ...query } = useQueryAllDataPayment({
    defaultParams: { filter: { invoiceStatus: defaultInvoiceStatus, campaignId }, order },
  });

  const handleTableChange: TableProps['onChange'] = (pagination, _filters, _sorter) => {
    page.value = pagination.current ?? 1;
    pageSize.value = pagination.pageSize ?? 20;
  };

  const paginationTable = computed<TableProps['pagination']>(() => {
    return {
      total: meta.value?.total,
      current: page.value ?? meta.value?.currentPage,
      pageSize: pageSize.value ?? meta.value?.perPage,
      showLessItems: true,
      pageSizeOptions: ['20', '40', '60', '80', '100'],
      showSizeChanger: true,
    };
  });
  return { listData, meta, paginationTable, handleTableChange, invoiceStatus, ...query };
}
