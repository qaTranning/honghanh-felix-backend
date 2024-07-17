import type { ComposerTranslation } from '@nuxtjs/i18n/dist/runtime/composables';
import { Image, Tag, type TableColumnsType, type TableProps } from 'ant-design-vue';
import { useGetAllBrandsQuery, useMutationRemoveBrand } from '../../apis';
import type { IBrand } from '../../models';
import { getColorTagStatus } from '../../utils';
import { getUrlImageLow } from '~/common/helpers/image';
import { ShTableCellAction, ShTableCellLink } from '~/components/organisms';
import { profileHandleName } from '~/features/profile';

export function useBrandTable(t: ComposerTranslation) {
  const {
    mutation: { mutate: mutateRemove },
  } = useMutationRemoveBrand();

  const columns: TableColumnsType<IBrand & { name: string }> = [
    {
      title: t('field.thumbnail'),
      key: 'thumbnail',
      width: 100,
      customRender: ({ record }) =>
        h(Image, {
          src: getUrlImageLow(record.thumbnail),
        }),
    },
    { title: t('field.name'), dataIndex: 'title', key: 'title' },
    {
      title: 'Chủ sỡ hữu',
      dataIndex: 'user',
      key: 'user',
      customRender: ({ record }) =>
        h(ShTableCellLink, {
          name: profileHandleName(record?.user?.firstname, record?.user?.lastname),
          async onClick() {
            await navigateTo({
              name: 'data-user-update',
              query: { id: record?.user?.id },
            });
          },
        }),
    },
    { title: t('field.taxCode'), dataIndex: 'taxCode', key: 'taxCode' },
    { title: t('field.address'), dataIndex: 'address', key: 'address' },
    {
      title: t('field.status'),
      key: 'status',
      width: 80,
      customRender: ({ record }) =>
        h(
          Tag,
          {
            color: getColorTagStatus(record.status),
          },
          record.status
        ),
    },
    {
      title: t('field.action'),
      key: 'operation',
      fixed: 'right',
      width: 150,
      customRender: ({ record }) =>
        h(ShTableCellAction, {
          onRemove: () => {
            mutateRemove({ params: { id: record.id } });
          },
          onUpdate: () => navigateTo({ name: 'data-brand-update', query: { id: record.id } }),
        }),
    },
  ];

  const {
    query: { data, suspense, isLoading, refetch },
    page,
    pageSize,
    ...rest
  } = useGetAllBrandsQuery({});

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
    const meta = data.value?.data.meta;
    return {
      total: meta?.total,
      current: page.value ?? meta?.currentPage,
      pageSize: pageSize.value ?? 20,
      showLessItems: true,
      pageSizeOptions: ['20', '40', '60', '80', '100'],
      showSizeChanger: true,
    };
  });

  const dataSource = computed(() => data.value?.data.data || []);

  return {
    columns,
    handleTableChange,
    dataSource,
    paginationTable,
    suspense,
    isRefreshing,
    handleRefresh,
    isLoading: computed(() => isLoading),
    ...rest,
  };
}
