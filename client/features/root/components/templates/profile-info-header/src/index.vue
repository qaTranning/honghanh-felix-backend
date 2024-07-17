<template>
  <a-popover
    v-model:visible="open"
    trigger="click"
    placement="bottomRight"
    :color="COLORS.background_v2.DEFAULT"
  >
    <a-button
      type="text"
      :style="{ color: open ? COLORS.primary.DEFAULT : undefined }"
      class="text-white hover:text-primary"
      >{{ $props.fullname }}
      <DownOutlined
        :style="{
          transform: open ? undefined : 'rotate(180deg)',
        }"
      />
    </a-button>
    <template #content>
      <div class="flex flex-col space-y-2 w-[320px] max-w-[90vw]">
        <div class="p-4">
          <a
            class="hover:!text-orange-400 text-white body-main"
            @click="() => $router.push({ name: 'profile' })"
          >
            {{ $t('common.account') }}
          </a>
        </div>

        <a-divider class="h-[1px] bg-slate-500 mt-1 mb-1" />
        <div class="flex justify-end">
          <a-button
            class="rounded-sm bg-orange-400 hover:bg-orange-500 [&>*]:text-black !border-none [&>*]:text-base px-5 [&>*]:font-semibold"
            @click="handleClickLogout"
            >{{ $t('common.sign_out') }}</a-button
          >
        </div>
      </div>
    </template>
  </a-popover>
</template>

<script setup lang="ts">
import { DownOutlined } from '@ant-design/icons-vue';
import type { RootProfileInfoHeaderProps, RootProfileInfoHeaderEmits } from '../models';
import { useBoolean } from '~/common';
import { COLORS } from '~/assets';

defineProps<RootProfileInfoHeaderProps>();
const emits = defineEmits<RootProfileInfoHeaderEmits>();
const [open, onOpen] = useBoolean();

function handleClickLogout() {
  // console.log(open.value);
  onOpen.setFalse();
  emits('logout');
}
</script>
