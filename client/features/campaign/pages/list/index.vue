<template>
  <a-card :title="t('common.campaign')">
    <!-- Actions -->

    <!-- DATA TABLE -->
    <CampaignTable />
  </a-card>
</template>

<script setup lang="ts">
import { CampaignTable } from '@/features/campaign/widgets';
const { t } = useI18n();
</script>
