<template>
  <div class="w-full h-screen min-h-[700px] flex justify-center items-center">
    <div class="w-[500px] max-w-[98%] m-auto">
      <a-card>
        <div class="flex justify-center items-center">
          <nuxt-img :src="IMAGES_PATH.LOGOS.MAIN" width="150" />
        </div>
        <slot></slot
      ></a-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IMAGES_PATH } from '~/assets';
</script>
