import { Tag, type TableColumnsType, type TableProps } from 'ant-design-vue';
import dayjs from 'dayjs';
import type { ComposerTranslation } from '@nuxtjs/i18n/dist/runtime/composables';
import type { IUser } from '../../models';
import { getColorTagRole, navigateToUserDetail } from '../../utils';
import { useGetAllUsersQuery } from '../../apis';
import { useDeleteUserService } from '../delete-user';
import { TIME_HELPER } from '~/common/helpers';
import { profileHandleName } from '~/features/profile';
import { ShTableCellAction } from '~/components';

export function useUserTable(t: ComposerTranslation) {
  const { handleDeleteUser } = useDeleteUserService();

  const columns: TableColumnsType<IUser> = [
    { title: 'ID', width: 45, dataIndex: 'id', key: 'id' },
    { title: t('field.fullName'), width: 100, dataIndex: 'name', key: 'name' },
    { title: t('field.email'), width: 120, dataIndex: 'email', key: 'email' },
    // { title: t('field.phone'), width: 80, dataIndex: 'phone', key: 'phone' },
    // { title: t('field.address'), dataIndex: 'address', key: 'address', width: 150 },
    {
      title: t('field.role'),
      key: 'role',
      width: 80,
      customRender: ({ record }) =>
        h(
          Tag,
          {
            color: getColorTagRole(record.role),
          },
          record.role
        ),
    },
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
      customRender: ({ record }) =>
        h(ShTableCellAction, {
          onRemove: () => {
            handleDeleteUser(record.id);
          },
          onUpdate: () => navigateToUserDetail(record.id),
        }),
    },
  ];

  const queryGetAllUser = useGetAllUsersQuery();
  const {
    query: { data, suspense, isLoading, refetch },
    page,
    pageSize,
    onChangeDebounce,
  } = queryGetAllUser;

  function handleSearch(value: string) {
    onChangeDebounce(value, () => {
      page.value = 1;
    });
  }

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

  const dataSource = computed(() => {
    const userData = data.value?.data.data;
    return userData?.map((user) => {
      return {
        key: 'user ' + user.id,
        name: profileHandleName(user.firstname, user.lastname),
        ...user,
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
    handleSearch,
    ...queryGetAllUser,
  };
}
