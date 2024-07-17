import type { ComposerTranslation } from '@nuxtjs/i18n/dist/runtime/composables';
import { type TableColumnsType, type TableProps } from 'ant-design-vue';
import dayjs from 'dayjs';
import { NUMBER_HELPER, TIME_HELPER } from '~/common/helpers';
import { useRouteQuery } from '~/common/hooks/route-query';
import { TableCellListStyleTag } from '~/features/app-config/components';
import { useGetAllCampaignRolesQuery } from '~/features/campaign/apis';
import { CampaignRoleTag } from '~/features/campaign/components/moledules/campaign-role-tag';
import type { ICampaignRole } from '~/features/campaign/models';

export function useCampaignRoleTable(t: ComposerTranslation) {
  const columns: TableColumnsType<ICampaignRole & { name: string }> = [
    { title: t('field.name'), width: 150, dataIndex: 'name', key: 'name', fixed: 'left' },

    {
      title: t('field.budget'),
      dataIndex: 'budget',
      key: 'budget',
      width: 150,
      customRender({ record }) {
        const formatBudget = NUMBER_HELPER.formatNumberPrice(Number(record?.budget) || 0);
        return h('span', formatBudget);
      },
    },
    {
      title: t('field.quantity'),
      width: 100,
      dataIndex: 'quantity',
      key: 'quantity',
    },

    { title: 'Ethnic', width: 150, dataIndex: 'citizenship', key: 'citizenship' },
    { title: t('field.fromHeight'), width: 150, dataIndex: 'fromHeight', key: 'fromHeight' },
    { title: t('field.toHeight'), width: 150, dataIndex: 'toHeight', key: 'toHeight' },
    { title: t('field.fromAge'), width: 150, dataIndex: 'fromAge', key: 'fromAge' },
    { title: t('field.toAge'), width: 150, dataIndex: 'toAge', key: 'toAge' },
    {
      title: t('field.style'),
      width: 140,
      dataIndex: 'style',
      key: 'style',
      customRender({ record }) {
        return h(TableCellListStyleTag, { value: record.style, max: 1 });
      },
    },
    { title: t('field.wordload'), width: 160, dataIndex: 'wordload', key: 'wordload' },
    {
      title: 'Thời gian làm việc dự kiến',
      dataIndex: 'workingDate',
      key: 'workingDate',
      width: 250,
      customRender: ({ record }) =>
        TIME_HELPER.formatDate({
          date: dayjs(record.startShootingDate),
          format: 'HH:mm - DD/MM/YYYY',
        }) +
        ' -> ' +
        TIME_HELPER.formatDate({
          date: dayjs(record.endShootingDate),
          format: 'HH:mm - DD/MM/YYYY',
        }),
    },
    {
      title: 'Thời gian thử đồ dự kiến',
      dataIndex: 'workingDate',
      key: 'workingDate',
      width: 250,
      customRender: ({ record }) =>
        TIME_HELPER.formatDate({
          date: dayjs(record.startFittingDate),
          format: 'HH:mm - DD/MM/YYYY',
        }) +
        ' -> ' +
        TIME_HELPER.formatDate({
          date: dayjs(record.endFittingDate),
          format: 'HH:mm - DD/MM/YYYY',
        }),
    },
    {
      title: t('field.status'),
      dataIndex: 'status',
      width: 120,
      fixed: 'right',
      customRender({ record }) {
        return h(CampaignRoleTag, { status: record.status });
      },
    },

    {
      title: t('field.action'),
      key: 'operation',
      fixed: 'right',
      width: 150,
    },
  ];
  const isEnable = ref(false);

  const {
    query: { data, suspense, isLoading },
    page,
    pageSize,
    campaignId,
    ...rest
  } = useGetAllCampaignRolesQuery({
    configs: {
      enabled: isEnable,
    },
  });

  onMounted(() => {
    const campaignRouteId = Number(useRouteQuery('id').value) || 0;
    if (!campaignRouteId) return;

    isEnable.value = true;

    campaignId.value = campaignRouteId;
  });

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
    const campaignRoleData = data.value?.data.data;
    return campaignRoleData?.map((campaignRole) => {
      return {
        key: 'campaignRole ' + campaignRole.id,
        ...campaignRole,
      };
    });
  });

  return {
    columns,
    handleTableChange,
    dataSource,
    paginationTable,
    suspense,
    campaignId,
    isLoading: computed(() => isLoading),
    ...rest,
  };
}
