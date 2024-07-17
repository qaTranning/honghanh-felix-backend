import type { IBaseEntity } from '@/common/models';
import type { IBrand } from '~/features/brand/models';
import type { ICategory } from '~/features/category/models';
import type { IModel } from '~/features/model/models';

export interface ICampaign extends IBaseEntity {
  brandId: number;
  name: string;
  order: number;
  description: string;
  exclusive: boolean;
  budget: string;
  workHours: number;
  thumbnail: string;
  location: string;
  gender: string;
  status: string;
  startDate: string;
  exclusiveTime: string;
  categories: ICategoryCampaign[];
  brand: IBrand;
  startFittingDate: string;
  endFittingDate: string;
  startWorkingDate: string;
  endWorkingDate: string;
  _count: {
    campaignRoles: number;
  };
  campaignRoles: ICampaignRole[];
  brandName?: string;
}

interface ICategoryCampaign {
  campaignId: number;
  categoryId: number;
  category: ICategory;
}

export interface ICampaignRole extends IBaseEntity {
  campaignId: number;
  name: string;
  gender: 'FEMALE' | 'MALE';
  budget: number;
  imageLicenseFee: string;
  fromHeight: number;
  toHeight: number;
  fromWeight: number;
  toWeight: number;
  fromAge: number;
  toAge: number;
  quantity: number;
  style: string;
  citizenship: 'ASIAN' | 'AFRICAN' | 'EUROPEAN' | 'AMERICAN';
  wordload: number;
  workingDate: string;
  description: string;
  endShootingDate: string;
  startShootingDate: string;
  startFittingDate: string;
  endFittingDate: string;
  campaign: ICampaign;
  models: IRegisterCampaign[];
  status: 'PROCESSING' | 'COMPLETED';
}

export interface IRegisterCampaign extends IBaseEntity {
  campaignId: number;
  modelId: number;
  status: string;
  campaignRoleId: number | null;
  campaignRole: ICampaignRole;
  campaign: ICampaign;
  model: IModel;
}

export interface IReviewCampaign extends IBaseEntity {
  campaignId: number;
  modelId: number;
  rate: number;
  comment: string;
  campaign: ICampaign;
  model: IModel;
}
