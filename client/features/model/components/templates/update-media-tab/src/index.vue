<template>
  <a-form :label-col="{ style: { width: '100px', textAlign: 'start' } }" @submit="onSubmit">
    <ShDashboardFormView :loading="form.isLoading.value"
      >>
      <template #header>
        <div class="flex justify-end space-x-2">
          <a-button @click="() => navigateTo({ name: 'data-model' })">Huỷ</a-button>

          <a-button type="primary" html-type="submit">Lưu</a-button>
        </div>
      </template>
      <template #main>
        <a-card title="Ảnh 360">
          <a-form-item label="Ảnh 360" v-bind="image360">
            <ShUploadImages v-bind="image360" />
          </a-form-item>
        </a-card>
        <a-card title="Video">
          <p v-if="fields.length === 0">Không có video</p>

          <a-form-item
            v-for="(field, index) in fields"
            :key="index"
            :name="`${field}.${index}`"
            :help="errors[`value[${index}]` as any] ? `Required` : undefined"
            :validate-status="errors[`value[${index}]` as any] ? `error` : undefined"
          >
            <a-input-group compact>
              <a-input
                style="width: calc(100% - 50px)"
                :name="`${field}.${index}`"
                :value="typeof field.value === `string` ? field.value : ''"
                placeholder="Đường dẫn video"
                @change="(e) => onChange(e.target.value || '', index)"
              />
              <a-tooltip title="delete">
                <a-button @click="remove(index)">
                  <template #icon><DeleteOutlined /></template>
                </a-button>
              </a-tooltip>
            </a-input-group>
          </a-form-item>

          <template #extra>
            <a-button type="primary" @click="push('')">
              <template #icon><PlusOutlined /></template>
              Thêm video
            </a-button>
          </template>
        </a-card>
      </template>
      <template #side>
        <a-card v-if="resultModel?.image360" title="Xem trước ảnh 360">
          <ShViewer360 :image="IMAGE_HELPER.getUrlImageLow(resultModel?.image360)" />
        </a-card>
      </template>
    </ShDashboardFormView>
  </a-form>
</template>

<script setup lang="ts">
import { DeleteOutlined, DeleteFilled, PlusOutlined } from '@ant-design/icons-vue';
import { useFieldArray } from 'vee-validate';
import { ANDT_FORM_HELPER, IMAGE_HELPER } from '~/common';
import { ShUploadImages } from '~/components/moledules';
import { ShDashboardFormView } from '~/components/organisms';
import type { UseUpdateFormMediaType } from '~/features/model/services';
import { ShViewer360 } from '~/widgets';

const props = defineProps<{ form: UseUpdateFormMediaType }>();

const { form } = props;
const { setFieldValue, errors, onSubmit, defineComponentBinds, resultModel } = form;

const image360 = ANDT_FORM_HELPER.defineFormItemAndtBinds(
  defineComponentBinds,
  'image360',
  'file-list'
);
const { remove, push, fields } = useFieldArray('video');

const onChange = (value: string, index: number) => {
  setFieldValue(`video.${index}`, value);
};
</script>
