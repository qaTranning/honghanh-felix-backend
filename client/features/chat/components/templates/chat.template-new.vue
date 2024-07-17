<template>
  <ShDashboardFormView :loading="isAllLoading">
    <template #main>
      <div class="flex flex-row h-[80vh] space-x-5 overflow-hidden">
        <div class="shrink-0 bg-white h-full basis-1/4 min-w-[300px] max-w-[500px]">
          <div class="px-2.5 py-2 flex items-center space-x-3">
            <a-input-search
              placeholder="Tìm kiếm người mẫu"
              :allowClear="true"
              @change="(e) => onSearchModel(e.target.value?.trim() || '')"
            />
            <a-button
              type="primary"
              class="shrink-0"
              :icon="h(PlusOutlined)"
              @click="showModalCreateChatRoom"
            ></a-button>
            <a-modal
              title="Tạo cuộc trò chuyện với người mẫu"
              :centered="true"
              :visible="isShowModalCreateChatRoom"
              cancelText="Huỷ"
              okText="Tạo"
              @cancel="
                () => {
                  hideModalCreateChatRoom();
                  chatModelId = undefined;
                }
              "
              @ok="handleCreateChatRoom"
            >
              <SelectUser
                userRole="MODEL"
                :placeholder="'Chọn người mẫu'"
                :value="chatModelId"
                :required="true"
                :label="'Người mẫu'"
                @update:value="($event) => (chatModelId = $event as LabeledValue)"
              />
            </a-modal>
          </div>
          <div class="flex flex-col space-y-2 px-2.5 py-2 h-full overflow-auto">
            <template v-if="listConversationsFiltered.length > 0">
              <div
                v-for="(conversation, index) in listConversationsFiltered"
                :key="conversation.id + index"
                :class="`flex space-x-2 px-3 py-1 min-h-[71px] hover:bg-[#f6f6f6] cursor-pointer border-b border-transparent border-b-gray-200 border-solid ${
                  dataModel?.id === conversation.model_id ? 'bg-[#e5effa]' : 'bg-[#fff]'
                }`"
                @click="() => handleClickConversation(conversation)"
              >
                <div class="shrink-0">
                  <AppAvatar :src="conversation.model.avatar" />
                </div>
                <div class="flex flex-col flex-1">
                  <div class="flex conversations-center justify-between">
                    <div class="flex items-center">
                      <a-typography-title
                        :level="5"
                        :ellipsis="true"
                        :content="conversation.model.name"
                      ></a-typography-title>
                      <a-badge
                        v-if="conversation.totalUnseenMessages > 0"
                        :count="conversation.totalUnseenMessages"
                        class="ml-2"
                      ></a-badge>
                    </div>
                    <a-typography-paragraph style="font-size: small">{{
                      TIME_HELPER.formatDate({
                        date: dayjs(new Date(conversation.last_message_at.toDate())),
                        format: 'HH:mm',
                      })
                    }}</a-typography-paragraph>
                  </div>
                  <a-typography-paragraph
                    v-if="conversation.lastMessage?.message_type === 'TEXT'"
                    :ellipsis="true"
                    :content="conversation.lastMessage?.content"
                    class="max-w-[170px] text-sm"
                  ></a-typography-paragraph>
                  <a-typography-paragraph
                    v-else-if="
                      conversation.lastMessage?.message_type === 'IMAGE' ||
                      conversation.lastMessage?.message_type === 'VIDEO'
                    "
                    :ellipsis="true"
                    :content="
                      conversation.lastMessage.isModel
                        ? conversation.model.name + ' đã gửi file đính kèm'
                        : 'Bạn đã gửi file đính kèm'
                    "
                    class="max-w-[170px] text-sm"
                  />
                </div>
              </div>
            </template>
            <template v-else>
              <div class="flex items-center justify-center">
                <a-empty description="Không có cuộc trò chuyện nào" />
              </div>
            </template>
          </div>
        </div>

        <div v-if="isShowMessages" class="flex-1 min-w-[400px] min-h-0 h-full overflow-hidden">
          <MessagesTemplateNew
            :messages="listMessages"
            :model="dataModel as any"
            :sendMessage="handleSendMessage"
            :loadingSend="isLoadingSendMsg"
          />
        </div>

        <div v-else class="flex items-center justify-center flex-1">
          Chọn người mẫu để bắt đầu trò chuyện
        </div>
      </div>
    </template>
  </ShDashboardFormView>
</template>
<script setup lang="ts">
import dayjs from 'dayjs';
import { PlusOutlined } from '@ant-design/icons-vue';
import { notification } from 'ant-design-vue';
import type { LabeledValue } from 'ant-design-vue/lib/select';
import { useChatMessages } from '../../hooks';
import type { IMessageModel, IChatRoomModel } from '../../models/chat.model';

import { MessagesTemplateNew } from '.';
import { ShDashboardFormView } from '~/components';
import { profileHandleName } from '~/features/profile';
import { AppAvatar } from '@/components/atoms';
import { TIME_HELPER, useBoolean, useString } from '~/common';
import { useGetDetailModelQuery } from '~/features/model/apis';
import { useGetUsersByIdsQuery } from '~/features/user/apis/get-users-by-ids';
import { getUrlImageLow } from '~/common/helpers/image';
import { SelectUser } from '~/features/user/widgets';

const {
  messages,
  sendMessage,
  isLoadingSendMsg,
  chatRooms,
  currentChatRoom,
  addNewChatRoom,
  queryDetailModel: { query: queryModel, currentModelId },
} = useChatMessages();

const [
  isShowModalCreateChatRoom,
  { setTrue: showModalCreateChatRoom, setFalse: hideModalCreateChatRoom },
] = useBoolean();

function handleSendMessage(
  params: Pick<IMessageModel, 'content' | 'message_type'>,
  onSent: () => void = () => {},
  onError: () => void = () => {}
) {
  if (!currentChatRoom.value?.id) return;

  const msg = {
    content: params.content,
    message_type: params?.message_type || 'TEXT',
  };

  sendMessage({
    variables: {
      chat_room: { id: currentChatRoom.value?.id, model_id: currentChatRoom.value?.model_id },
      message: msg,
    },
    onSendError: () => {
      onError();
    },
    onSendSuccess: () => {
      onSent();
    },
  });
}

const chatModelId = ref<LabeledValue | undefined>(undefined);

const [searchModel, { onChangeDebounce: handleSearchModel }] = useString();

function onSearchModel(value: string) {
  handleSearchModel(value);
}

const listModelIds = ref<number[]>([]);

const queryUsersByIds = useGetUsersByIdsQuery({
  listIds: listModelIds,
});

const listModels = computed(() => queryUsersByIds.data.value?.data || []);

const listModelFiltered = computed(() => {
  if (!searchModel.value) return listModels.value;

  return listModels.value.filter((model) => {
    const fullName = removeAccents(
      profileHandleName(model.firstname, model.lastname).toLowerCase()
    );
    const search = removeAccents(searchModel.value.toLowerCase());
    return fullName.includes(search);
  });
});

const dataModel = computed(() => queryModel.data.value?.data);

const isAllLoading = computed(() => {
  return queryModel.isLoading.value || queryUsersByIds.isLoading.value;
});

watch(currentChatRoom, (v) => {
  const modelId = v?.model_id ?? null;
  if (modelId !== currentModelId.value) {
    currentModelId.value = modelId;
  }
});

const isShowMessages = computed(() => {
  const hasChatRoom = !!currentChatRoom.value;

  const hasModel = !!dataModel.value;

  return hasChatRoom && hasModel;
});
const listMessages = computed(() => {
  return messages.value;
});

function handleClickConversation(item: IChatRoomModel) {
  console.log('item: ', item);
  currentChatRoom.value = item;
}

async function handleCreateChatRoom() {
  if (!chatModelId.value) {
    return notification.error({ message: 'Chưa chọn người mẫu' });
  }

  const modelId = chatModelId.value.value as number;

  const isExist = chatRooms.value.some((item) => item.model_id === modelId);

  if (isExist) {
    return notification.error({ message: 'Cuộc trò chuyện đã tồn tại' });
  }

  function onSuccess(newChatRoom: IChatRoomModel) {
    hideModalCreateChatRoom();
    currentChatRoom.value = newChatRoom;
    notification.success({ message: 'Tạo cuộc trò chuyện thành công' });
  }

  function onError() {
    notification.error({ message: 'Tạo cuộc trò chuyện thất bại' });
  }

  await addNewChatRoom(modelId, onSuccess, onError);
}

const listConversations = computed(() => {
  listModelIds.value = chatRooms.value.map((item) => item.model_id);

  const data = chatRooms.value
    .map((chatRoom) => {
      const user = listModels.value.find((item) => item.id === chatRoom.model_id);

      const model = {
        avatar: getUrlImageLow(user?.avatar),
        name: profileHandleName(user?.firstname, user?.lastname),
      };

      return {
        ...chatRoom,
        model,
      };
    })
    .slice()
    .sort((a, b) => {
      return dayjs(b.last_message_at.toDate()).unix() - dayjs(a.last_message_at.toDate()).unix();
    });

  return data;
});

const listConversationsFiltered = computed(() => {
  if (!searchModel.value) return listConversations.value;

  return listConversations.value.filter((conversation) => {
    return listModelFiltered.value.some((model) => model.id === conversation.model_id);
  });
});

function removeAccents(str: string): string {
  if (!str) return '';

  // Trim the string
  const trimmedString = str.trim();
  // Normalize the string
  const normalizedString = trimmedString.normalize('NFD');
  // Replace the accents with an empty string
  const stringWithoutAccents = normalizedString.replace(/[\u0300-\u036F]/g, '');
  return stringWithoutAccents;
}
</script>
