<template>
  <div>
    <quill-editor
      toolbar="full"
      theme="snow"
      contentType="html"
      @ready="onReady($event)"
      @update:content="onChange"
    />
  </div>
</template>

<script setup lang="ts">
import { Quill } from '@vueup/vue-quill';

const emit = defineEmits<{
  (e: 'update:content', html: string): void;
}>();

const quill = ref<Quill | null>(null);

function onChange(html: string) {
  emit('update:content', html?.trim() || '');
}

function onReady(_quill: Quill) {
  quill.value = _quill;
}
</script>
