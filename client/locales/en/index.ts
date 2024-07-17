import common from './common.json';
import field from './field.json';
import language from './language.json';

import {
  APP_CONFIG_LOCALES,
  USER_LOCALES,
  AUTH_LOCALES,
  PROFILE_LOCALES,
  CATEGORY_LOCALES,
  BRAND_LOCALES,
} from '~/features';

export default {
  common,
  field,
  language,

  auth: { ...AUTH_LOCALES.en },
  profile: { ...PROFILE_LOCALES.en },
  user: { ...USER_LOCALES.en },
  app_config: { ...APP_CONFIG_LOCALES.en },
  category: { ...CATEGORY_LOCALES.en },
  brand: { ...BRAND_LOCALES.en },
};
