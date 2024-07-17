<template>
  <div class="pt-[50px] h-screen flex flex-col">
    <header class="w-full h-[50px] fixed top-0 z-10 bg-background_v2">
      <div class="max-w-[98%] flex justify-between items-center m-auto h-full">
        <div class="flex justify-between space-x-2">
          <NuxtLink :to="{ name: 'index' }">
            <nuxt-img :src="IMAGES_PATH.LOGOS.MAIN" width="70" />
          </NuxtLink>
        </div>
        <div class="flex space-x-2 items-center">
          <!-- <RootLanguageItem /> -->
          <RootProfileInfoHeader :fullname="data?.data.email" @logout="showLogoutConfirmModal" />
        </div>
      </div>
    </header>
    <main class="flex-1 overflow-auto">
      <slot></slot>
    </main>
  </div>
</template>

<script setup lang="ts">
import { IMAGES_PATH } from '~/assets';
import { useAuthLogoutConfirmModal } from '~/features/auth/services';
import { useQueryProfile } from '~/features/profile';
import { RootProfileInfoHeader, RootLanguageItem } from '~/features/root/components';

const { data } = useQueryProfile();

const { showLogoutConfirmModal } = useAuthLogoutConfirmModal();
</script>
