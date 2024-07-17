<template>
  <Head>
    <Title>Hồ sơ cá nhân</Title>
  </Head>
  <NuxtLayout name="logined">
    <NuxtLayout name="profile">
      <NuxtPage />
    </NuxtLayout>
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({
  redirect: () => {
    return { name: 'profile-detail' };
  },
});
</script>
