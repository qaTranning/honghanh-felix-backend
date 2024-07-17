<template>
  <ShDashboardFormView :loading="isLoading">
    <template #header>
      <div class="flex flex-row justify-between items-center">
        <h4>{{ $t('profile.profile') }}</h4>
        <a-button @click="handleClickDashboard">Trang chủ</a-button>
      </div>
    </template>

    <template #main>
      <ShInfoItemListCard :values="detailProfile" :card="{ title: 'Hồ sơ cá nhân' }" />
    </template>
    <template #side>
      <a-card :title="$t('profile.avatar')"
        ><ShAvatarCropperUpload
          :cropper="{
            avatar: IMAGE_HELPER.getUrlImageLow(data?.data.avatar),
            onCustomRequest: (file: File) => onUpdateAvatar(file),
          }"
      /></a-card>
    </template>
  </ShDashboardFormView>
</template>

<script setup lang="ts">
import { useQueryProfile } from '../../apis';
import { profileHandleName } from '../../utils';
import { useProfileUpdateAvatar } from '../../services';
import { IMAGE_HELPER, TIME_HELPER } from '~/common';
import {
  ShAvatarCropperUpload,
  ShDashboardFormView,
  ShInfoItemListCard,
  type ShInfoItemProps,
} from '@/components';
const { data, isLoading } = useQueryProfile();
const profile = computed(() => data.value?.data);

function handleClickDashboard() {
  navigateTo({ name: 'data' });
}

const { onUpdateAvatar } = useProfileUpdateAvatar();

const { t } = useI18n();

const detailProfile: ComputedRef<ShInfoItemProps[]> = computed(
  () =>
    [
      {
        label: 'ID',
        value: profile.value?.id.toString(),
      },
      {
        label: t('field.name'),
        value: profileHandleName(profile.value?.firstname, profile.value?.lastname),
      },
      {
        label: t('field.email'),
        value: profile.value?.email,
      },
      {
        label: t('field.role'),
        value: profile.value?.role,
      },

      {
        label: t('field.gender'),
        value: profile.value?.gender,
      },
      {
        label: t('field.address'),
        value: profile.value?.address,
      },
      {
        label: t('field.city'),
        value: profile.value?.city,
      },

      {
        label: t('field.phone'),
        value: profile.value?.phone,
      },

      {
        label: t('field.create_at'),
        value: TIME_HELPER.convertTimeAndDate(profile.value?.createdAt),
      },
    ] as ShInfoItemProps[]
);
</script>
