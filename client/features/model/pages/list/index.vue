<template>
  <a-card :title="t('common.model')">
    <!-- Actions -->

    <!-- DATA TABLE -->
    <ModelTable />
  </a-card>
</template>

<script setup lang="ts">
import { ModelTable } from '@/features/model/widgets';
const { t } = useI18n();
</script>
