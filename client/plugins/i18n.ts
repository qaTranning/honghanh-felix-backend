import { createI18n } from 'vue-i18n';
import { vi, en } from '~/locales';

export default defineNuxtPlugin(({ vueApp }) => {
  const i18n = createI18n({
    locales: ['en', 'vi'],
    legacy: false,
    globalInjection: true,
    locale: 'vi',
    fallbackLocale: 'en',
    messages: {
      en,
      vi,
    },
  });

  vueApp.use(i18n);
});
