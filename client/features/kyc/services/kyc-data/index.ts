import type { TableProps } from 'ant-design-vue';
import type { KycStatusType } from '../../models';
import { useGetAllUsersQuery } from '~/features/user/apis';

export function useKycData({ defaultKycStatus }: { defaultKycStatus?: KycStatusType }) {
  const { query, page, pageSize, ...queryAction } = useGetAllUsersQuery({
    defaultParams: {
      filter: {
        role: 'MODEL',
        kycStatus: defaultKycStatus,
      },
    },
  });

  const { data } = query;

  const paginationTable = computed<TableProps['pagination']>(() => {
    const meta = data.value?.data?.meta;
    return {
      total: meta?.total,
      current: page.value ?? meta?.currentPage,
      pageSize: pageSize.value ?? meta?.perPage,
      showLessItems: true,
      pageSizeOptions: ['20', '40', '60', '80', '100'],
      showSizeChanger: true,
    };
  });

  const handleTableChange: TableProps['onChange'] = (pagination, _filters, _sorter) => {
    page.value = pagination.current ?? 1;
    pageSize.value = pagination.pageSize ?? 20;
  };

  return { ...query, ...queryAction, paginationTable, handleTableChange };
}
