<template>
  <ShBreadcrumb :routes="breadcrumb"></ShBreadcrumb>
  <a-form layout="vertical" aria-autocomplete="both">
    <ShDashboardFormView title="Thanh toán đơn" :loading="isLoading">
      <template #header>
        <div class="w-full flex justify-end flex-row space-x-2">
          <router-link :to="{ name: 'data-payment' }">
            <a-button> Danh sách </a-button>
          </router-link>
        </div>
      </template>
      <template #main>
        <a-card title="Thông tin hoá đơn" :loading="isLoading">
          <!-- ShTableCellLink  payment?.campaignRole.campaign.name-->
          <ShInfoItemHoz
            :label="'Tên chiến dịch'"
            :value="
              h(ShTableCellLink, {
                name: payment?.campaignRole.campaign.name,
                onClick: () =>
                  navigateTo({
                    name: 'data-campaign-detail',
                    query: { id: payment?.campaignRole.campaign.id },
                  }),
              })
            "
          />
          <ShInfoItemHoz label="Vai trò" :value="payment?.campaignRole.name" />
          <ShInfoItemHoz
            label="Ngân sách"
            :value="formatNumberPrice(Number(payment?.campaignRole.budget)) || '---'"
          />

          <ShInfoItemHoz
            label="Thương hiệu"
            :value="
              h(ShTableCellLink, {
                textName: payment?.campaignRole.campaign?.brandName,
                name: payment?.campaignRole.campaign.brand?.title || '',
                onClick: () =>
                  navigateTo({
                    name: 'data-brand-update',
                    query: { id: payment?.campaignRole.campaign.brand?.id },
                  }),
              })
            "
          />
          <!-- :value="payment?.campaignRole.campaign.brand?.title || ''" -->
          <!-- <ShInfoItemHoz
            label="Ngày thanh toán"
            :value="
              convertTimeAndDateFormat(
                FormatDateTimeEnum['DD-MM-YYYY HH:mm'],
                payment?.paymentTime || ''
              ) || ''
            "
          /> -->

          <ShInfoItemHoz
            label="Hạn thanh toán"
            :value="
              convertTimeAndDateFormat(
                FormatDateTimeEnum['DD-MM-YYYY HH:mm'],
                payment?.paymentPeriod || ''
              ) || ''
            "
          />

          <ShInfoItemHoz
            label="Trạng thái"
            :value="h(PaymentStatusTag, { status: payment?.invoiceStatus })"
          />

          <ShInfoItemHoz label="Lí do từ chối" :value="payment?.rejectReason || ''" />

          <ShInfoItemHoz label="Số tiền yêu cầu" :value="totalMoney" />
          <ShInfoItemHoz label="Tổng số giờ làm việc" :value="payment?.workingHoursNumber" />
          <ShInfoItemHoz label="Tổng số giờ OT" :value="payment?.otHours || ''" />
          <!-- <ShInfoItemHoz
            label="Loại yêu cầu"
            :value="payment?.invoiceType === 'OT' ? 'OT' : 'Tự động'"
          /> -->
          <!-- <ShInfoItemHoz
            v-if="payment?.invoiceType === 'OT'"
            label="Thời gian OT"
            :value="payment?.otHours || ''"
          /> -->
          <ShInfoItemHoz
            v-if="!!payment?.invoiceStatus"
            label="Hành động"
            :value="
              h(TableCellPaymentAction, {
                payment: payment,
                isNotShowDetail: true,
                onReject: (id) => showConfirmReject(id),
                onPay: (id) => showConfirmPay(id),
                onConfirm: (id) => showConfirmComplete(id),
                onApprove: (id) => showConfirmApprove(id),
              })
            "
          />
        </a-card>
        <a-card
          title="Thanh toán"
          :extra="
            h(
              Button,
              {
                type: 'primary',
                onClick: handleSubmit,
                disabled: !isAbleUpdate,
              },
              'Cập nhật'
            )
          "
        >
          <WorkingHoursFieldArray :disabled="!isAbleUpdate" />

          <div class="flex flex-col my-4 space-y-3">
            <a-button
              :disabled="!isAbleUpdate"
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
              :disabled="!isAbleUpdate"
              class="w-full"
              :min="0"
              v-bind="salary"
              placeholder="Tiền lương theo giờ"
              :formatter="(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
              :parser="(value) => value.replace(/\$\s?|(,*)/g, '')"
            >
              <template #addonAfter>
                <a-select v-bind="currency" :disabled="!isAbleUpdate">
                  <a-select-option value="VND">VND</a-select-option>
                  <a-select-option value="USD">USD</a-select-option>
                </a-select>
              </template>
            </a-input-number>
          </a-form-item>

          <!-- <a-form-item
            v-bind="otSalary"
            :label="`Tiền lương OT - (${Number(
              payment?.otHours || responseCalculateInvoice?.otHours || 0
            )} giờ)`"
            :help="
              +(responseCalculateInvoice?.salaryOvertime || 0) > 0
                ? `Lương OT của người mẫu là ${formatNumberPrice(
                    Number(responseCalculateInvoice?.salaryOvertime || 0)
                  )}/giờ`
                : ''
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
            <a-textarea
              :disabled="!isAbleUpdate"
              v-bind="description"
              placeholder="Nội dung thanh toán"
            ></a-textarea>
          </a-form-item>
        </a-card>

        <a-card v-if="!!payment" title="Trao đổi">
          <CommentsTemplate :payment="payment" />
        </a-card>
      </template>

      <template #side>
        <InvoiceUpdatePaid
          v-if="isShowPaid && !!payment"
          :invoice="payment"
          :paymentTime="payment?.paymentTime"
        />
        <a-card title="Người nhận thanh toán" :loading="isLoading">
          <ShInfoItemVer
            label="Người mẫu"
            :value="
              h(ShTableCellLink, {
                name: profileHandleName(
                  payment?.model.user.firstname,
                  payment?.model.user.lastname
                ),
                onClick: () =>
                  navigateTo({
                    name: 'data-model-detail',
                    query: { id: payment?.model.id },
                  }),
              })
            "
          />
          <ShInfoItemVer label="Email" :value="payment?.model.user.email || 'Chưa có email'" />
          <ShInfoItemVer
            label="Số điện thoại"
            :value="payment?.model?.phone || 'Chưa có số điện thoại'"
          />
          <a-divider> Lương OT của người mẫu</a-divider>
          <ShInfoItemVer
            label="Lương OT 1h"
            :value="formatNumberPrice(Number(payment?.model?.salary1h)) || '---'"
          />
          <ShInfoItemVer
            label="Lương OT 4h"
            :value="formatNumberPrice(Number(payment?.model?.salary4h)) || '---'"
          />
          <ShInfoItemVer
            label="Lương OT 8h"
            :value="formatNumberPrice(Number(payment?.model?.salary8h)) || '---'"
          />
          <ShInfoItemVer
            label="Lương OT 12h"
            :value="formatNumberPrice(Number(payment?.model?.salary12h)) || '---'"
          />
          <ShInfoItemVer
            label="Lương OT"
            :value="formatNumberPrice(Number(payment?.model?.salaryOvertime)) || '---'"
          />
        </a-card>
        <a-card title="Thông tin ngân hàng">
          <ShInfoItemVer
            label="Tên ngân hàng"
            :value="payment?.model?.bankName || 'Chưa có tên ngân hàng'"
          />
          <ShInfoItemVer
            label="Số tài khoản"
            :value="payment?.model?.bankAccount || 'Chưa có số tài khoản'"
          />
          <ShInfoItemVer
            label="Chi nhánh ngân hàng"
            :value="payment?.model?.bankAddress || 'Chưa có chi nhánh ngân hàng'"
          />
        </a-card>

        <a-card title="Thông tin phí phạt">
          <template #extra>
            <a-button
              :disabled="!isAbleUpdate"
              type="primary"
              @click="() => push({ label: '', value: '' })"
            >
              <template #icon>
                <PlusOutlined />
              </template>
            </a-button>
          </template>
          <p v-if="penaltyFeeFields.length === 0">Không có phí phạt</p>

          <a-form-item
            v-for="(field, index) in penaltyFeeFields"
            :key="field.key"
            :name="`${field}.${index}`"
          >
            <div class="w-full flex flex-row justify-between">
              <p>Phí phạt {{ index + 1 }}</p>
              <a-tooltip title="delete">
                <a-button :disabled="!isAbleUpdate" @click="remove(index)">
                  <template #icon><DeleteOutlined /></template>
                </a-button>
              </a-tooltip>
            </div>
            <div class="h-2"></div>

            <a-input
              :disabled="!isAbleUpdate"
              :name="`${field}.${index}`"
              :default-value="typeof field.value['label'] === `string` ? field.value['label'] : ''"
              placeholder="Lý do"
              @change="(e) => onChangeLabel(e.target.value || '', index)"
            />
            <div class="h-2"></div>

            <a-input-number
              class="w-full"
              :min="1"
              :value="field.value['value']"
              :name="`penaltyFee[${index}].value`"
              placeholder="Tiền phạt"
              :formatter="(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
              :parser="(value) => value.replace(/\$\s?|(,*)/g, '')"
              :disabled="!isAbleUpdate"
              @change="(e) => onChangeValue(e || 0, index)"
            >
              <template #addonAfter>
                <a-select v-bind="currency" :disabled="!isAbleUpdate">
                  <a-select-option value="VND">VND</a-select-option>
                  <a-select-option value="USD">USD</a-select-option>
                </a-select>
              </template>
            </a-input-number>
            <div class="h-6 border-0 border-b-2 border-indigo-500 border-solid"></div>
          </a-form-item>
        </a-card>

        <a-card title="Thông tin Thưởng">
          <template #extra>
            <a-button
              :disabled="!isAbleUpdate"
              type="primary"
              @click="() => pushBonusFees({ label: '', value: '' })"
            >
              <template #icon>
                <PlusOutlined />
              </template>
            </a-button>
          </template>
          <p v-if="bonusFeesFields.length === 0">Không có thưởng</p>

          <a-form-item
            v-for="(field, index) in bonusFeesFields"
            :key="field.key"
            :name="`${field}.${index}`"
          >
            <div class="w-full flex flex-row justify-between">
              <p>Tiền Thưởng {{ index + 1 }}</p>
              <a-tooltip title="delete">
                <a-button :disabled="!isAbleUpdate" @click="removeBonusFees(index)">
                  <template #icon><DeleteOutlined /></template>
                </a-button>
              </a-tooltip>
            </div>
            <div class="h-2"></div>

            <a-input
              :disabled="!isAbleUpdate"
              :value="field.value['label']"
              :name="`bonusFees[${index}].label`"
              placeholder="Lý do"
              @change="(e) => onChangeLabelBonusFees(e.target.value || '', index)"
            />
            <div class="h-2"></div>
            <!-- <a-input
              :value="field.value['value']"
              :name="`bonusFees[${index}].value`"
              placeholder="Tiền Thưởng"
              @change="(e) => onChangeValueBonusFees(e.target.value || '', index)"
            /> -->
            <a-input-number
              :disabled="!isAbleUpdate"
              class="w-full"
              :min="1"
              :value="field.value['value']"
              :name="`bonusFees[${index}].value`"
              placeholder="Tiền Thưởng"
              :formatter="(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
              :parser="(value) => value.replace(/\$\s?|(,*)/g, '')"
              @change="(e) => onChangeValueBonusFees(e || 0, index)"
            >
              <template #addonAfter>
                <a-select v-bind="currency" :disabled="!isAbleUpdate">
                  <a-select-option value="VND">VND</a-select-option>
                  <a-select-option value="USD">USD</a-select-option>
                </a-select>
              </template>
            </a-input-number>
            <div class="h-6 border-0 border-b-2 border-indigo-500 border-solid"></div>
          </a-form-item>
        </a-card>
      </template>
    </ShDashboardFormView>
  </a-form>
</template>
<script setup lang="ts">
import { PlusOutlined } from '@ant-design/icons-vue';
import { Button, message } from 'ant-design-vue';
import type { Route } from 'ant-design-vue/lib/breadcrumb/Breadcrumb';
import { useFieldArray } from 'vee-validate';
import { useMutationCalculateInvoice } from '../../apis';
import {
  CommentsTemplate,
  InvoiceUpdatePaid,
  PaymentStatusTag,
  TableCellPaymentAction,
  WorkingHoursFieldArray,
} from '../../components';
import { UpdatePaidInvoice } from '../../components/templates/update-paid-invoice';
import {
  useDetailPayment,
  useUpdatePaymentForm,
  useUpdatePaymentStatusModal,
} from '../../services';
import type { IPayment } from '../../models';
import { FormatDateTimeEnum, convertTimeAndDateFormat } from '~/common/helpers/time';
import { ANDT_FORM_HELPER } from '~/common/helpers';
import { formatNumberPrice } from '~/common/helpers/number';
import { ShDashboardFormView, ShTableCellLink } from '~/components/organisms';
import { profileHandleName } from '~/features/profile';
import { ShBreadcrumb, ShInfoItemHoz, ShInfoItemVer } from '@/components/moledules';

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
    path: 'data-payment-detail',
    breadcrumbName: 'Chi tiết thanh toán',
  },
];

const { payment, isLoading } = useDetailPayment();

const {
  onResetForm,
  onSubmit,
  defineComponentBinds,
  setFieldValue,
  validateField,
  values,
  errors,
} = useUpdatePaymentForm({
  payment,
});

function handleSubmit(e?: Event | undefined) {
  if (payment.value?.invoiceStatus === 'REJECTED') {
    message.error('Không thể cập nhật hoá đơn bị từ chối');
    return;
  }
  onSubmit(e);
}

const mutationCalculateInvoice = useMutationCalculateInvoice();

const responseCalculateInvoice = computed(() => mutationCalculateInvoice.data?.value?.data);

const renderWorkingHour = computed(() => {
  if (!payment.value?.workingHoursNumber) return '';

  const value = Number(payment.value?.workingHoursNumber || 0);
  return `${value}`;
});

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

const totalMoney = computed(() => {
  const salaryValue = Number(values.salary || 0);
  // const otSalaryValue = Number(values.otSalary || 0);
  // const imageLicenseFee = Number(values.imageLicenseFee || 0);

  const totalPenaltyFee = (values.penaltyFee || []).reduce((acc, cur) => {
    return acc + Number(cur.value || 0);
  }, 0);
  const totalBonusFee = (values.bonusFees || []).reduce((acc, cur) => {
    return acc + Number(cur.value || 0);
  }, 0);

  const total = salaryValue - totalPenaltyFee + totalBonusFee;

  return `${formatNumberPrice(total)} ${values.currency}`.trim();
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

const modelId = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'modelId');
const salary = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'salary');
const currency = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'currency');
const description = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'description');
const workingHours = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'workingHours');
// const otSalary = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'otSalary');
// const imageLicenseFee = ANDT_FORM_HELPER.defineFormItemAndtBinds(
//   defineComponentBinds,
//   'imageLicenseFee'
// );

const paymentTime = payment.value?.workingHours;

const {
  remove,
  push,
  fields: penaltyFeeFields,
  update: updatePenaltyFee,
} = useFieldArray('penaltyFee');

const {
  remove: removeBonusFees,
  push: pushBonusFees,
  fields: bonusFeesFields,
  update: updateBonusFeesFields,
} = useFieldArray('bonusFees');

const onChangeLabel = (value: string, index: number) => {
  // setFieldValue(`penaltyFee.${index}.label`, value);

  const valuesData = penaltyFeeFields.value[index].value as any;

  updatePenaltyFee(index, { label: value, value: valuesData?.value || 0 });
};

const onChangeValue = (value: number, index: number) => {
  const valuesData = penaltyFeeFields.value[index].value as any;

  updatePenaltyFee(index, { label: valuesData?.label || '', value: value || 0 });
};

const onChangeLabelBonusFees = (value: string, index: number) => {
  // setFieldValue(`bonusFees.${index}.label`, value);

  const valuesData = bonusFeesFields.value[index].value as any;
  updateBonusFeesFields(index, { label: value, value: valuesData?.value || 0 });
};

const onChangeValueBonusFees = (value: number, index: number) => {
  // setFieldValue(`bonusFees.${index}.value`, value);

  const valuesData = bonusFeesFields.value[index].value as any;
  updateBonusFeesFields(index, { label: valuesData?.label || '', value: value || 0 });
};

watch(payment, (value) => {
  if (value) onResetForm(value);
});

const { showConfirmReject, showConfirmPay, showConfirmComplete, showConfirmApprove } =
  useUpdatePaymentStatusModal();

const isShowPaid = computed(() => {
  const invoiceStatus = payment.value?.invoiceStatus;

  const showPaidInvoices = [
    'PAID',
    'APPROVED',
    'COMPLETED',
    'WAITING_APPROVED',
  ] as unknown as IPayment['invoiceStatus'];

  return showPaidInvoices.includes(invoiceStatus || '');
});

const isAbleUpdate = computed(
  () =>
    payment.value?.invoiceStatus === 'WAITING_CONFIRM' ||
    payment.value?.invoiceStatus === 'WAITING_APPROVED'
);
</script>
