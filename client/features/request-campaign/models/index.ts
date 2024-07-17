import type { ICampaign } from '~/features/campaign/models';
import type { IModel } from '~/features/model/models';

export interface IRequestCampaign {
  modelId: number;
  campaignRoleId: number;
  status: ERegisterCampaignStatus;
  updatedAt: string;
  createdAt: string;
  campaignRole: CampaignRole;
  model: IModel;
}

export interface CampaignRole {
  id: number;
  campaignId: number;
  name: string;
  description: string;
  gender: string;
  budget: string;
  imageLicenseFee: string;
  fromHeight: string;
  toHeight: string;
  fromWeight: string;
  toWeight: string;
  fromAge: string;
  toAge: string;
  quantity: string;
  style: string;
  citizenship: string;
  wordload: string;
  workingDate: string;
  campaign: ICampaign;
}

export enum ERegisterCampaignStatus {
  REGISTERED = 'REGISTERED',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
}
