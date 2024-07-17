<template>
  <div class="flex">
    <a-tag v-for="(tag, index) in subListTag" :key="index" color="blue">{{ tag }}</a-tag>

    <a-popover trigger="click">
      <template #content>
        <a-tag v-for="(tag, index) in restTag" :key="index" color="blue">{{ tag }}</a-tag>
      </template>
      <a-tag v-if="isMore">...</a-tag>
    </a-popover>
  </div>
</template>

<script setup lang="ts">
import { jsonReturnStringArray } from '~/common/helpers/json';
const props = defineProps<{ value: string; max?: number }>();
const { max } = props;

const listTag = jsonReturnStringArray(props.value);
console.log('listTag: ', listTag);

const subListTag = computed(() => listTag.slice(0, max || 5));

const restTag = computed(() => listTag.slice(max || 5));

const isMore = computed(() => max && listTag.length > max);
</script>
