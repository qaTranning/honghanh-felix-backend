import type { IBaseEntity } from '~/common/models';
import type { ICampaign } from '~/features/campaign/models';
import type { IModel } from '~/features/model/models';

export interface IReview extends IBaseEntity {
  campaignId: number;
  modelId: number;
  rate: number;
  comment: string;
  campaign: ICampaign;
  model: IModel;
  status: string;
}
