<template>
  <a-upload
    v-bind="$attrs"
    :file-list="value"
    list-type="picture-card"
    :before-upload="beforeUpload"
    :on-change="onChange"
    @preview="handlePreview"
  >
    <div v-if="($props?.fileList?.length || 0) < 8">
      <plus-outlined />
      <div style="margin-top: 8px">Upload</div>
    </div>
  </a-upload>
  <a-modal :open="previewVisible" :title="previewTitle" :footer="null" @cancel="handleCancel">
    <img alt="example" style="width: 100%" :src="previewImage" />
  </a-modal>
</template>
<script lang="ts" setup>
import { PlusOutlined } from '@ant-design/icons-vue';
import { ref } from 'vue';
import type { UploadChangeParam, UploadFile } from 'ant-design-vue';
import { message } from 'ant-design-vue';
import type { UploadImageVadidateProps, UploadImageVadidateEmits } from '../models';
import { FILE_TYPE_IMAGES } from '~/common/constants';
const props = defineProps<UploadImageVadidateProps>();
const emits = defineEmits<UploadImageVadidateEmits>();

const value = ref<UploadImageVadidateProps['fileList']>(props.value);

function onChange(info: UploadChangeParam<UploadFile<any>>) {
  const fileList = info.fileList;
  const newValue =
    fileList?.filter((item) => item.originFileObj?.size && item.originFileObj.size < 10_000_000) ||
    [];
  value.value = newValue;
  emits('update:value', newValue);
}

watch(
  () => props.value,
  (fileList) => {
    if (value.value !== fileList) {
      value.value = fileList;
    }
  }
);

const beforeUpload = (file: UploadFile) => {
  const isOverSize = file.size ? file.size > 10_000_000 : false;
  if (isOverSize) {
    message.error(`${file.name} over size 10mb`);
    return true;
  }

  const isValidFileType = FILE_TYPE_IMAGES.includes(file.type?.split('/')[1] || '');

  if (!isValidFileType) {
    message.error(`${file.name} is not a valid. Accept: ${FILE_TYPE_IMAGES.join(', ')}`);
    return true;
  }

  message.success(`${file.name} file uploaded successfully.`);
  return false;
};

function getBase64(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

const previewVisible = ref(false);
const previewImage = ref('');
const previewTitle = ref('');

const handleCancel = () => {
  previewVisible.value = false;
  previewTitle.value = '';
};
const handlePreview = async (file: UploadFile<any>) => {
  if (!file.url && !file.preview && file.originFileObj) {
    file.preview = (await getBase64(file.originFileObj)) as string;
  }
  previewImage.value = file.url || file.preview || '';
  previewVisible.value = true;
  previewTitle.value = file.name || file.url?.substring(file.url.lastIndexOf('/') + 1) || '';
};
</script>
<style scoped>
/* you can make up upload button and sample style by using stylesheets */
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>
