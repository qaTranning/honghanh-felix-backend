<template>
  <Head>
    <Title>Felix Data</Title>
  </Head>
  <NuxtLayout name="logined">
    <NuxtLayout name="data-dashboard">
      <NuxtPage />
    </NuxtLayout>
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({
  redirect: () => {
    return { name: 'data-user' };
  },
});
</script>
