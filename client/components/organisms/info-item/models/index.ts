import type { CardProps } from 'ant-design-vue';
import type { Key } from 'ant-design-vue/lib/_util/type';
import type { VNode } from 'vue';

export interface ShInfoItemProps {
  label: VNode | string;
  value?: VNode | string;
  key: Key;
}

export interface ShInfoItemListProps {
  values: ShInfoItemProps[];
}

export interface ShInfoItemListCardProps {
  values: ShInfoItemProps[];
  card?: CardProps;
}
