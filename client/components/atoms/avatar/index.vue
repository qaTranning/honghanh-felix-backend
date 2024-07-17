<template>
  <a-avatar v-bind="props">
    <template v-if="hasNoSrc" #icon><UserOutlined /></template>
  </a-avatar>
</template>

<script setup lang="ts">
import type { AvatarProps } from 'ant-design-vue';
import { UserOutlined } from '@ant-design/icons-vue';

const props = defineProps<AvatarProps>();
const hasNoSrc = computed(() => !props.src);
</script>
