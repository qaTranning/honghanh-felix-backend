<template>
  <NuxtLayout name="auth">
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({
  redirect: () => {
    return { name: 'auth-login' };
  },
});
</script>
