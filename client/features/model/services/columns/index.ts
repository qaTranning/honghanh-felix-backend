import type { ComposerTranslation } from '@nuxtjs/i18n/dist/runtime/composables';
import { type TableColumnsType, type TableProps } from 'ant-design-vue';
import dayjs from 'dayjs';
import { useGetAllModelsQuery } from '../../apis';
import { IMAGE_HELPER, TIME_HELPER } from '~/common/helpers';
import { profileHandleName } from '~/features/profile';
import type { IUser } from '~/features/user/models';
import { ShTableCellUser } from '~/components/organisms';

export function useModelTable(t: ComposerTranslation) {
  const columns: TableColumnsType<IUser & { name: string }> = [
    {
      title: 'Người mẫu',
      key: 'model',
      width: 200,
      customRender: ({ record }) =>
        h(ShTableCellUser, {
          fullname: profileHandleName(record.firstname, record.lastname),
          email: record.email,
          phone: record.model?.phone || '',
          avatar: record.avatar,
        }),
      fixed: 'left',
    },

    {
      title: t('field.gender'),
      key: 'gender',
      width: 80,
      customRender: ({ record }) => {
        return record?.model?.gender || 'N/A';
      },
    },

    {
      title: 'Ethnic',
      dataIndex: 'citizenship',
      key: 'citizenship',
      width: 80,
      customRender: ({ record }) => record.model?.citizenship,
    },
    {
      title: t('field.dob'),
      width: 80,
      dataIndex: 'dob',
      key: 'dob',

      customRender: ({ record }) =>
        h(
          'span',
          TIME_HELPER.formatDate({
            date: dayjs(record.dob),
            format: 'DD/MM/YYYY',
          })
        ),
    },
    { title: t('field.status'), width: 80, dataIndex: 'status', key: 'status' },

    {
      title: t('field.createdAt'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 100,
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
      width: 80,
    },
  ];

  const queryALlModel = useGetAllModelsQuery();
  const {
    query: { data, suspense, isLoading, refetch },
    page,
    pageSize,
  } = queryALlModel;

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

  watch(paginationTable, () => {
    console.log('paginationTable', paginationTable.value);
  });

  const dataSource = computed(() => {
    const modelData = data.value?.data.data;
    return (
      modelData?.map((model) => {
        return {
          key: 'model ' + model.id,
          name: profileHandleName(model.firstname, model.lastname),

          ...model,
        };
      }) || []
    );
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
    ...queryALlModel,
  };
}
