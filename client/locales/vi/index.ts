import common from './common.json';
import field from './field.json';
import language from './language.json';
import { MODEL_LOCALES } from '~/features/model/locales';

import {
  APP_CONFIG_LOCALES,
  USER_LOCALES,
  AUTH_LOCALES,
  PROFILE_LOCALES,
  CATEGORY_LOCALES,
} from '~/features';

export default {
  common,
  field,
  language,
  auth: { ...AUTH_LOCALES.vi },
  profile: { ...PROFILE_LOCALES.vi },
  user: { ...USER_LOCALES.vi },
  model: { ...MODEL_LOCALES.vi },
  app_config: { ...APP_CONFIG_LOCALES.vi },
  category: { ...CATEGORY_LOCALES.en },
};
