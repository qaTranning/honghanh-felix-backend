import type { VNode } from 'vue';

export interface RootModuleLinkCardProps {
  name: string;
  icon: VNode;
  children: {
    name: string;
    routeName: string;
  }[];
}
