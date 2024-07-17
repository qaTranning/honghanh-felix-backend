import type { LocaleType } from '@nuxtjs/i18n/dist/module';
import { IMAGES_PATH } from '~/assets';

export function useLocales() {
  const { locale } = useI18n();

  function onChangeLocale(value: LocaleType) {
    locale.value = value;
  }

  const flag = computed(() =>
    locale.value === 'vi' ? IMAGES_PATH.FLAGS.VI : IMAGES_PATH.FLAGS.EN
  );

  return { locale, onChangeLocale, flag };
}
