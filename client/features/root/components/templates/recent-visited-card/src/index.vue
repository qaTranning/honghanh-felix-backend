<template>
  <a-card :title="t('common.recent')">
    <div class="flex flex-row flex-wrap gap-4">
      <div v-for="item in $props.modules" :key="item.name" class="flex-1 basis-[200px]">
        <root-module-link-card v-bind="item"></root-module-link-card>
      </div>
    </div>
  </a-card>
</template>

<script setup lang="ts">
import { RootModuleLinkCard } from '../../../organisms';
import type { RootRecentVisitedCardProps } from '../models';
defineProps<RootRecentVisitedCardProps>();
const { t } = useI18n();
</script>
