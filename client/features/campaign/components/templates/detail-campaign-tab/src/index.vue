<template>
  <ShDashboardFormView :loading="query.isLoading.value">
    <template #main>
      <a-card title="Thông tin cơ bản">
        <div class="flex flex-col space-y-2 divide-y-2 divide-red-500">
          <ShInfoItemVer :label="t('field.name')" :value="campaignData?.name" />
          <ShInfoItemVer :label="t('field.description')" :value="campaignData?.description" />
          <!-- <ShInfoItemVer :label="t('field.requirement')" :value="campaignData?.requirement" /> -->
          <ShInfoItemVer :label="t('field.location')" :value="campaignData?.location" />
          <!-- <ShInfoItemVer :label="t('field.domain')" :value="campaignData?.domain" /> -->
          <!-- <ShInfoItemVer :label="t('field.type')" :value="campaignData?.type" /> -->
          <ShInfoItemVer :label="t('field.budget')" :value="campaignDetail.formatBudget" />
          <ShInfoItemVer :label="'Số lượng vai trò'" :value="campaignDetail.roleNumber" />
        </div>
        <!-- <ShInfoItemVer :label="t('field.order')" :value="campaignData?.order?.toString() || ''" /> -->
      </a-card>
      <a-card title="Thông tin liên quan">
        <ShInfoItemVer
          label="Tên thương hiệu"
          :value="
            h(ShTableCellLink, {
              textName: campaignData?.brandName,
              name: campaignData?.brand?.title || '',
              onClick: () =>
                navigateTo({ name: 'data-brand-update', query: { id: campaignData?.brand?.id } }),
            })
          "
        />

        <ShInfoItemVer label="Thời gian độc quyền" :value="campaignData?.exclusiveTime || ''" />
        <!-- <ShInfoItemVer
          label="Thời gian làm việc"
          :value="campaignData?.workHours.toString() + 'giờ' || ''"
        /> -->
      </a-card>
    </template>
    <template #side>
      <a-form layout="vertical">
        <a-card title="Trạng thái">
          <a-form-item>
            <ShInfoItemVer
              :label="t('field.status')"
              :value="h(UpdateStatusCampaign, { data: campaignData })"
            />
          </a-form-item>
        </a-card>
      </a-form>
      <a-form layout="vertical">
        <a-card title="Ảnh bìa">
          <a-form-item>
            <ShImage :src="IMAGE_HELPER.getUrlImageLow(campaignData?.thumbnail)" />
          </a-form-item>
        </a-card>
      </a-form>
      <a-card title="Timeline">
        <TimelineDetailCampaign :data="campaignData" />
      </a-card>
    </template>
  </ShDashboardFormView>
</template>

<script setup lang="ts">
import { TimelineDetailCampaign } from '../../../organisms';
import { IMAGE_HELPER, NUMBER_HELPER, TIME_HELPER } from '~/common';
import { useRouteQuery } from '~/common/hooks/route-query';
import { ShDashboardFormView, ShImage, ShInfoItemVer } from '~/components';
// import { TableCellListStyleTag } from '../../components';
import { useGetDetailCampaignQuery } from '~/features/campaign/apis';
import type { ICampaign } from '~/features/campaign/models';
import ShTableCellLink from '~/components/organisms/table-cell/src/sh-table-cell-link.vue';
import { UpdateStatusCampaign } from '~/features/campaign/widgets';
import { FormatDateTimeEnum } from '~/common/helpers/time';
const id = useRouteQuery('id');
const { t } = useI18n();
const { currentCampaignId, query } = useGetDetailCampaignQuery();
const campaignData = computed(() => query.data.value?.data as ICampaign | undefined);

const campaignDetail = computed(() => ({
  ...campaignData.value,
  roleNumber: campaignData.value?.campaignRoles.length.toString() || '0',
  formatBudget: NUMBER_HELPER.formatNumberPrice(Number(campaignData.value?.budget) || 0),
}));

// const brandData = computed(() => query.data.value?.data. as IBrand | undefined);

const formatBudget = NUMBER_HELPER.formatNumberPrice(Number(campaignData.value?.budget) || 0);

onMounted(() => {
  currentCampaignId.value = Number(id.value);
});
</script>
