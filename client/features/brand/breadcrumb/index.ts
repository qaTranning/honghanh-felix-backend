import { type ComponentCustomProperties } from 'vue';
import type { RouteMainBreadcrumbType } from '~/components/moledules/breadcrumb/models';

export function getBreadcrumbBrand(t: ComponentCustomProperties['$t']) {
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
      name: 'data-brand',
      displayName: t('brand'),
    },
  ];

  const createBreadcrumb: RouteMainBreadcrumbType[] = [
    ...mainBreadcrumb,
    {
      name: 'data-brand-create',
      displayName: t('brand.create'),
    },
  ];

  const updateBreadcrumb: RouteMainBreadcrumbType[] = [
    ...mainBreadcrumb,
    {
      name: 'data-brand-update',
      displayName: t('brand.update'),
    },
  ];

  return { createBreadcrumb, updateBreadcrumb };
}
