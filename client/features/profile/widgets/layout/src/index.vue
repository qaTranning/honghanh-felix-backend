<template>
  <ShDashboardLayout title="Hồ sơ cá nhân" :menu="PROFILE_DASHBOARD_MENU">
    <slot></slot>
  </ShDashboardLayout>
</template>

<script setup lang="ts">
import { ShDashboardLayout } from '@/components/organisms';
import { PROFILE_DASHBOARD_MENU } from '~/features/profile/constants';
</script>
