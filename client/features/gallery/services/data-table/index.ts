import type { TableProps } from 'ant-design-vue';
import { useQueryAllGallery } from '../../apis';

export function useDataTableGallery() {
  const { listData, meta, page, pageSize, ...query } = useQueryAllGallery();

  const dataSource = computed(() => listData.value.map((item) => ({ ...item, key: item.id })));
  const paginationTable = computed<TableProps['pagination']>(() => {
    const metaValue = meta.value;
    return {
      total: metaValue?.total,
      current: page.value ?? metaValue?.currentPage,
      pageSize: pageSize.value ?? 20,
      showLessItems: true,
      pageSizeOptions: ['20', '40', '60', '80', '100'],
      showSizeChanger: true,
    };
  });

  return { ...query, paginationTable, listData, dataSource };
}
