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
} from 'firebase/firestore';

import { notification } from 'ant-design-vue';
import type { ChatMessageModel } from '../models/chat.model';
import { useGetAllModelsQuery } from '~/features/model/apis';
import { useQueryProfile } from '~/features/profile';
import { firestoreDb } from '~/firebase';

const groupType = 'ADMIN';

const q = query(
  collection(firestoreDb, 'messages'),
  and(where('group_type', '==', groupType)),
  orderBy('created_at', 'asc')
);

const messageCollection = computed(async () => {
  try {
    return await getDocs(q);
  } catch (error) {
    return [];
  }
});

export function useChat() {
  const queryProfile = useQueryProfile();
  const adminId = computed(() => queryProfile.data?.value?.data?.id);
  const { query: queryAllModel } = useGetAllModelsQuery();

  const messages = ref([] as ChatMessageModel[]);

  const chatRooms = ref<any>([]);

  const isLoadingSendMsg = ref(false);

  watch(chatRooms, (v) => {
    console.log('chatRooms: ', v);
  });

  onSnapshot(q, (querySnapshot) => {
    const msgList = querySnapshot.docs.map(
      (doc) => ({ ...doc.data(), id: doc.id }) as ChatMessageModel
    );

    messages.value = msgList;
  });

  async function sendMessage(
    params: {
      content: string;
      model_id: number;
      type?: ChatMessageModel['type'];
    },
    onSendSuccess: () => void = () => {},
    onSendError: () => void = () => {}
  ) {
    try {
      isLoadingSendMsg.value = true;
      const newMsgFs: Omit<ChatMessageModel, 'id'> = {
        content: params.content,
        created_at: Timestamp.now(),
        group_type: 'ADMIN',
        model_id: params.model_id,
        sender_id: adminId.value as number,
        type: params.type || 'TEXT',
      };

      console.log('newMsgFs: ', newMsgFs);
      (await addDoc(collection(firestoreDb, 'messages'), newMsgFs)) as unknown as ChatMessageModel;
      onSendSuccess();
    } catch (error) {
      console.log('error: ', error);
      notification.error({
        message: 'Error',
        description: "Can't send message",
      });
      onSendError();
    } finally {
      isLoadingSendMsg.value = false;
    }
  }

  return {
    messages,
    sendMessage,
    messageCollection,
    isLoadingSendMsg,
  };
}
