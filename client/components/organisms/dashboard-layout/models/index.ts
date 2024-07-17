import type { VNode } from 'vue';

export interface ShDashboardLayoutProps {
  title: string;
  menu: {
    label: string;
    key: string;
    icon?: VNode;
  }[];
}
