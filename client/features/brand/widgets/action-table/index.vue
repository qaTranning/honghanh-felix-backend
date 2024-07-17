<template>
  <div class="flex flex-row justify-between">
    <a-form
      class="w-full"
      :model="formState"
      name="basic"
      :wrapper-col="{ span: 10 }"
      autocomplete="off"
      @finish="onFinish"
      @finishFailed="onFinishFailed"
    >
      <a-form-item label="Tìm kiếm" name="search">
        <a-input v-model:value="formState.search" />
      </a-form-item>
    </a-form>

    <a-button type="primary" @click="goToCreate">Tạo mới</a-button>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';

const formState = reactive<any>({
  search: '',
});

async function goToCreate() {
  await navigateTo({ name: 'data-brand-create' });
}

const onFinish = (values: any) => {
  console.log('Success:', values);
};

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo);
};
</script>
