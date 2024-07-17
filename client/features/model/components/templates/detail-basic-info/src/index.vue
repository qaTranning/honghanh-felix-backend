<template>
  <a-spin :spinning="!!isFetching">
    <ShDashboardFormView>
      <template #main>
        <a-card title="Thông tin chung">
          <ShInfoItemHoz :label="t('field.fullname')" :value="getFullname(resultUser)" />
          <ShInfoItemHoz :label="t('field.phone')" :value="resultModel?.phone || '-'" />

          <ShInfoItemHoz
            :label="t('field.dob')"
            :value="TIME_HELPER.formatDate({ date: dayjs(resultModel?.dob), format: 'DD-MM-YYYY' })"
          />

          <ShInfoItemHoz :label="t('field.gender')" :value="resultModel?.gender?.toString()" />
          <ShInfoItemHoz :label="t('field.location')" :value="resultModel?.location || ''" />
        </a-card>
        <a-card title="Thông tin ngân hàng">
          <ShInfoItemHoz label="Tên chủ thẻ" :value="resultModel?.cardHolder || ''" />
          <ShInfoItemHoz label="Số tài khoản" :value="resultModel?.bankAccount || ''" />
          <ShInfoItemHoz label="Ngân hàng" :value="resultModel?.bankName || ''" />
          <ShInfoItemHoz label="Chi nhánh" :value="resultModel?.bankAddress || ''" />
        </a-card>
        <a-card title="Mạng xã hội">
          <ShInfoItemHoz label="Facebook" :value="resultModel?.facebook?.toString() || ''" />
          <ShInfoItemHoz label="Tiktok" :value="resultModel?.tiktok?.toString() || ''" />

          <ShInfoItemHoz label="twitter" :value="resultModel?.twitter?.toString() || ''" />
          <ShInfoItemHoz label="Instagram" :value="resultModel?.instagram?.toString() || ''" />
        </a-card>
        <a-card title="Số đo cơ thể">
          <ShInfoItemHoz
            label="Cân nặng"
            :value="resultModel?.weight?.toString() || '---' + ' kg'"
          />
          <ShInfoItemHoz
            label="Chiều cao"
            :value="resultModel?.height?.toString() || '---' + ' kg'"
          />
          <ShInfoItemHoz
            label="Số đo vòng 1"
            :value="resultModel?.bust?.toString() || '---' + ' cm'"
          />
          <ShInfoItemHoz
            label="Số đo vòng 2"
            :value="resultModel?.hips?.toString() || '---' + ' cm'"
          />
          <ShInfoItemHoz
            label="Số đo vòng 3"
            :value="resultModel?.waist?.toString() || '---' + ' cm'"
          />
        </a-card>
        <a-card title="Đặc điểm">
          <ShInfoItemHoz label="Màu da" :value="resultModel?.skinColor?.toString() || ''" />
          <ShInfoItemHoz label="Màu mắt" :value="resultModel?.eyeColor?.toString() || ''" />

          <ShInfoItemHoz label="Màu tóc" :value="resultModel?.hairColor?.toString() || ''" />
          <ShInfoItemHoz label="Độ dài tóc" :value="resultModel?.hairLength?.toString() || ''" />
          <ShInfoItemHoz label="Cỡ áo" :value="resultModel?.shirtSize?.toString() || ''" />

          <ShInfoItemHoz label="Cỡ quần" :value="resultModel?.trousersSize?.toString() || ''" />
          <ShInfoItemHoz
            label="Phong cách"
            :value="
              resultModel?.style
                ? h(TableCellListStyleTag, {
                    value: resultModel.style || '',
                    max: 3,
                  })
                : undefined
            "
          />
          <ShInfoItemHoz label="Hình xăm" :value="resultModel?.tattoo?.toString() || ''" />
        </a-card>
      </template>
      <template #side>
        <a-card title="Xác minh">
          <template #extra>
            <KycStatusTag v-if="resultModel?.kycStatus" :status="resultModel?.kycStatus" />
          </template>
          <ShInfoItemHoz
            label="Hành động"
            :value="
              h(TableCallKycAction, {
                model: resultModel,
                isHideDetail: true,
                onVerify: (id) => showConfirmVerify(id),
                onReject: (id) => showConfirmReject(id),
              })
            "
          />
        </a-card>

        <a-form layout="vertical">
          <a-card title="Thẻ căn cước">
            <a-form-item label="Mặt trước">
              <ShImage :src="IMAGE_HELPER.getUrlImageLow(resultModel?.idCardFrontFace)" />
            </a-form-item>

            <a-form-item label="Mặt sau">
              <ShImage :src="IMAGE_HELPER.getUrlImageLow(resultModel?.idCardBackFace)" />
            </a-form-item>
          </a-card>
        </a-form>

        <a-card title="Lương">
          <ShInfoItemHoz label="Đơn vị" :value="resultModel?.currency?.toString() || ''" />
          <ShInfoItemHoz label="Lương 1h" :value="resultModel?.salary1h?.toString() || ''" />

          <ShInfoItemHoz label="Lương 4h" :value="resultModel?.salary4h?.toString() || ''" />
          <ShInfoItemHoz label="Lương 8h" :value="resultModel?.salary8h?.toString() || ''" />
          <ShInfoItemHoz label="Lương 12h" :value="resultModel?.salary8h?.toString() || ''" />
          <ShInfoItemHoz label="Lương 24h" :value="resultModel?.salary8h?.toString() || ''" />
          <ShInfoItemHoz label="Lương ngoài giờ" :value="resultModel?.salary8h?.toString() || ''" />
        </a-card>
      </template>
    </ShDashboardFormView>
  </a-spin>
</template>

<script setup lang="ts">
import dayjs from 'dayjs';
import { IMAGE_HELPER, TIME_HELPER } from '~/common';
import { useRouteQuery } from '~/common/hooks/route-query';
import { ShDashboardFormView, ShImage, ShInfoItemHoz } from '~/components';
import { useGetDetailModelQuery } from '~/features/model/apis';
import type { IUser } from '~/features/user/models';
import { TableCellListStyleTag } from '~/features/app-config/components';
import { KycStatusTag, TableCallKycAction } from '~/features/kyc/components';
import { useUpdateKycStatusModal } from '~/features/kyc/services/update-kyc-status-model';

const id = useRouteQuery('id');

const {
  currentModelId,
  resultUser,
  resultModel,
  query: { isFetching },
} = useGetDetailModelQuery();

const { t } = useI18n();
function getFullname(user?: IUser) {
  if (!user) return '';

  return user.firstname + ' ' + user.lastname;
}

onMounted(() => {
  currentModelId.value = Number(id.value);
});

const { showConfirmReject, showConfirmVerify } = useUpdateKycStatusModal();
</script>
