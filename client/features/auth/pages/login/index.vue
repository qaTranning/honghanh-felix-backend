<template>
  <AuthLoginForm :form="form" />
</template>

<script setup lang="ts">
import { AuthLoginForm } from '../../components/templates';
import { useAuthLoginForm } from '@/features/auth/services/login-form';

const form = useAuthLoginForm();
</script>
