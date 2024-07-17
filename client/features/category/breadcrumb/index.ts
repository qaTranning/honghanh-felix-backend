import { type ComponentCustomProperties } from 'vue';
import type { RouteMainBreadcrumbType } from '~/components/moledules/breadcrumb/models';

export function getBreadcrumbCategory(t: ComponentCustomProperties['$t']) {
  const mainBreadcrumb: RouteMainBreadcrumbType[] = [
    {
      name: 'index',
      displayName: t('common.home'),
    },
    {
      name: 'data',
      displayName: t('common.data'),
    },
    {
      name: 'data-category',
      displayName: t('category'),
    },
  ];

  const createBreadcrumb: RouteMainBreadcrumbType[] = [
    ...mainBreadcrumb,
    {
      name: 'data-category-create',
      displayName: t('category.create'),
    },
  ];

  const updateBreadcrumb: RouteMainBreadcrumbType[] = [
    ...mainBreadcrumb,
    {
      name: 'data-category-update',
      displayName: t('category.update'),
    },
  ];

  return { createBreadcrumb, updateBreadcrumb };
}
