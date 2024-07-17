<template>
  <div class="flex flex-col space-y-2">
    <SelectCampaign v-model:value="campaign" :limitValue="1" />

    <div v-if="campaign.length">
      <p class="font-bold">Chọn người mẫu theo vai trò:</p>

      <a-tree v-if="treeData?.length" v-model:selectedKeys="selectedKeys" :tree-data="treeData">
      </a-tree>
    </div>

    <div>
      <p class="font-bold">Người mẫu chọn:</p>
      <ShInfoItemList v-if="modelValue" :values="renderItem" />
      <p v-else>Chưa chọn mẫu</p>
    </div>
  </div>
</template>
<script lang="ts" setup>
import type { TreeProps } from 'ant-design-vue/es/tree/Tree';
import type { IModel } from '../../models';
import TreeListModel from './components/tree-list-model.vue';
import { useSelectMultiple } from '~/components/moledules';
import { SelectCampaign } from '~/features/campaign';
import type { ICampaign, ICampaignRole } from '~/features/campaign/models';
import { profileHandleName } from '~/features/profile';
import { ShInfoItemList, type ShInfoItemProps } from '~/components/organisms';

interface Props {
  value?: number;
  campaignRoleId?: number;
}

interface Emits {
  (e: 'update:value', v: number | undefined): void;
  (e: 'update:campaignRole', v: number | undefined): void;
}

const props = defineProps<Props>();

const emits = defineEmits<Emits>();

const modelValue = ref<IModel | undefined>(undefined);

function selectModel(model: IModel | undefined, campaignRole: ICampaignRole | undefined) {
  modelValue.value = model;
  emits('update:value', model?.id);

  emits('update:campaignRole', campaignRole?.id);
}

const [campaign] = useSelectMultiple();

const renderItem = computed<ShInfoItemProps[]>(() => [
  {
    key: 'name',
    label: 'Tên mẫu:',
    value: profileHandleName(modelValue.value?.user.firstname, modelValue.value?.user.lastname),
  },
  {
    key: 'email',
    label: 'Email:',
    value: modelValue.value?.user.email,
  },
  {
    key: 'phone',
    label: 'Số điện thoại:',
    value: modelValue.value?.phone || '-',
  },
]);
const treeData = ref<TreeProps['treeData']>([]);

watch(campaign, () => {
  selectModel(undefined, undefined);

  const campaignValue = campaign.value[0] as any;
  const option = campaignValue?.option as ICampaign;
  if (!option) {
    return (treeData.value = []);
  }

  const tOption = option.campaignRoles.map((item) => ({
    title: item.name,
    key: item.id,
    children: item.models?.map((jitem) => ({
      title: h(TreeListModel, {
        name: profileHandleName(jitem.model.user.firstname, jitem.model.user.lastname),
        id: jitem.model.id,
        avatar: jitem.model.user.avatar,
        email: jitem.model.user.email,
        model: jitem.model,
        phone: jitem.model.phone,
        onClick: () => {
          selectModel(jitem.model, item);
        },
      }),
      key: jitem.model.id,
    })),
  }));
  return (treeData.value = tOption);
});

const selectedKeys = ref([]);
</script>
