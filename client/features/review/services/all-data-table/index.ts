import type { TableProps } from 'ant-design-vue';
import { useQueryAllReview } from '../../apis';

export function useAllDataTableReview() {
  const { data, page, pageSize, ...query } = useQueryAllReview({});

  const dataSource = computed(() => data.value?.data.data || []);

  const meta = computed(() => data.value?.data.meta);

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

  return { dataSource, paginationTable, meta, ...query };
}
