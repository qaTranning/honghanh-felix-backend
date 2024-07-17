<template>
  <a-card :title="t('common.category')">
    <CategoryTable />
  </a-card>
</template>

<script setup lang="ts">
import { CategoryTable } from '../../widgets';
const { t } = useI18n();
</script>
