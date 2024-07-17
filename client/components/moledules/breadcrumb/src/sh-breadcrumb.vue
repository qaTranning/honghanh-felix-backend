<template>
  <div class="pb-1">
    <a-breadcrumb :routes="$props.routes">
      <template #itemRender="{ route }">
        <span v-if="routes.indexOf(route) === routes.length - 1">
          {{ route.breadcrumbName }}
        </span>
        <router-link v-else :to="{ name: route.path }">
          {{ route.breadcrumbName }}
        </router-link>
      </template>
    </a-breadcrumb>
  </div>
</template>
<script lang="ts" setup>
import type { ShBreadcrumbProps } from '../models';

defineProps<ShBreadcrumbProps>();
</script>
