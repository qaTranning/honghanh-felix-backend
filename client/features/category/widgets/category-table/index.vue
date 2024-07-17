<template>
  <div class="flex flex-col space-y-2">
    <div class="flex justify-between">
      <div class="w-[300px]">
        <a-input-search
          placeholder="Tìm kiếm"
          :allow-clear="true"
          @change="(e) => onChangeDebounce(e.target.value || '')"
        />
      </div>

      <div>
        <a-button class="mx-2" type="default" @click="handleRefresh"><reload-outlined /></a-button>
        <a-button type="primary" @click="handleClickCreate">Tạo mới</a-button>
      </div>
    </div>

    <a-table
      :bordered="true"
      :loading="isLoading.value || isRefreshing"
      :columns="columns"
      :pagination="paginationTable"
      :data-source="dataSource"
      @change="handleTableChange"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'operation'">
          <ShTableCellAction
            :onUpdate="() => navigateTo({ name: 'data-category-update', query: { id: record.id } })"
            :onRemove="() => mutateRemove({ params: { id: record.id } })"
          />
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { useMutationRemoveCategory } from '../../apis';
import { useCategoryTable } from '@/features/category/services';
import { ShTableCellAction } from '~/components/organisms';
const {
  mutation: { mutate: mutateRemove },
} = useMutationRemoveCategory({});
const { t } = useI18n();

const {
  columns,
  handleTableChange,
  dataSource,
  paginationTable,
  suspense,
  isLoading,
  search,
  handleRefresh,
  isRefreshing,
  onChangeDebounce,
} = useCategoryTable(t);

await suspense();

function handleClickCreate() {
  navigateTo({ name: 'data-category-create' });
}
</script>
