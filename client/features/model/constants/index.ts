export const MODEL_FEATURE_NAME = 'MODEL_MODULE';

export const MODEL_STATUS = ['PENDING', 'ACTIVE', 'BANNED'] as const;
export type ModelStatusType = (typeof MODEL_STATUS)[number];
