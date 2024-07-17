<template>
  <a-tag :color="getColorTag(status)">{{ status }}</a-tag>
</template>

<script setup lang="ts">
defineProps<{ status: string }>();

function getColorTag(statusValue: string) {
  switch (statusValue) {
    case 'ACTIVE':
      return 'blue';
    case 'INACTIVE':
      return 'red';

    default:
      return '';
  }
}
</script>
