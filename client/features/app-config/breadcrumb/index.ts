import { type ComponentCustomProperties } from 'vue';
import type { RouteMainBreadcrumbType } from '~/components/moledules/breadcrumb/models';

export function getBreadcrumbAppConfig(t: ComponentCustomProperties['$t']) {
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
      name: 'data-app-config',
      displayName: t('app_config.app_config'),
    },
  ];

  const createBreadcrumb: RouteMainBreadcrumbType[] = [
    ...mainBreadcrumb,
    {
      name: 'data-app-config-create',
      displayName: t('app_config.create'),
    },
  ];

  const updateBreadcrumb: RouteMainBreadcrumbType[] = [
    ...mainBreadcrumb,
    {
      name: 'data-app-config-update',
      displayName: t('app_config.update'),
    },
  ];

  const updateStyleBreadcrumb: RouteMainBreadcrumbType[] = [
    ...mainBreadcrumb,
    {
      name: 'data-app-config-update-style',
      displayName: t('app_config.update'),
    },
  ];

  return { createBreadcrumb, updateBreadcrumb, updateStyleBreadcrumb };
}
