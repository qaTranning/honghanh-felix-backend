import type { Timestamp } from 'firebase/firestore/lite';

export interface ChatMessageModel {
  sender_id: number;
  model_id: number;
  content: string;
  type: 'TEXT' | 'IMAGE' | 'VIDEO';
  created_at: Timestamp;
  group_type: 'ADMIN' | 'BRAND';
  id: string;
}

export interface IMessageModel {
  id: string;
  content: string;
  created_at: Timestamp;
  updated_at: Timestamp;
  sender_id: number;
  message_type: 'TEXT' | 'IMAGE' | 'VIDEO';
  seen_user_ids: number[];
}

export interface IChatRoomModel {
  id: string;
  created_at: Timestamp;
  last_message_at: Timestamp;
  model_id: number;
  chat_room_type: 'ADMIN' | 'BRAND';
}
