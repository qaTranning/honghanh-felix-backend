<template>
  <div>
    <sprite-animation :steps="step" cell="466x700" duration="3s" :src="image" />
  </div>
</template>

<script setup lang="ts">
defineProps({
  step: {
    type: Number,
    default: 27,
  },
  image: {
    type: String,
    default: null,
  },
});

useHead({
  script: [{ src: '//sprite-meister.github.io/element.js' }],
});
</script>
