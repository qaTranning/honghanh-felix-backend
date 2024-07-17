import type { IBaseEntity } from '@/common/models';
import type { KycStatusType } from '~/features/kyc/models';
import type { IUser } from '~/features/user/models';

export interface IModel extends IBaseEntity {
  citizenship: 'ASIAN' | 'AFRICAN' | 'EUROPEAN' | 'AMERICAN';
  gender: 'MALE' | 'FEMALE' | null;
  dob: string | Date | null;
  address: string;
  phone?: string;
  introduce: string;
  location: string;
  passport: string;
  currency: string;
  voice: string;
  idCard: string;
  idCardFrontFace: string;
  idCardBackFace: string;
  salary1h: number;
  salary4h: number;
  salary8h: number;
  salary12h: number;
  salary24h: number;
  salaryOvertime: number;
  talent: string;
  style: string;
  nationality: string;
  nation: string;
  facebook: string;
  instagram: string;
  tiktok: string;
  twitter: string;
  image360: string;
  height: number;
  weight: number;
  language: string;
  bust: number;
  waist: number;
  hips: number;
  skinColor: string;
  eyeColor: string;
  hairColor: string;
  hairLength: string;
  shirtSize: string;
  trousersSize: string;
  shoesSize: string;
  tattoo: boolean;
  campaigns: Campaign[];
  modelImages: ModelImage[];
  modelVideos: ModelVideo[];
  schedule: Schedule[];
  video: string;
  user: IUser;
  bankAccount: string | null;
  bankAddress: string | null;
  bankName: string | null;
  cardHolder: string | null;
  kycStatus?: KycStatusType;
  kycComment?: string;
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
