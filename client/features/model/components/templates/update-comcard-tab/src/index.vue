<template>
  <a-spin :spinning="isFetchingModel">
    <a-form layout="vertical">
      <ShDashboardFormView>
        <template #header>
          <div class="flex justify-end space-x-3">
            <a-button
              type="primary"
              :disabled="
                isLoadingDownloadComcard ||
                createComcardMutation.isPending.value ||
                isLoadingPreviewComcard
              "
              @click="() => showPromiseConfirmCreateComcard(values)"
              >Tạo comcard</a-button
            >
            <a-button
              :loading="isLoadingPreviewComcard"
              :disabled="
                !hasComcard ||
                isLoadingDownloadComcard ||
                createComcardMutation.isPending.value ||
                isLoadingPreviewComcard
              "
              @click="onWatchAgainComcard"
            >
              Xem lại comcard
            </a-button>
            <a ref="refDownload" :hidden="true" :href="urlDownload" download target="_blank"></a>
          </div>
        </template>
        <template #main>
          <div class="flex flex-col space-y-3">
            <a-card title="Thông tin">
              <ShInfoItemHoz
                label="Họ và tên"
                :value="profileHandleName(values.firstname || '', values.lastname || '')"
              />

              <ShInfoItemHoz label="Ngày sinh" :value="values.dob" />

              <ShInfoItemHoz label="Cân nặng" :value="convertWeight(values.weight)" />

              <ShInfoItemHoz label="Chiều cao" :value="convertCm(values.height)" />
              <ShInfoItemHoz label="Số đo vòng 1" :value="convertCm(values.bust)" />
              <ShInfoItemHoz label="Số đo vòng 2" :value="convertCm(values.waist)" />
              <ShInfoItemHoz label="Số đo vòng 3" :value="convertCm(values.hips)" />
            </a-card>
          </div>

          <a-card title="Thư viện ảnh mẫu">
            <a-row :wrap="true">
              <a-col v-for="image in galleryList" :key="image.id" :span="8">
                <div class="relative">
                  <ShImage
                    class="aspect-square cursor-pointer object-cover"
                    :src="IMAGE_HELPER.getUrlImageLow(image.image)"
                    :preview="false"
                    @click="() => onSelectImage(value as any, image)"
                  />
                  <div
                    v-if="!!values.images?.find((item) => item.id === image.id)"
                    class="absolute top-2 right-2"
                  >
                    <CheckCircleOutlined :style="{ fontSize: '16px', color: '#08c' }" />
                  </div>
                </div>
              </a-col>
            </a-row>
            <a-empty v-if="galleryList.length === 0" />
          </a-card>

          <a-modal
            v-model:visible="openModal"
            width="1000px"
            :centered="true"
            :footer="null"
            @cancel="setFalse"
          >
            <!-- eslint-disable-next-line vue/no-v-html -->
            <div v-html="queryQueryPreviewComcard.data.value"></div>
          </a-modal>
        </template>

        <template #side>
          <a-card title="Ảnh tạo comcard">
            <a-table
              :scroll="{ y: 300 }"
              :pagination="false"
              :row-key="'id'"
              :columns="gelleryColumns"
              :data-source="values.images || []"
            >
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'action'">
                  <div class="flex flex-col space-y-2 justify-center items-center">
                    <a-button
                      :disabled="values?.images && values.images[0]?.id === record.id"
                      @click="() => onChangePositionImage(value as any, record, true)"
                    >
                      <template #icon><CaretUpOutlined /></template>
                    </a-button>

                    <a-button
                      :disabled="
                        values?.images && values.images[values.images.length - 1]?.id === record.id
                      "
                      @click="() => onChangePositionImage(value as any, record)"
                    >
                      <template #icon><CaretDownOutlined /></template>
                    </a-button>
                  </div>
                </template>

                <template v-if="column.key === 'image'">
                  <ShImage
                    class="aspect-square cursor-pointer object-cover"
                    :src="IMAGE_HELPER.getUrlImageLow(record.image)"
                  />
                </template>
              </template>
            </a-table>
          </a-card>
        </template>
      </ShDashboardFormView>
    </a-form>

    <a-modal
      v-model:visible="openModal"
      width="1200px"
      :centered="true"
      :destroyOnClose="true"
      cancel-text="Đóng"
      ok-text="Tải về"
      :ok-button-props="{
        loading: isLoadingDownloadComcard,
      }"
      @ok="onDownloadComcard"
      @cancel="setFalse"
    >
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div v-html="queryQueryPreviewComcard.data.value"></div>
    </a-modal>
  </a-spin>
</template>

<script setup lang="ts">
import { Modal, type TableColumnsType } from 'ant-design-vue';
import { createVNode } from 'vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { useField } from 'vee-validate';
import { isEmpty } from 'lodash';
import { ShDashboardFormView, ShInfoItemHoz, ShImage } from '@/components';
import {
  useDownloadComcardService,
  usePreviewComcardService,
  type UseUpdateFormComcardType,
} from '@/features/model/services';
import { useBoolean } from '~/common';
import { ANDT_FORM_HELPER, IMAGE_HELPER } from '~/common/helpers';
import { useRouteQuery } from '~/common/hooks/route-query';
import { profileHandleName } from '~/features/profile';
import { useCreateComcardMutation, useDetailComcardQuery } from '~/features/model/apis/comcard';

const props = defineProps<{ form: UseUpdateFormComcardType }>();
const { form } = props;
const {
  defineComponentBinds,
  currentModelId,
  handleSubmit,
  data: resultModel,
  values,
  isFetching: isFetchingModel,
} = form;

const { value } = useField('images');

const refDownload = ref<HTMLAnchorElement | null>(null);

onMounted(() => {
  currentModelId.value = Number(useRouteQuery('id').value);
});

const createComcardMutation = useCreateComcardMutation();

const queryDetailComcard = useDetailComcardQuery({
  modelId: currentModelId as any,
});
const hasComcard = computed(
  () => !!queryDetailComcard.isSuccess && !isEmpty(queryDetailComcard.data.value?.data)
);

const [openModal, { setFalse, setTrue }] = useBoolean();
const { handlePreviewComcard, queryQueryPreviewComcard } = usePreviewComcardService();
const { isFetching: isLoadingPreviewComcard } = queryQueryPreviewComcard;

const { queryQueryDownloadComcard, handleDownloadComcard } = useDownloadComcardService();
const { data: dataDownloadComcard, isFetching: isLoadingDownloadComcard } =
  queryQueryDownloadComcard;
const urlDownload = computed(() => dataDownloadComcard.value?.url || '');

function convertBody(values: UseUpdateFormComcardType['values']) {
  return {
    birth: values.dob || '',
    first_name: values.firstname || '',

    last_name: values.lastname || '',
    height: String(values.height || 0),
    weight: String(values.weight || 0),
    measurement: `${values.bust || 0}-${values.waist || 0}-${values.hips || 0}`,

    shirt: String(values.shirtSize || 0),
    shoes: String(values.shoesSize || 0),
    images: values.images?.map((item) => IMAGE_HELPER.getUrlImageLow(item.image)) || [],
  };
}

async function onCreateComcard() {
  return await handleSubmit((values) => {
    if (!currentModelId.value) return;

    createComcardMutation.mutate(
      {
        body: convertBody(values),
        params: {
          id: currentModelId.value,
        },
      },
      {
        async onSuccess() {
          await queryDetailComcard.refetch();
          await onPreviewComcard();
        },
      }
    );
  })();
}

async function onPreviewComcard() {
  if (!currentModelId.value) return;
  await handlePreviewComcard(currentModelId.value, setTrue);
}

async function onWatchAgainComcard() {
  if (!currentModelId.value) return;
  await handlePreviewComcard(currentModelId.value, setTrue);
}

async function onDownloadComcard() {
  if (!currentModelId.value) return;
  await handleDownloadComcard(currentModelId.value, () => {
    setFalse();
    refDownload.value?.click();
  });
}

const images = ANDT_FORM_HELPER.defineFormItemAndtBinds(defineComponentBinds, 'images');
const { t } = useI18n();

const galleryList = computed(() => resultModel.value?.data.model?.modelImages || []);

const gelleryColumns: TableColumnsType<{ id: number; image: string }> = [
  {
    dataIndex: 'action',
    key: 'action',
    width: 100,
  },
  {
    title: t('field.image'),
    dataIndex: 'image',
    key: 'image',
  },
];
function convertWeight(value?: any) {
  if (!value) {
    return '--- kg';
  }
  return value.toString() + ' kg';
}

function convertCm(value?: any) {
  if (!value) {
    return '--- cm';
  }
  return value.toString() + ' cm';
}

// create comcard

function showPromiseConfirmCreateComcard(value: UseUpdateFormComcardType['values']) {
  const isOkInfo =
    value.firstname &&
    value.lastname &&
    value.dob &&
    value.bust &&
    value.height &&
    value.hips &&
    value.waist &&
    value.weight;

  const isOkImage = value.images?.length === 5;

  const contentInfo = !isOkInfo
    ? 'Người mẫu thiếu thông tin, bạn hãy cập nhật thông tin để tạo được danh thiếp'
    : '';

  const contentImage = !isOkImage
    ? 'Cần chọn 5 bức ảnh, bạn hãy chọn thêm ảnh để tạo được danh thiếp'
    : '';

  const contentCreate = 'Nếu bạn ấn nút OK, hệ thống sẽ tạo danh thiếp mới cho người mẫu này!';

  Modal.confirm({
    title: 'Bạn muốn tạo danh thiếp cho người mẫu này?',
    icon: createVNode(ExclamationCircleOutlined),
    content: contentInfo || contentImage || contentCreate,
    async onOk() {
      try {
        if (isOkImage && isOkInfo) {
          return await onCreateComcard();
        }
      } catch {
        return console.log('Oops errors!');
      }
    },
    onCancel() {},
    okButtonProps: { disabled: !isOkInfo || !isOkImage },
  });
}

function onSelectImage(
  imageList: { id: number; image: string }[],
  image: { id: number; image: string }
) {
  // clone
  const cloneImaList = [...imageList];
  // check has
  const isHas = imageList.find((item) => item.id === image.id);

  if (!isHas && imageList.length >= 5) {
    return;
  }

  if (isHas) {
    value.value = cloneImaList.filter((item) => item.id !== image.id);
  } else {
    cloneImaList.push(image);

    value.value = [...cloneImaList.concat()];
  }
}

function onChangePositionImage(
  imageList: { id: number; image: string }[],
  image: { id: number; image: string },
  isUp?: boolean
) {
  if (!imageList || imageList.length <= 1) {
    return;
  }

  const findIndex = imageList.findIndex((item) => item.id === image.id);
  // check up
  if (isUp && findIndex === 0) {
    return;
  }

  // check down
  if (!isUp && findIndex === imageList.length - 1) {
    return;
  }

  const cloneListImage = [...imageList];

  if (!isUp) {
    // down
    const swapIndex = findIndex + 1;

    const temp = cloneListImage[findIndex];
    cloneListImage[findIndex] = cloneListImage[swapIndex];

    cloneListImage[swapIndex] = temp;

    value.value = [...cloneListImage];
  }

  if (isUp) {
    // down
    const swapIndex = findIndex - 1;

    const temp = cloneListImage[findIndex];
    cloneListImage[findIndex] = cloneListImage[swapIndex];

    cloneListImage[swapIndex] = temp;

    value.value = [...cloneListImage];
  }
}
</script>
