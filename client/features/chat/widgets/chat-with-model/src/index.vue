<template>
  <ShDashboardFormView>
    <template #main>
      <a-card title="Nội dung">
        <template #extra>
          <a-button @click="getMessages">
            <template #icon>
              <CloudDownloadOutlined />
            </template>
            Tải dữ liệu
          </a-button>
        </template>
        <MessageChat :messages="messages" />
      </a-card>
    </template>

    <template #side>
      <a-card title="Trao đổi">
        <a-textarea
          v-model:value.lazy="msgContent"
          placeholder="Nhập nội dung trao đổi"
          :rows="5"
        />
        <div class="h-4"></div>
        <div class="flex justify-between items-center">
          <a-button @click="onSentTextMess">Gửi</a-button>

          <UploadFileMessage :sendMessage="onSentImage" :loadingSend="isLoadingSendMsg" />
        </div>
      </a-card>
    </template>
  </ShDashboardFormView>

  <!-- <a-modal
    v-model:visible="openUpload"
    title="Gửi ảnh"
    :confirm-loading="false"
    @ok="addNewMessageImage"
  >
    <ShUploadImagesVadidate v-model:value="upload" :max-count="1" />
  </a-modal> -->
</template>

<script setup lang="ts">
import { MessageChat } from '../templates/message-chat';
import { ShDashboardFormView } from '~/components/organisms';
import { UploadFileMessage } from '~/features/chat/components/templates';
import type { ChatMessageModel } from '~/features/chat/models/chat.model';
import { useAdminChatModelOnly } from '~/features/chat/services';
const msgContent = ref<string>('');
interface Props {
  modelId: number;
}
const { modelId } = defineProps<Props>();

const isLoadingSendMsg = ref(false);

const { addNewMessage, messages, getMessages } = useAdminChatModelOnly({
  modelId,
});

async function onSentTextMess() {
  if (!msgContent.value.trim()) {
    return;
  }

  isLoadingSendMsg.value = true;
  try {
    await addNewMessage({ content: msgContent.value.trim() });
  } catch (error) {
  } finally {
    msgContent.value = '';
    isLoadingSendMsg.value = false;
  }
}

async function onSentImage(
  params: Pick<ChatMessageModel, 'content' | 'type'>,
  onSent: () => void = () => {},
  onError: () => void = () => {}
) {
  isLoadingSendMsg.value = true;
  try {
    await addNewMessage({
      content: params.content,
      type: params?.type || 'IMAGE',
    });
    onSent();
  } catch (error) {
    onError();
  } finally {
    isLoadingSendMsg.value = false;
  }
}
</script>
