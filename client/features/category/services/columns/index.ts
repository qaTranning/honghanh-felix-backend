import { type TableColumnsType, type TableProps } from 'ant-design-vue';
import dayjs from 'dayjs';
import type { ComposerTranslation } from '@nuxtjs/i18n/dist/runtime/composables';
import { useGetAllCategorysQuery } from '../../apis';
import type { ICategory } from '@/features/category/models';
import { TIME_HELPER } from '~/common/helpers';

export function useCategoryTable(t: ComposerTranslation) {
  const columns: TableColumnsType<ICategory & { name: string }> = [
    { title: t('field.name'), dataIndex: 'name', key: 'name', fixed: 'left' },
    {
      title: t('field.created_at'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      customRender: ({ record }) =>
        h(
          'span',
          TIME_HELPER.formatDate({
            date: dayjs(record.createdAt),
            format: 'YYYY-MM-DD HH:mm',
          })
        ),
    },
    {
      title: t('field.action'),
      key: 'operation',
      fixed: 'right',
      width: 150,
    },
  ];

  const {
    query: { data, suspense, isLoading, refetch },
    page,
    pageSize,
    ...rest
  } = useGetAllCategorysQuery();

  const isRefreshing = ref(false);
  const handleRefresh = async () => {
    try {
      isRefreshing.value = true;
      await refetch();
    } finally {
      isRefreshing.value = false;
    }
  };

  const handleTableChange: TableProps['onChange'] = (pagination, _filters, _sorter) => {
    page.value = pagination.current ?? 1;
    pageSize.value = pagination.pageSize ?? 20;
  };

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

  const dataSource = computed(() => {
    const categoryData = data.value?.data.data;
    return categoryData?.map((category) => {
      return {
        key: 'category ' + category.id,
        ...category,
      };
    });
  });

  return {
    columns,
    handleTableChange,
    dataSource,
    paginationTable,
    suspense,
    handleRefresh,
    isRefreshing,
    isLoading: computed(() => isLoading),
    ...rest,
  };
}
