<template>
  <a-dropdown placement="bottomRight">
    <nuxt-img :src="flag" width="25" />
    <template #overlay>
      <a-menu @click="({ key }) => onChangeLocale(key as any)">
        <a-menu-item key="vi">
          <a href="javascript:;">
            <nuxt-img :src="IMAGES_PATH.FLAGS.VI" width="25" /> {{ $t('language.vi') }}
          </a>
        </a-menu-item>
        <a-menu-item key="en">
          <a href="javascript:;">
            <nuxt-img :src="IMAGES_PATH.FLAGS.EN" width="25" /> {{ $t('language.en') }}</a
          >
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>
<script setup lang="ts">
import { IMAGES_PATH } from '~/assets';
import { useLocales } from '~/features/root/services';

const { flag, onChangeLocale } = useLocales();
</script>
