import Components from 'unplugin-vue-components/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';
import IconsResolver from 'unplugin-icons/resolver';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  runtimeConfig: {
    apiSecret: '', // can be overridden by NUXT_API_SECRET environment variable
    public: {
      API_ENDPOINT: process.env.NUXT_API_ENDPOINT,
    },
  },
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=1440,shrink-to-fit=no',
      link: [
        {
          rel: 'icon',
          type: 'image/x-icon',
          href: '/favicon.io',
        },
      ],
    },
  },
  ssr: false,
  srcDir: 'client/',
  css: [
    'ant-design-vue/dist/antd.css',
    '@/assets/less/variables.less',
    '@/assets/scss/tailwind.scss',
    '@/assets/scss/main.scss',
  ],

  vite: {
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
          math: 'always',

          modifyVars: {
            // 'primary-color': '#FFB7B4',
            'link-color': '#FFB7B4',
          },
        },
      },
    },
    plugins: [
      Components({
        resolvers: [
          IconsResolver({
            prefix: 'Icon',
          }),
          AntDesignVueResolver({
            resolveIcons: true,
            importStyle: false,
          }),
        ],
        dts: 'components.d.ts',
      }),
    ],
  },
  modules: [
    [
      '@pinia/nuxt',
      {
        autoImports: ['defineStore', 'acceptHMRUpdate'],
      },
    ],
    '@pinia-plugin-persistedstate/nuxt',
    '@nuxt/image',
    '@nuxtjs/i18n',
    'unplugin-icons/nuxt',
    'nuxt-typed-router',
  ],
  piniaPersistedstate: {
    storage: 'localStorage',
  },
  pinia: {
    storesDirs: ['~/**/stores/**', '~/**/*.store.@(ts|vue)'],
  },
  i18n: {
    /* module options */
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  typescript: {
    typeCheck: false,
  },
});
