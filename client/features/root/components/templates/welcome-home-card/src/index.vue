<template>
  <a-card :title="t('common.welcome')" :loading="!$props.profile">
    <div class="flex flex-col space-y-4">
      <div class="flex flex-row space-x-2 items-center">
        <a-avatar
          :size="40"
          shape="square"
          class="rounded-lg"
          :src="IMAGE_HELPER.getUrlImageLow($props.profile?.avatar)"
        >
          <template #icon><UserOutlined /></template>
        </a-avatar>
        <div class="flex flex-col">
          <a-typography class="line-clamp-1">
            Hi,
            <span class="font-medium">
              {{
                profileHandleName($props.profile?.firstname, $props.profile?.lastname) || 'username'
              }}
            </span>
          </a-typography>

          <div class="w-fit">
            <a-tag>{{ $props.profile?.role }}</a-tag>
          </div>
        </div>
      </div>

      <!-- button start -->
      <div class="m-auto w-[70%]">
        <a-typography-title class="text-center" :level="4"
          >Bắt đầu quản lý dữ liệu</a-typography-title
        >
      </div>
      <div class="flex justify-center">
        <div class="w-fit">
          <a-button type="primary" @click="$emit('start')">Bắt đầu</a-button>
        </div>
      </div>
    </div>
  </a-card>
</template>

<script setup lang="ts">
import { UserOutlined } from '@ant-design/icons-vue';
import type { WelcomeHomeCardProps, WelcomeHomeCardEmits } from '../models';
import { IMAGE_HELPER } from '~/common/helpers';
import { profileHandleName } from '~/features/profile/utils';

const { t } = useI18n();
defineProps<WelcomeHomeCardProps>();

defineEmits<WelcomeHomeCardEmits>();
</script>
