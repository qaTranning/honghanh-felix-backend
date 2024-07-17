<template>
  <a-form layout="vertical" aria-autocomplete="both" @submit="form.onSubmit">
    <ShDashboardFormView :loading="form.isLoading.value">
      <template #header>
        <div class="flex flex-row justify-between items-center pb-4">
          <a-typography-title>{{ $t('profile.profile') }}</a-typography-title>

          <div class="flex flex-row space-x-2">
            <a-button type="primary" html-type="submit" :disabled="form.isSubmit.value"
              >Lưu</a-button
            >

            <a-button :disabled="form.isSubmit.value" @click="handleClickCancel">Huỷ</a-button>

            <a-button @click="handleClickDashboard">Trang chủ</a-button>
          </div>
        </div>
      </template>

      <template #body>
        <ProfileUpdateForm :form="form" />
      </template>
    </ShDashboardFormView>
  </a-form>
</template>

<script setup lang="ts">
import { Modal } from 'ant-design-vue';
import { createVNode } from 'vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { ProfileUpdateForm } from '../../components';
import { useProfileUpdateform } from '../../services';
import { ShDashboardFormView } from '~/components/organisms';

const form = useProfileUpdateform();

function handleClickDashboard() {
  navigateTo({ name: 'data' });
}

const handleClickCancel = () => {
  Modal.confirm({
    title: 'Bạn có muốn xóa?',
    icon: createVNode(ExclamationCircleOutlined),
    content: createVNode('div', { style: 'color:red;' }, 'Some descriptions'),
    onOk() {
      form.resetForm();
    },
    onCancel() {},
    class: 'test',
  });
};
</script>
