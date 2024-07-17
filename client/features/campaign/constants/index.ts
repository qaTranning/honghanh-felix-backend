export const CAMPAIGN_FEATURE_NAME = 'CAMPAIGN_MODULE';

export const CAMPAIGN_STATUS = ['PENDING', 'ACTIVE', 'BANNED'] as const;
export type CampaignStatusType = (typeof CAMPAIGN_STATUS)[number];

export enum RegisterCampaignStatus {
  Registered = 0,
  Accepted = 1,
  Rejected = 2,
  Completed = 3,
  Canceled = 4,
}

export const CAMPAIGN_STATUS_ARRAY: {
  color: string;
  label: string;
  value: string;
}[] = [
  {
    color: 'cyan',
    label: 'Chờ bắt đầu',
    value: 'PENDING',
  },
  {
    color: 'purple',
    label: 'Đang hoạt động',
    value: 'PROCESSING',
  },

  {
    color: 'green',
    label: 'Chờ thanh toán',
    value: 'WAITING_PAYMENT',
  },

  {
    color: 'blue',
    label: 'Đã thanh toán',
    value: 'PAID',
  },

  {
    color: 'yellow',
    label: 'Hoàn thành',
    value: 'COMPLETED',
  },
  {
    color: 'red',
    label: 'Đã hủy',
    value: 'CANCELED',
  },
];
