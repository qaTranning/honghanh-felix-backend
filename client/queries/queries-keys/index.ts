import { mergeQueryKeys } from '@lukemorales/query-key-factory';
import { appConfigQueryKey } from '~/features/app-config/queries-key';
import { modelQueryKey } from '~/features/model/queries-key';
import { profileQueryKey } from '~/features/profile';
import { userQueryKey } from '~/features/user/queries-key';
import { categoryQueryKey } from '~/features/category';
import { brandQueryKey } from '~/features/brand';
import { campaignQueryKey } from '~/features/campaign/queries-key';
import { requestCampaignQueryKey } from '~/features/request-campaign';
import { galleryQueryKey } from '~/features/gallery';
import { reviewQueryKey } from '~/features/review';
import { paymentQueryKey } from '~/features/payment/queries-key';
import { scheduleQueryKey } from '~/features/schedule';

export const allQueriesKeys = mergeQueryKeys(
  profileQueryKey,
  userQueryKey,
  appConfigQueryKey,
  modelQueryKey,
  categoryQueryKey,
  brandQueryKey,
  campaignQueryKey,
  requestCampaignQueryKey,
  galleryQueryKey,
  reviewQueryKey,
  paymentQueryKey,
  scheduleQueryKey
);
