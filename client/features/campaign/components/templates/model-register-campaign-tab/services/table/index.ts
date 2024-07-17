import type { ComposerTranslation } from '@nuxtjs/i18n/dist/runtime/composables';
import { type TableColumnsType, type TableProps } from 'ant-design-vue';
import dayjs from 'dayjs';
import { TIME_HELPER } from '~/common/helpers';
import { ShTableCellUser } from '~/components/organisms';
import { useGetAllRegisterCampaignsQuery } from '~/features/campaign/apis';
import type { IRegisterCampaign } from '~/features/campaign/models';
import { profileHandleName } from '~/features/profile';

export function useRegisterCampaignTable(t: ComposerTranslation) {
  const columns: TableColumnsType<IRegisterCampaign> = [
    {
      title: 'Người mẫu',
      key: 'model',
      width: 200,
      customRender: ({ record }) =>
        h(ShTableCellUser, {
          fullname: profileHandleName(record.model.user.firstname, record.model.user.lastname),
          email: record.model.user.email,
          phone: record.model.phone,
          avatar: record.model.user.avatar,
          id: record.model.id,
        }),
      fixed: 'left',
    },
    {
      title: 'Vai trò của chiến dịch',
      width: 100,
      key: 'campaignRole',
      customRender({ record }) {
        return h('span', {}, record?.campaignRole?.name || '');
      },
    },
    {
      title: t('field.status'),
      width: 60,
      key: 'Status',
      customRender({ record }) {
        return h('span', {}, record.status);
      },
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
    },
  ];

  const {
    query: { data, suspense, isLoading, refetch },
    page,
    pageSize,
    ...rest
  } = useGetAllRegisterCampaignsQuery();

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
    const registerCampaignData = data.value?.data.data;
    return registerCampaignData?.map((registerCampaign) => {
      return {
        key: 'registerCampaign ' + registerCampaign.id,
        ...registerCampaign,
      };
    });
  });

  return {
    columns,
    handleTableChange,
    dataSource,
    paginationTable,
    suspense,
    isLoading: computed(() => isLoading),
    refetch,
    ...rest,
  };
}
