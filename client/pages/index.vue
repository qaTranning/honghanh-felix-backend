<template>
  <Head>
    <Title>Felix Admin</Title>
  </Head>
  <NuxtLayout name="logined">
    <HomePage />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { HomePage } from '~/features';
</script>
