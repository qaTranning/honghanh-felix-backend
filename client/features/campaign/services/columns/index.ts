import { Image, type TableColumnsType, type TableProps } from 'ant-design-vue';
import dayjs from 'dayjs';
import type { ComposerTranslation } from '@nuxtjs/i18n/dist/runtime/composables';
import { useGetAllCampaignsQuery } from '../../apis';
import { CampaignTag } from '../../components/moledules/campaign-tag';
import type { ICampaign } from '@/features/campaign/models';
import { IMAGE_HELPER, TIME_HELPER } from '~/common/helpers';
import { ShTableCellLink } from '~/components/organisms';

export function useCampaignTable(t: ComposerTranslation) {
  const columns: TableColumnsType<ICampaign & { name: string }> = [
    { title: t('field.title'), width: 100, dataIndex: 'name', key: 'name', fixed: 'left' },

    {
      title: 'Ảnh bìa',
      width: 90,
      dataIndex: 'image',
      key: 'image',
      customRender: ({ record }) =>
        record?.thumbnail
          ? h(Image, {
              src: IMAGE_HELPER.getUrlImageLow(record?.thumbnail),
              width: '100%',
              height: '100px',
            })
          : h('span', 'Không có ảnh'),
    },

    {
      title: 'Số lượng vai trò',
      width: 100,
      dataIndex: 'count_role',
      key: 'count_role',
      customRender: ({ record }) => h('span', record._count.campaignRoles),
    },

    {
      title: t('field.startDate'),
      dataIndex: 'startDate',
      key: 'startDate',
      width: 80,

      customRender: ({ record }) =>
        h(
          'span',
          TIME_HELPER.formatDate({
            date: dayjs(record.startDate),
            format: 'DD/MM/YYYY',
          })
        ),
    },
    {
      title: t('common.brand'),
      width: 80,
      dataIndex: 'brand',
      key: 'brand',
      customRender: ({ record }) =>
        h(ShTableCellLink, {
          textName: record?.brandName,
          name: record?.brand?.title || '',
          onClick: () => navigateTo({ name: 'data-brand-update', query: { id: record.brandId } }),
        }),
    },
    {
      title: t('field.status'),
      width: 80,
      dataIndex: 'status',
      key: 'status',

      customRender: ({ record }) =>
        h(CampaignTag, {
          status: record.status,
        }),
    },
    {
      title: t('field.action'),
      key: 'operation',
      fixed: 'right',
      width: 50,
    },
  ];

  const {
    query: { data, suspense, isLoading, refetch },
    page,
    pageSize,
    ...rest
  } = useGetAllCampaignsQuery();

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
    const campaignData = data.value?.data.data;
    return campaignData?.map((campaign) => {
      return {
        key: 'campaign ' + campaign.id,
        ...campaign,
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
