<template>
  <div className="flex-grow h-full flex flex-col">
    <div
      className="w-full h-15 p-1 bg-purple-600 shadow-md rounded-xl rounded-bl-none rounded-br-none"
    >
      <div className="flex p-2 align-middle items-center">
        <div className="p-2 md:hidden rounded-full mr-1 hover:bg-purple-500 text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="{2}"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
        </div>
        <div className="border rounded-full border-white p-1/2">
          <AppAvatar :src="avatarModel" size="large" />
        </div>
        <div className="flex-grow p-2">
          <div className="text-md text-gray-50 font-semibold">{{ fullNameModel }}</div>
          <!-- <div className="flex items-center">
            <div className="w-2 h-2 bg-green-300 rounded-full"></div>
            <div className="text-xs text-gray-50 ml-1">Online</div>
          </div> -->
        </div>
        <div className="p-2 text-white cursor-pointer hover:bg-purple-500 rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="{2}"
              d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
            />
          </svg>
        </div>
      </div>
    </div>
    <div ref="wrapperMessageRef" className="w-full flex-grow bg-gray-100 my-2 p-2 overflow-y-auto">
      <MessageItem
        v-for="(message, index) in messages"
        :key="index"
        :content="message.content"
        :created_at="message.created_at"
        :isModel="message.isModel"
        :type="message.type"
        :group_type="message.group_type"
      />
    </div>
    <div className="h-15 p-2 rounded-xl rounded-tr-none rounded-tl-none bg-gray-100">
      <div className="flex flex-grow space-x-2 p-2">
        <a-textarea
          v-model:value="textMessage"
          placeholder="Enter message"
          :auto-size="{ minRows: 2, maxRows: 4 }"
          :readonly="loadingSend"
          @press-enter="handleSendMessage"
        />

        <div class="flex flex-col space-y-2">
          <a-button type="ghost" :loading="loadingSend" @click="handleSendMessage">
            <template #icon>
              <SendOutlined />
            </template>
          </a-button>
          <UploadFileMessage :sendMessage="$props.sendMessage" :loadingSend="$props.loadingSend" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CameraOutlined, SendOutlined } from '@ant-design/icons-vue';
import type { ChatMessageModel } from '../../models/chat.model';
import { MessageItem } from '../molecules';
import { UploadFileMessage } from '.';
import { ShUploadImagesVadidate } from '~/components';
import { AppAvatar } from '~/components/atoms';
import { profileHandleName } from '~/features/profile';
import type { IUser } from '~/features/user/models';
import { IMAGE_HELPER } from '~/common';

const props = defineProps<{
  messages: (ChatMessageModel & { isModel: boolean })[];
  model: IUser;
  sendMessage: (
    params: Pick<ChatMessageModel, 'content' | 'type'>,
    onSent?: () => void,
    onError?: () => void
  ) => void;
  loadingSend: boolean;
}>();

const { messages, model } = toRefs(props);

const textMessage = ref('');

const wrapperMessageRef = ref<HTMLDivElement | null>(null);

const handleScrollToBottom = () => {
  if (wrapperMessageRef.value) {
    wrapperMessageRef.value.scrollTop = wrapperMessageRef.value.scrollHeight * 1000;
  }
};

watch(
  () => messages.value,
  async () => {
    await nextTick(() => {
      handleScrollToBottom();
    });
  },
  { immediate: true }
);

const handleSendMessage = () => {
  if (textMessage.value) {
    props.sendMessage({ content: textMessage.value, type: 'TEXT' });
    textMessage.value = '';
  }
};

const fullNameModel = computed(() => {
  return profileHandleName(model.value?.firstname, model.value?.lastname as string);
});

const avatarModel = computed(() => {
  return IMAGE_HELPER.getUrlImageLow(model.value?.avatar);
});
</script>
