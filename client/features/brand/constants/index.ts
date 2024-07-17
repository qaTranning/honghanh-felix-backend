export const BRAND_MODULE_NAME = 'BRAND';

export const BRAND_STATUS = ['PENDING', 'ACTIVE', 'BANNED'] as const;
export type BrandStatusType = (typeof BRAND_STATUS)[number];
