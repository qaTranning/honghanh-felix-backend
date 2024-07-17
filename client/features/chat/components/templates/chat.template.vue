<template>
  <ShDashboardFormView :loading="isAllLoading">
    <template #main>
      <div class="flex flex-row h-[80vh] space-x-5 overflow-hidden">
        <div class="shrink-0 bg-white h-full basis-1/4 min-w-[260px] max-w-[500px]">
          <div class="flex flex-col space-y-2 px-2.5 py-2 h-full overflow-auto">
            <div
              v-for="(item, index) in listConversation"
              :key="item.id + index"
              :class="`flex space-x-2 px-3 py-1 min-h-[71px] hover:bg-[#f6f6f6] cursor-pointer border-b border-transparent border-b-gray-200 border-solid ${
                item.model_id === chatModelId ? 'bg-[#e5effa]' : 'bg-[#fff]'
              }`"
              @click="() => handleClickConversation(item)"
            >
              <div class="shrink-0">
                <AppAvatar :src="item.avatar" />
              </div>
              <div class="flex flex-col flex-1">
                <div class="flex items-center justify-between">
                  <a-typography-title
                    :level="5"
                    :ellipsis="true"
                    :content="item.name"
                  ></a-typography-title>
                  <a-typography-paragraph style="font-size: small">{{
                    TIME_HELPER.formatDate({
                      date: dayjs(item.created_at.toDate()),
                      format: 'hh:mm',
                    })
                  }}</a-typography-paragraph>
                </div>
                <a-typography-paragraph
                  v-if="item.type === 'TEXT'"
                  :ellipsis="true"
                  :content="item.content"
                  class="max-w-[170px] text-sm"
                ></a-typography-paragraph>
              </div>
            </div>
          </div>
        </div>

        <div v-if="!!chatModelId && !!dataModel" class="flex-1 min-h-0 h-full overflow-hidden">
          <MessagesTemplate
            :messages="listMessages"
            :model="dataModel"
            :send-message="handleSendMessage"
            :loadingSend="isLoadingSendMsg"
          />
        </div>

        <div v-else class="flex items-center justify-center flex-1">
          Select model to start conversation
        </div>
      </div>
    </template>
  </ShDashboardFormView>
</template>
<script setup lang="ts">
import dayjs from 'dayjs';
import { useChat } from '../../hooks';
import type { ChatMessageModel } from '../../models/chat.model';

import { MessagesTemplate } from '.';
import { ShDashboardFormView } from '~/components';
import { profileHandleName } from '~/features/profile';
import { AppAvatar } from '@/components/atoms';
import { TIME_HELPER } from '~/common';
import { useGetDetailModelQuery } from '~/features/model/apis';
import { useGetUsersByIdsQuery } from '~/features/user/apis/get-users-by-ids';
import { getUrlImageLow } from '~/common/helpers/image';

const { messages, sendMessage, isLoadingSendMsg } = useChat();

function handleSendMessage(
  params: Pick<ChatMessageModel, 'content' | 'type'>,
  onSent: () => void = () => {},
  onError: () => void = () => {}
) {
  if (!chatModelId.value) return;

  const data = {
    content: params.content,
    type: params?.type || 'TEXT',
    model_id: chatModelId.value,
  };

  sendMessage(data, onSent, onError);
}

const chatModelId = ref<number | null>(null);

const listModelIds = ref<number[]>([]);

const queryUsersByIds = useGetUsersByIdsQuery({
  listIds: listModelIds,
});

const listModels = computed(() => queryUsersByIds.data.value?.data || []);

const { currentModelId, query: queryModel } = useGetDetailModelQuery();

const dataModel = computed(() => queryModel.data.value?.data);

const isAllLoading = computed(() => {
  return queryModel.isLoading.value || queryUsersByIds.isLoading.value;
});

watch(chatModelId, () => {
  if (chatModelId.value !== currentModelId.value) {
    currentModelId.value = chatModelId.value;
  }
});

const listMessages = computed(() => {
  return messages.value
    .filter((item) => item.model_id === chatModelId.value)
    .map((item) => {
      const isModel = item.sender_id === chatModelId.value;

      return {
        ...item,
        isModel,
      } as ChatMessageModel & {
        isModel: boolean;
      };
    });
});

function handleClickConversation(item: ChatMessageModel) {
  chatModelId.value = item.model_id;
}

const listConversation = computed(() => {
  const groupByModelId = messages.value.reduce<Record<number, ChatMessageModel[]>>(
    (acc, cur: ChatMessageModel) => {
      const modelId = cur.model_id;
      if (!acc[modelId]) {
        acc[modelId] = [];
      }
      acc[modelId].push(cur);
      return acc;
    },
    {}
  );

  listModelIds.value = Object.keys(groupByModelId).map((item) => Number(item));

  return Object.values(groupByModelId)
    .map((item) => {
      const lastMessage = item[item.length - 1];

      const currentModel = listModels.value.find((model) => model.id === lastMessage.model_id);

      const isModel = lastMessage.model_id !== chatModelId.value;

      const name = profileHandleName(currentModel?.firstname || '', currentModel?.lastname || '');
      const avatar = getUrlImageLow(currentModel?.avatar);

      return {
        ...lastMessage,
        name,
        avatar,

        isModel,
      };
    })
    .slice()
    .sort((a, b) => {
      return dayjs(b.created_at.toDate()).unix() - dayjs(a.created_at.toDate()).unix();
    });
});
</script>
