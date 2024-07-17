<template>
  <a-upload
    list-type="picture-card"
    :before-upload="beforeUpload"
    v-bind="$attrs"
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
import type { UploadFile } from 'ant-design-vue';
import { message } from 'ant-design-vue';
import type { UploadImageProps } from '../models';
defineProps<UploadImageProps>();

const beforeUpload = (file: UploadFile) => {
  const isOverSize = file.size ? file.size > 10_000_000 : false;
  if (isOverSize) {
    message.error(`${file.name} over size 10mb`);
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
