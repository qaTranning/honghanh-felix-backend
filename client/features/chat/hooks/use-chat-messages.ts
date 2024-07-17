/* eslint-disable camelcase */
import {
  onSnapshot,
  Timestamp,
  addDoc,
  and,
  collection,
  getDocs,
  orderBy,
  query,
  where,
  updateDoc,
  doc,
} from 'firebase/firestore';

import { notification } from 'ant-design-vue';
import dayjs from 'dayjs';
import type { IChatRoomModel, IMessageModel } from '../models/chat.model';
import { useGetAllModelsQuery, useGetDetailModelQuery } from '~/features/model/apis';
import { useQueryProfile } from '~/features/profile';
import { firestoreDb } from '~/firebase';
import { useSendNotiFCMMutation } from '~/features/user/apis';

type TypeSendMessage = Omit<IMessageModel, 'id' | 'created_at' | 'updated_at'>;

const chatRoomType = 'ADMIN';

const qChatRooms = query(
  collection(firestoreDb, 'chat_rooms'),
  and(where('chat_room_type', '==', chatRoomType)),
  orderBy('created_at', 'asc'),
  orderBy('last_message_at', 'desc')
);

export const chatRoomCollection = computed(async () => {
  try {
    return await getDocs(qChatRooms);
  } catch (error) {
    return [];
  }
});

export async function addMessageToCollection(chatRoomId: string, newMessage: TypeSendMessage) {
  const msg = {
    ...newMessage,
    created_at: Timestamp.now(),
    updated_at: Timestamp.now(),
  };
  const messageResponse = await addDoc(
    collection(firestoreDb, 'chat_rooms', chatRoomId, 'messages'),
    msg
  );
  return messageResponse as unknown as IMessageModel;
}

export async function updateMessageToCollection(
  chatRoomId: string,
  messageId: string,
  newMessage: Partial<TypeSendMessage>
) {
  const msg = {
    ...newMessage,
    update_at: Timestamp.now(),
  };

  try {
    await updateDoc(doc(firestoreDb, 'chat_rooms', chatRoomId, 'messages', messageId), msg as any);
    return newMessage;
  } catch (error) {
    return null;
  }
}

export async function updateChatRoom(chatRoomId: string, newChatRoom: Partial<IChatRoomModel>) {
  const chatRoom: Partial<IChatRoomModel> = {
    ...newChatRoom,
    last_message_at: Timestamp.now(),
  };

  try {
    await updateDoc(doc(firestoreDb, 'chat_rooms', chatRoomId), chatRoom as any);

    return undefined;
  } catch (error) {
    return null;
  }
}

export async function addChatRoom(newChatRoom: Partial<IChatRoomModel>) {
  const chatRoom = {
    ...newChatRoom,
    created_at: Timestamp.now(),
    last_message_at: Timestamp.now(),
  };

  try {
    const newChatRoomRes = await addDoc(collection(firestoreDb, 'chat_rooms'), chatRoom as any);
    return newChatRoomRes;
  } catch (error) {
    return null;
  }
}

type Messages = (IMessageModel & { isModel: boolean })[];

export function useChatMessages() {
  const queryProfile = useQueryProfile();
  const queryDetailModel = useGetDetailModelQuery();
  const { currentModelId } = queryDetailModel;

  const adminId = computed(() => queryProfile.data?.value?.data?.id);
  const { query: queryAllModel } = useGetAllModelsQuery();

  const { mutate: sendNotiFcmMutate } = useSendNotiFCMMutation();

  const messages = ref<Messages>([]);

  const chatRooms = ref<
    (IChatRoomModel & {
      lastMessage: (IMessageModel & { isModel: boolean }) | undefined;
      totalUnseenMessages: number;
    })[]
  >([]);

  const isLoadingSendMsg = ref(false);

  const currentChatRoom = ref<IChatRoomModel | null>(null);
  const currentChatRoomId = computed(() => currentChatRoom.value?.id);

  const queryMessagesCollection = computed(() => {
    return function (chatRoomId: string) {
      return query(
        collection(firestoreDb, 'chat_rooms', chatRoomId, 'messages'),
        orderBy('created_at', 'asc')
      );
    };
  });

  onSnapshot(qChatRooms, async (querySnapshot) => {
    // console.log(
    //   'querySnapshot.docs: qChatRooms',
    //   querySnapshot.docs.map((d) => d.data())
    // );

    const chatRoomList = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    })) as unknown as IChatRoomModel[];

    if (!chatRoomList.length) {
      chatRooms.value = [];
    } else {
      const data = await Promise.all(
        chatRoomList.map(async (chatRoom) => {
          const messagesQuery = await Promise.all(
            chatRoomList.map(async (chatRoom) => {
              const q = queryMessagesCollection.value(chatRoom.id);

              const messages: IMessageModel[] = (await getDocs(q)).docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
              })) as IMessageModel[];

              return {
                chatRoomId: chatRoom.id,
                messages,
              };
            })
          );

          const messages = messagesQuery
            .filter((msg) => {
              return msg.chatRoomId === chatRoom.id;
            })
            .flatMap((msg) => msg.messages);

          // console.log('messages: ', messages);
          const totalUnseenMessages = messages.reduce((acc, curr) => {
            const isValid =
              curr.sender_id === currentModelId.value &&
              !curr.seen_user_ids.includes(adminId.value as number);

            const total = isValid ? 1 : 0;
            return acc + total;
          }, 0);
          // console.log('totalUnseenMessages: ', totalUnseenMessages);

          const _lastMessage = messages?.[messages.length - 1];

          const lastMessage = (
            messages.length > 0 && _lastMessage
              ? {
                  ..._lastMessage,
                  isModel: _lastMessage.sender_id !== adminId.value,
                }
              : undefined
          ) as
            | (IMessageModel & {
                isModel: boolean;
              })
            | undefined;

          return {
            ...chatRoom,
            lastMessage,
            totalUnseenMessages,
          };
        })
      );

      chatRooms.value = data;
    }
  });

  watch(currentChatRoom, (v) => {
    if (v) {
      onSnapshot(queryMessagesCollection.value(v.id as string), async (querySnapshot) => {
        // console.log(
        //   'querySnapshot.docs: queryMessagesCollection',
        //   querySnapshot.docs.map((d) => d.data())
        // );
        // console.log(
        //   'querySnapshot.docChanges: queryMessagesCollection ',
        //   querySnapshot.docChanges().map((d) => d.doc.data())
        // );
        const messagesSnapshot = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })) as unknown as IMessageModel[];

        console.log(v);

        console.log('messagesSnapshot: ', messagesSnapshot);

        // await updateSeenUserIdsMessage();

        if (!messagesSnapshot.length) {
          messages.value = [];
        } else {
          messages.value = messagesSnapshot.map((msg) => {
            return {
              ...msg,
              isModel: msg.sender_id !== adminId.value,
            };
          });
        }
      });
    }
  });

  function showErrorMessage<E>(err: E) {
    notification.error({
      message: 'Error',
      description:
        "Can't send message! Please try again later." + import.meta.env.DEV
          ? JSON.stringify(err, null, 2)
          : '',
    });
  }

  async function addNewChatRoom(
    modelId: number,
    onAddSuccess: (newChatRoom: IChatRoomModel) => void,
    onAddError: () => void
  ) {
    try {
      const newChatRoom: Partial<IChatRoomModel> = {
        model_id: modelId,
        chat_room_type: chatRoomType,
        created_at: Timestamp.now(),
        last_message_at: Timestamp.now(),
      };

      const newChatRoomRes = (await addChatRoom(newChatRoom)) as unknown as IChatRoomModel;
      onAddSuccess(newChatRoomRes);
    } catch (error) {
      showErrorMessage(error);
      onAddError();
    }
  }

  async function sendMessage(params: ISendMessageParams) {
    if (!adminId.value) return;

    const { onSendSuccess = () => {}, onSendError = () => {}, variables } = params;
    try {
      const { chat_room, message } = variables || {};

      const { id, model_id } = chat_room || {};
      isLoadingSendMsg.value = true;
      const chatRoomFs = {
        ...currentChatRoom.value,
        last_message_at: Timestamp.now(),
      };

      const messageFs = {
        ...message,
        sender_id: adminId.value,
        seen_user_ids: [adminId.value],
      };

      await updateChatRoom(id, chatRoomFs);
      await addMessageToCollection(id, messageFs);
      sendNotiFcmMutate({
        body: {
          userId: model_id,
          type: 'new_message',
          data: {
            chat_room_id: id,
            content: message.content,
            message_type: message.message_type,
          },
        },
      });
      onSendSuccess();
    } catch (error) {
      showErrorMessage(error);
      onSendError();
    } finally {
      isLoadingSendMsg.value = false;
    }
  }

  const listUnseenMessages = computed(() =>
    messages.value.filter(
      (message) => message.isModel && !message.seen_user_ids?.includes(adminId.value as number)
    )
  );

  watch(listUnseenMessages, async (v) => {
    if (v.length === 0) return;

    await nextTick(async () => {
      await updateSeenUserIdsMessage();
    });
  });

  async function updateSeenUserIdsMessage() {
    if (!adminId.value) return;
    if (listUnseenMessages.value.length === 0) return;

    if (!currentChatRoom.value?.id) return;

    await Promise.all(
      listUnseenMessages.value.map((message) => {
        const newSeenUserIds = [
          ...(message.seen_user_ids || []),
          ...(adminId.value ? [adminId.value] : []),
        ];
        // console.log('newSeenUserIds: ', newSeenUserIds);

        return updateMessageToCollection(currentChatRoom.value?.id as string, message.id, {
          seen_user_ids: newSeenUserIds,
        });
      })
    );
  }

  return {
    currentChatRoom,
    messages,
    chatRooms,
    isLoadingSendMsg,
    sendMessage,
    addNewChatRoom,
    updateSeenUserIdsMessage,
    queryDetailModel,
  };
}

interface ISendMessageParams {
  variables: {
    chat_room: Pick<IChatRoomModel, 'id' | 'model_id'>;
    message: Pick<IMessageModel, 'content' | 'message_type'>;
  };
  onSendSuccess?: () => void;
  onSendError?: () => void;
}
