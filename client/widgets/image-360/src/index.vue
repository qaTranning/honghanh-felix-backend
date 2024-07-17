<template>
  <div>
    <VueThreeSixty
      :amount="36"
      imagePath="https://scaleflex.cloudimg.io/v7/demo/suv-orange-car-360"
      fileName="orange-{index}.jpg"
      spinReverse
      autoplay
      buttonClass="dark"
      scrollImage
    >
      <template #header>
        <div class="v360-header text-light bg-dark">
          <span class="v360-header-title">36 Images - Autoplay (1 loop) - Reverse Spin</span>
          <span class="v360-header-description"></span>
        </div>
      </template>
    </VueThreeSixty>
  </div>
</template>

<script setup lang="ts">
import VueThreeSixty from 'vue-360';

import 'vue-360/dist/css/style.css';
</script>
