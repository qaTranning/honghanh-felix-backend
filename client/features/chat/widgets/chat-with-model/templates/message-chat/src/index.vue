<template>
  <div ref="refDiv" class="flex flex-col space-y-2 overflow-auto max-h-[400px] h-[400px]">
    <div v-for="(item, i) in $props.messages" :key="i">
      <div v-if="item.model_id === item.sender_id">
        <div class="w-fit max-w-[300px] bg-gray-200 p-2 rounded-[10px]">
          <p class="text-[10px]">{{ convertTimeAndDate(item.created_at.toDate() as any) }}</p>

          <p v-if="item.type === 'TEXT'" class="text-left">{{ item.content }}</p>
          <p v-else class="text-right">
            <img :src="item.content" class="max-w-[250px]" />
          </p>
        </div>
      </div>

      <div v-else class="flex flex-row justify-end">
        <div class="max-w-[300px] bg-pink-100 p-2 rounded-[10px]">
          <p class="text-[10px]">{{ convertTimeAndDate(item.created_at.toDate() as any) }}</p>

          <p v-if="item.type === 'TEXT'" class="text-right">{{ item.content }}</p>

          <p v-else class="text-right">
            <img :src="item.content" class="max-w-[250px]" />
          </p>
        </div>
      </div>
    </div>
    <div v-if="$props.messages.length === 0">
      <div class="h-[300px] flex justify-center items-center">
        <a-empty description="Chưa có tin nhắn trao đổi" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ChatMessageModel } from '../../../../../models/chat.model';
import { convertTimeAndDate } from '~/common/helpers/time';

interface Props {
  messages: ChatMessageModel[];
}

const refDiv = ref<HTMLDivElement | null>(null);

const props = defineProps<Props>();

watch(
  () => props.messages,
  () => {
    if (refDiv.value) {
      refDiv.value.scrollTop = refDiv.value.scrollHeight;
    }
  }
);
</script>
