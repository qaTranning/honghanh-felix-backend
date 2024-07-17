import { MailOutlined } from '@ant-design/icons-vue';
import type { ShDashboardLayoutProps } from '@/components/organisms/dashboard-layout/models';
import type { RequestApiConfigType } from '~/common/models';
export const PROFILE_FEATURE_NAME = 'PROFILE';

export const PROFILE_APIS: RequestApiConfigType = {
  DETAIL: { method: 'GET', url: 'profile' },
  UPDATE: { method: 'PATCH', url: 'profile-staff' },
};

export const PROFILE_DASHBOARD_MENU: ShDashboardLayoutProps['menu'] = [
  {
    label: 'Chi tiết',
    key: 'profile-detail',
    icon: h(MailOutlined),
  },
  {
    label: 'Cập nhật',
    key: 'profile-update',
    icon: h(MailOutlined),
  },
  {
    label: 'Cập nhật Password',
    key: 'profile-update-password',
    icon: h(MailOutlined),
  },
];
