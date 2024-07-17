<template>
  <a-card :title="t('common.brand')">
    <BrandTable />
  </a-card>
</template>

<script setup lang="ts">
import { BrandTable } from '@/features/brand/widgets';
const { t } = useI18n();
</script>
