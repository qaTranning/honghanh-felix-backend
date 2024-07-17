import {
  collection,
  query,
  where,
  and,
  getDocs,
  Timestamp,
  addDoc,
  orderBy,
  onSnapshot,
} from 'firebase/firestore';
import type { UploadFile } from 'ant-design-vue';
import type { ChatMessageModel } from '../../models/chat.model';
import { useQueryProfile } from '~/features/profile';
import { firestoreDb } from '~/firebase';
import { useBoolean } from '~/common';

interface Props {
  modelId: number;
}

const messageCollection = computed(async () => {
  try {
    return await getDocs(q);
  } catch (error) {
    return [];
  }
});

export function useAdminChatModelOnly({ modelId }: Props) {
  const { data } = useQueryProfile();

  const senderId = data.value?.data.id;

  const messages = ref<ChatMessageModel[]>([]);

  const [openUpload, onOpenUpload] = useBoolean();

  const upload = ref<UploadFile<unknown>[]>([]);

  const groupType = 'ADMIN';

  const q = computed(() =>
    query(
      collection(firestoreDb, 'messages'),
      and(where('group_type', '==', groupType), where('model_id', '==', modelId)),
      orderBy('created_at', 'asc')
    )
  );

  onSnapshot(q.value, (querySnapshot) => {
    const msgList = querySnapshot.docs.map(
      (doc) => ({ ...doc.data(), id: doc.id }) as ChatMessageModel
    );

    messages.value = msgList;
  });

  async function getMessages() {
    try {
      const groupType = 'ADMIN';

      const messagesCol = collection(firestoreDb, 'messages');
      const q = query(
        messagesCol,
        and(where('group_type', '==', groupType), where('model_id', '==', modelId)),
        orderBy('created_at', 'asc')
      );
      const messageSnapshot = await getDocs(q);
      const messageList = messageSnapshot.docs.map((doc) => doc.data()) as ChatMessageModel[];

      messages.value = messageList || [];

      return messageList;
    } catch (error) {
      return [];
    }
  }

  async function addNewMessage(params: { content: string; type?: 'TEXT' | 'IMAGE' | 'VIDEO' }) {
    const newMsgFs: Omit<ChatMessageModel, 'id'> = {
      content: params.content,
      created_at: Timestamp.now(),
      group_type: 'ADMIN',
      model_id: modelId,
      sender_id: senderId as number,
      type: params.type || 'TEXT',
    };
    const newMsgRes = (await addDoc(
      collection(firestoreDb, 'messages'),
      newMsgFs
    )) as unknown as ChatMessageModel;
    // await getMessages();
  }

  watch(openUpload, () => {
    upload.value = [];
  });

  return {
    addNewMessage,
    messages,
    getMessages,
    openUpload,
    upload,
    onOpenUpload,
  };
}
