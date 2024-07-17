<template>
  <ShBreadcrumb :routes="breadcrumb"></ShBreadcrumb>

  <a-form layout="vertical" aria-autocomplete="both" @submit="onSubmit">
    <ShDashboardFormView>
      <template #header>
        <div class="flex justify-end flex-row space-x-2">
          <router-link :to="{ name: 'data-payment' }"> <a-button>Huỷ bỏ</a-button></router-link>
          <a-button type="primary" @click="onSubmit">Tạo mới</a-button>
        </div>
      </template>
      <template #main>
        <a-card title="Thông tin hoá đơn">
          <template #extra>
            <a-typography-title :level="4">
              <span class="text-sm font-normal"> Tổng số tiền: </span>
              {{ totalMoney }}
            </a-typography-title>
          </template>

          <WorkingHoursFieldArray />

          <div class="flex flex-col my-4 space-y-3">
            <a-button
              class="w-max"
              :loading="mutationCalculateInvoice.isPending.value"
              @click="handleCalculateInvoice"
            >
              <template #icon>
                <DollarOutlined />
              </template>
              Tính toán
            </a-button>
            <p v-if="!!renderWorkingAndOtHours">{{ renderWorkingAndOtHours }}</p>
          </div>

          <a-form-item v-bind="salary" :label="`Tiền lương theo giờ`">
            <a-input-number
              class="w-full"
              :min="0"
              v-bind="salary"
              placeholder="Tiền lương theo giờ"
              :formatter="(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
              :parser="(value) => value.replace(/\$\s?|(,*)/g, '')"
            >
              <template #addonAfter>
                <a-select v-bind="currency">
                  <a-select-option value="VND">VND</a-select-option>
                  <a-select-option value="USD">USD</a-select-option>
                </a-select>
              </template>
            </a-input-number>
          </a-form-item>

          <!-- <a-form-item
            v-bind="otSalary"
            :label="`Tiền lương OT - (${responseCalculateInvoice?.otHours || 0} giờ)`"
            :help="
              +(responseCalculateInvoice?.salaryOvertime || 0) > 0
                ? `Lương OT của người mẫu là ${formatNumberPrice(
                    Number(responseCalculateInvoice?.salaryOvertime || 0)
                  )}/giờ`
                : undefined
            "
            :extra="
              responseCalculateInvoice?.salaryOvertime &&
              +(responseCalculateInvoice?.salaryOvertime || 0) === 0
                ? 'Người mẫu chưa cập nhật thông tin lương OT'
                : ''
            "
          >
            <a-input-number
              class="w-full"
              :min="0"
              v-bind="otSalary"
              placeholder="Tiền lương OT"
              :formatter="(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
              :parser="(value) => value.replace(/\$\s?|(,*)/g, '')"
            >
              <template #addonAfter>
                <a-select v-bind="currency">
                  <a-select-option value="VND">VND</a-select-option>
                  <a-select-option value="USD">USD</a-select-option>
                </a-select>
              </template>
            </a-input-number>
          </a-form-item> -->

          <!-- <a-form-item label="Giá trị sử dụng hình ảnh" v-bind="imageLicenseFee"
            ><a-input-number
              class="w-full"
              :min="0"
              :formatter="(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
              :parser="(value) => value.replace(/\$\s?|(,*)/g, '')"
              v-bind="imageLicenseFee"
              placeholder="Giá trị sử dụng hình ảnh"
            >
              <template #addonAfter>
                <a-select v-bind="currency">
                  <a-select-option value="VND">VND</a-select-option>
                  <a-select-option value="USD">USD</a-select-option>
                </a-select>
              </template>
            </a-input-number></a-form-item
          > -->

          <a-form-item v-bind="description" label="Mô tả">
            <a-textarea v-bind="description" placeholder="Nội dung thanh toán"></a-textarea>
          </a-form-item>
          <!-- <a-form-item label="Loại yêu cầu" v-bind="invoiceType">
            <a-select class="w-100!" v-bind="invoiceType">
              <a-select-option value="OT">OT</a-select-option>
              <a-select-option value="NORMAL">TỰ ĐỘNG</a-select-option>
            </a-select></a-form-item
          > -->

          <!-- <a-form-item :label="'Ảnh chuyển khoản'" v-bind="image">
            <ShUploadImagesVadidate :max-count="1" v-bind="image"
          /></a-form-item> -->
        </a-card>
      </template>

      <template #side>
        <a-card title="Thông tin người nhận">
          <!-- campaign -->
          <a-form-item label="Chọn chiến dịch" v-bind="modelId">
            <SelectModelInCampaignRole
              v-bind="modelId"
              @update:campaign-role="(e) => onSetCampaignRole(e)"
            />
          </a-form-item>
        </a-card>
      </template>
    </ShDashboardFormView>
  </a-form>
</template>

<script setup lang="ts">
import { DollarOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import type { Route } from 'ant-design-vue/lib/breadcrumb/Breadcrumb';
import { useMutationCalculateInvoice } from '../../apis';
import { useCreatePaymentForm } from '../../services';
import { WorkingHoursFieldArray } from '../../components';
import { ShDashboardFormView } from '~/components/organisms';

import { ShBreadcrumb } from '@/components/moledules';
import { ANDT_FORM_HELPER } from '~/common';
import { formatNumberPrice } from '~/common/helpers/number';
import { useGetDetailCampaignRoleQuery } from '~/features/campaign/apis/role/get-detail';
import { SelectModelInCampaignRole } from '~/features/model';

const breadcrumb: Route[] = [
  {
    path: 'index',
    breadcrumbName: 'Trang chủ',
  },

  {
    path: 'data-payment',
    breadcrumbName: 'Danh sách thanh toán',
  },
  {
    path: 'data-payment-create',
    breadcrumbName: 'Tạo hoá đơn thanh toán',
  },
];

const { onSubmit, defineComponentBinds, setFieldValue, values, errors, validateField } =
  useCreatePaymentForm();

const { currentCampaignRoleId, query: queryCampaignRoleDetail } = useGetDetailCampaignRoleQuery();

const mutationCalculateInvoice = useMutationCalculateInvoice();

const responseCalculateInvoice = computed(() => mutationCalculateInvoice.data?.value?.data);

watch(errors, (value) => {
  console.log('error', value);
});

const totalMoney = computed(() => {
  const salaryValue = Number(values.salary || 0);
  // const otSalaryValue = Number(values.otSalary || 0);
  // const imageLicenseFeeValue = Number(values.imageLicenseFee || 0);

  const total = salaryValue;

  return `${formatNumberPrice(total)} ${values.currency}`;
});
async function handleCalculateInvoice() {
  await validateField('workingHours');

  if (errors.value.workingHours) {
    message.error({
      content: 'Vui lòng nhập đầy đủ thông tin thời gian làm việc',
    });

    return;
  }

  const workingHours = values.workingHours;
  const campaignRoleId = values.campaignRoleId;
  const modelId = values.modelId;

  if (!workingHours) return;

  if (!campaignRoleId || !modelId) {
    message.error({
      content: 'Vui lòng chọn chiến dịch và người mẫu để tính toán',
    });

    return;
  }

  const valuesWorkingHours = workingHours.map((wh) => {
    const [startDate, endDate] = wh;

    return {
      startDate: startDate.toDate(),

      endDate: endDate.toDate(),
    };
  });

  const body = {
    workingHours: valuesWorkingHours,
    campaignRoleId,
    modelId,
  };

  mutationCalculateInvoice.mutate(
    { body },
    {
      onSuccess(data) {
        const salary = data?.data?.salary;
        // const salaryOT = data?.data?.otSalary;

        setFieldValue('salary', +(salary || 0));
        // setFieldValue('otSalary', +(salaryOT || 0));
      },
    }
  );
}

const renderWorkingAndOtHours = computed(function () {
  if (!mutationCalculateInvoice.responseCalculateInvoice.value) return '';
  const {
    workingHoursNumber = '0',
    otHours = '0',
    salary = '0',
  } = mutationCalculateInvoice.responseCalculateInvoice.value || {};

  return `Tổng số giờ làm việc: ${workingHoursNumber}, OT: ${otHours}, Lương: ${formatNumberPrice(
    Number(salary)
  )} ${values.currency}`;
});

const modelId = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'modelId');
const salary = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'salary');
const otSalary = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'otSalary');
const currency = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'currency');
const description = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'description');
const workingHours = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'workingHours');
const imageLicenseFee = ANDT_FORM_HELPER.defineFormItemAndtBinds(
  defineComponentBinds,
  'imageLicenseFee'
);

function onSetCampaignRole(id?: number) {
  setFieldValue('campaignRoleId', id as any);
  currentCampaignRoleId.value = id || null;
}

watch(
  () => queryCampaignRoleDetail.data.value?.data?.imageLicenseFee,
  (value) => {
    if (!value) return;
    setFieldValue('imageLicenseFee', +value);
  }
);
</script>
