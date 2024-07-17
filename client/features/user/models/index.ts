import type { IBaseEntity } from '@/common/models';
import type { IModel } from '~/features/model/models';

export interface IUser extends IBaseEntity {
  email: string;
  hashedPassword: string;
  isEmailConfirmed: boolean;
  firstname: string;
  lastname: string;
  avatar: string;
  status: number;
  role: 'MODEL' | 'REPRESENTATIVE' | 'ADMIN';
  model?: IModel;
  uid?: string;
}

export interface Campaign {
  campaignId: number;
  modelId: number;
  status: number;
}

export interface ModelImage {
  id: number;
  modelId: number;
  image: string;
}

export interface ModelVideo {
  id: number;
  modelId: number;
  video: string;
}

export interface Schedule extends IBaseEntity {
  detail: string;
  note: string;
  address: string;
  type: number;
  startDate: string;
  endDate: string;
}
