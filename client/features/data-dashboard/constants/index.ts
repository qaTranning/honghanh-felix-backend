import { h } from 'vue';
import {
  CalendarOutlined,
  UserOutlined,
  SettingOutlined,
  BranchesOutlined,
  DatabaseOutlined,
  InstagramOutlined,
  CommentOutlined,
  CheckSquareOutlined,
  StarOutlined,
  DollarOutlined,
  TagsOutlined,
  PictureOutlined,
} from '@ant-design/icons-vue';

import type { ShDashboardLayoutProps } from '@/components/organisms/dashboard-layout/models';

export const DATA_DASHBOARD_MENU: ShDashboardLayoutProps['menu'] = [
  {
    label: 'Người dùng',
    key: 'data-user',
    icon: h(UserOutlined),
  },
  {
    label: 'Thể loại',
    key: 'data-category',
    icon: h(TagsOutlined),
  },
  {
    label: 'Thương hiệu',
    key: 'data-brand',
    icon: h(BranchesOutlined),
  },
  {
    label: 'Chiến dịch',
    key: 'data-campaign',
    icon: h(CalendarOutlined),
  },
  {
    label: 'Thanh toán',
    key: 'data-payment',
    icon: h(DollarOutlined),
  },
  {
    label: 'Người mẫu',
    key: 'data-model',
    icon: h(DatabaseOutlined),
  },
  {
    label: 'Xác minh người mẫu',
    key: 'data-kyc',
    icon: h(CheckSquareOutlined),
  },
  {
    label: 'Đánh giá',
    key: 'data-review',
    icon: h(StarOutlined),
  },
  {
    label: 'Thư viện ảnh',
    key: 'data-gallery',
    icon: h(InstagramOutlined),
  },
  {
    label: 'Ảnh bìa',
    key: 'data-banner',
    icon: h(PictureOutlined),
  },

  {
    label: 'Chat',
    key: 'data-chat',
    icon: h(CommentOutlined),
  },
  {
    label: 'Cấu hình',
    key: 'data-app-config',
    icon: h(SettingOutlined),
  },
];
