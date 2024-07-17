<template>
  <a-card :title="t('common.user')">
    <!-- DATA TABLE -->
    <UserTable />
  </a-card>
</template>

<script setup lang="ts">
import { UserTable } from '@/features/user/widgets';
const { t } = useI18n();
</script>
