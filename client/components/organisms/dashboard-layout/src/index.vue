<template>
  <div class="flex w-full flex-row h-full">
    <!-- collaspe nav -->
    <div class="h-full bg-slate-50 border-0 border-r-[1px] border-solid border-gray-500">
      <div v-if="open" class="flex flex-col">
        <div class="border-0 border-b-[1px] border-gray-500 border-solid">
          <div class="flex justify-between items-center pl-2">
            <a-typography-title style="margin: unset" :level="4">{{
              $props.title
            }}</a-typography-title>
            <a-button type="text" shape="circle" :size="'large'" @click="onOpen.setFalse">
              <template #icon> <CloseOutlined /> </template>
            </a-button>
          </div>
        </div>
        <div class="w-[256px]">
          <a-menu
            v-model:openKeys="openKeys"
            v-model:selectedKeys="selectedKeys"
            mode="inline"
            @select="onSelect"
          >
            <a-menu-item v-for="item in menu" :key="item.key">
              <template #icon>
                <component :is="item?.icon" v-if="item?.icon" />
              </template>
              {{ item.label }}
            </a-menu-item>
          </a-menu>
        </div>
      </div>
      <div v-else>
        <a-button type="text" shape="circle" :size="'large'" @click="onOpen.setTrue">
          <template #icon> <MenuOutlined /> </template>
        </a-button>
      </div>
    </div>

    <!-- children -->
    <div class="h-full flex-1 overflow-auto">
      <div class="relative p-2">
        <div class="min-w-[750px]">
          <slot></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CloseOutlined, MenuOutlined } from '@ant-design/icons-vue';
import type { ShDashboardLayoutProps } from '../models';
import { useBoolean } from '~/common';

const { menu } = defineProps<ShDashboardLayoutProps>();

const [open, onOpen] = useBoolean(true);
const openKeys = ref<string[]>([]);

const selectedKeys = ref<string[]>([]);

const route = useRoute();

// watch(selectedKeys, () => {
//   if (selectedKeys.value[0]) {
//     navigateTo({ name: selectedKeys.value[0] });
//   }
// });

function onSelect(e: any) {
  if (e.key) {
    navigateTo({ name: e.key });
  }
}

watch(
  () => route.name,
  () => {
    const routeName = menu.find(({ key }) =>
      route.matched.find((item: { name: string | string[] }) => item.name.includes(key))
    )?.key;

    if (routeName) {
      selectedKeys.value = [routeName.toString()];
    }
  }
);

watch(
  () => route.name,
  () => {
    const routeName = menu.find(({ key }) =>
      route.matched.find((item: { name: string | string[] }) => item.name.includes(key))
    )?.key;

    if (routeName) {
      selectedKeys.value = [routeName.toString()];
    }
  }
);

onMounted(() => {
  // const routeName = route.matched.find((item: { name: string }) =>
  //   menu.find((jitem) => item.name.includes(jitem.key))
  // )?.name;

  const routeName = menu.find(({ key }) =>
    route.matched.find((item: { name: string | string[] }) => item.name.includes(key))
  )?.key;

  if (routeName) {
    selectedKeys.value = [routeName.toString()];
  }
  // if (routeName) {
  //   selectedKeys.value = [routeName.toString()];
  // }
});
</script>
