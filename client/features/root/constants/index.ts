import {
  CalendarOutlined,
  CameraOutlined,
  DatabaseOutlined,
  InstagramOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons-vue';
import type { RootModuleLinkCardProps } from '../components';

export const ROOT_DASHBOARD_LINKS: RootModuleLinkCardProps[] = [
  {
    name: 'common.user',
    icon: h(UserOutlined),
    children: [
      { name: 'common.list', routeName: 'data-user' },
      { name: 'common.create', routeName: 'data-user-create' },
    ],
  },
  {
    name: 'common.brand',
    icon: h(CameraOutlined),

    children: [
      { name: 'common.list', routeName: 'data-brand' },
      { name: 'common.create', routeName: 'data-brand-create' },
    ],
  },
  {
    name: 'common.campaign',
    icon: h(CalendarOutlined),

    children: [
      { name: 'common.list', routeName: 'data-campaign' },
      { name: 'common.create', routeName: 'data-campaign-create' },
    ],
  },
  {
    name: 'common.payment',
    icon: h(CalendarOutlined),

    children: [{ name: 'common.list', routeName: 'data-payment' }],
  },
  {
    name: 'common.model',
    icon: h(DatabaseOutlined),

    children: [{ name: 'common.list', routeName: 'data-model' }],
  },
  {
    name: 'common.review',
    icon: h(CameraOutlined),

    children: [
      { name: 'common.list', routeName: 'data-review' },
      { name: 'common.create', routeName: 'data-review-create' },
    ],
  },
  {
    name: 'common.gallery',
    icon: h(InstagramOutlined),

    children: [{ name: 'common.list', routeName: 'data-gallery' }],
  },

  {
    name: 'app_config.app_config',
    icon: h(SettingOutlined),

    children: [
      { name: 'common.list', routeName: 'data-app-config' },
      { name: 'common.create', routeName: 'data-app-config-create' },
    ],
  },
];
