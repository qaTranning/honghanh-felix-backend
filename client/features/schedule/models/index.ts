import type { IModel } from '~/features/model/models';

export interface ISchedule {
  modelId: number;
  type: number;
  detail: string;
  address: string;
  note: string;
  startDate: string;
  endDate: string;
  updatedAt: string;
  createdAt: string;
  model: IModel;
}

export enum EScheduleType {
  BUSY = 'BUSY',
  TRAVEL = 'TRAVEL',
  WORK = 'WORK',
}
