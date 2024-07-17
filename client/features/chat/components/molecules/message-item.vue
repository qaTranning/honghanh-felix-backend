<template>
  <div :className="`flex w-full ${classIsMeWrapper}`">
    <div
      :className="`p-3 bg-purple-300 mx-3 my-1 rounded-2xl rounded-bl-none w-max max-w-3/4 ${classBoxIsMe}`"
    >
      <div v-if="$props.message_type === 'TEXT'" :className="` ${classTextIsMe}`">
        {{ $props.content }}
      </div>
      <div v-if="$props.message_type === 'IMAGE'">
        <a-image
          width="{200}"
          :src="$props.content"
          alt="avatar"
          :style="{ width: '100%', height: '150px' }"
        />
      </div>
      <div :className="`text-xs text-right shrink-0 ${classCreatedDate}`">
        {{ dayjs($props.created_at.toDate()).fromNow() }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
// import viLocale from 'dayjs/locale/vi';
import type { IMessageModel } from '../../models/chat.model';

// dayjs().locale(viLocale).format();

// eslint-disable-next-line import/no-named-as-default-member
dayjs.extend(relativeTime);
const props = defineProps<IMessageModel & { isModel: boolean }>();

const classIsMeWrapper = computed(() => {
  return !props.isModel ? 'justify-end ' : 'justify-start ';
});

const classBoxIsMe = computed(() => {
  return !props.isModel ? 'bg-purple-500' : 'bg-purple-300';
});

const classTextIsMe = computed(() => {
  return !props.isModel ? 'text-gray-200' : 'text-gray-700';
});

const classCreatedDate = computed(() => {
  return !props.isModel ? 'text-gray-200' : 'text-gray-500';
});
</script>
