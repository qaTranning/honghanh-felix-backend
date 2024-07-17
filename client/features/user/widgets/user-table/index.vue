<template>
  <div class="flex flex-col space-y-2">
    <div class="flex flex-row justify-between">
      <div class="w-[300px]">
        <a-input-search
          placeholder="Tìm kiếm người dùng"
          :allow-clear="true"
          @change="(e) => handleSearch(e.target.value || '')"
        />
      </div>

      <div>
        <a-button class="mx-2" type="default" @click="handleRefresh"><reload-outlined /></a-button>
        <a-button type="primary" @click="goToCreate">Tạo mới</a-button>
      </div>
    </div>

    <a-table
      :loading="isLoading.value || isRefreshing"
      :columns="columns"
      :pagination="paginationTable"
      :data-source="dataSource"
      :scroll="{ x: 1500, y: 450 }"
      @change="handleTableChange"
    >
      <!-- <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'operation'">
          <a-row :gutter="[10, 10]">
            <a-col>
              <a-tooltip title="View detail">
                <a-button shape="circle" @click="() => navigateToUserDetail(record.id)">
                  <template #icon><EyeOutlined /></template>
                </a-button>
              </a-tooltip>
            </a-col>
            <a-col>
              <a-tooltip title="Delete">
                <a-popconfirm
                  title="Are you sure to delete user?"
                  @confirm="
                    () => {
                      handleDeleteUser(record.id);
                    }
                  "
                >
                  <a-button shape="circle" style="color: red" type="ghost">
                    <template #icon><DeleteOutlined /></template>
                  </a-button>
                </a-popconfirm>
              </a-tooltip>
            </a-col>
          </a-row>
        </template>
      </template> -->
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { useUserTable } from '@/features/user/services';

async function goToCreate() {
  await navigateTo({ name: 'data-user-create' });
}
const { t } = useI18n();
const {
  columns,
  handleTableChange,
  dataSource,
  paginationTable,
  suspense,
  isLoading,
  handleSearch,
  handleRefresh,
  isRefreshing,
} = useUserTable(t);
await suspense();
</script>
