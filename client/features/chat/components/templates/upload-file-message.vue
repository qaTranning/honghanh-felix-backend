<template>
  <div>
    <a-button @click="onOpenUpload">
      <template #icon>
        <CameraOutlined />
      </template>
    </a-button>
    <a-modal v-model:visible="isOpenUpload" title="Upload image" :footer="null"
      ><div class="flex flex-col items-center justify-center">
        <ShUploadImagesVadidate v-model:value="uploadRef" :max-count="1" />

        <a-progress v-if="loading" stroke-linecap="square" :percent="percent" />

        <a-button :loading="loading" @click="handleSendFile">Tải lên</a-button>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { CameraOutlined } from '@ant-design/icons-vue';
import { message, type UploadFile } from 'ant-design-vue';
import { getDownloadURL, ref as refStorage, uploadBytesResumable } from 'firebase/storage';
import type { IMessageModel } from '../../models/chat.model';
import { ANDT_FORM_HELPER, useBoolean } from '~/common';
import { ShUploadImagesVadidate } from '~/components';
import { storage } from '~/firebase';

const props = defineProps<{
  sendMessage: (
    params: Pick<IMessageModel, 'content' | 'message_type'>,
    onSent?: () => void,
    onError?: () => void
  ) => void;
  loadingSend: boolean;
}>();

const uploadRef = ref<UploadFile[]>([]);
const percent = ref(0);

const loading = ref(false);

const [isOpenUpload, { setTrue: onOpenUpload, setFalse: onCloseUpload }] = useBoolean();

watch(isOpenUpload, (v) => {
  if (!v) {
    uploadRef.value = [];
    percent.value = 0;
  }
});

async function handleSendFile() {
  if (!uploadRef.value.length) return;

  const file = uploadRef.value[0];

  const { uploadImage: fileUpload } = ANDT_FORM_HELPER.handleImageForApi({
    listImageForm: uploadRef.value,
  });

  const storageRef = refStorage(storage, `${file.name}-${Date.now()}`);
  const uploadTask = uploadBytesResumable(storageRef, fileUpload as unknown as File);

  uploadTask.on(
    'state_changed',
    (snapshot) => {
      loading.value = true;
      const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
      percent.value = progress;
    },
    (error) => {
      message.error(error.message);
    },
    async () => {
      const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

      function onSent() {
        uploadRef.value = [];
        onCloseUpload();
      }

      props.sendMessage(
        {
          content: downloadURL,
          message_type: 'IMAGE',
        },
        onSent
      );
      loading.value = false;
    }
  );
}
</script>
