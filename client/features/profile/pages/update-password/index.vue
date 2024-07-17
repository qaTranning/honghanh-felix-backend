<template>
  <a-form layout="vertical" aria-autocomplete="both" @submit="form.onSubmit">
    <ShDashboardFormView title="Đổi mật khẩu">
      <template #header>
        <!-- <p>header</p> -->
      </template>

      <template #body>
        <ProfileUpdatePasswordForm :form="form" />
      </template>
    </ShDashboardFormView>
  </a-form>
</template>

<script setup lang="ts">
import { ProfileUpdatePasswordForm } from '../../components';
import { useProfileUpdatePasswordForm } from '../../services';
import { ShDashboardFormView } from '~/components';

const form = useProfileUpdatePasswordForm();
</script>
