<template>
  <ShDashboardLayout :title="t('common.dashboard')" :menu="DATA_DASHBOARD_MENU">
    <slot></slot>
  </ShDashboardLayout>
</template>

<script setup lang="ts">
import { DATA_DASHBOARD_MENU } from '../../../constants';
import { ShDashboardLayout } from '@/components/organisms';
const { t } = useI18n();
</script>
