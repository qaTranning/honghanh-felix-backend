import { Modal } from 'ant-design-vue';
import { createVNode } from 'vue';

import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { useAuthLogoutMutation } from '../../apis';

export function useAuthLogoutConfirmModal() {
  const { mutateAsync } = useAuthLogoutMutation();
  const { t } = useI18n();
  function showLogoutConfirmModal() {
    Modal.confirm({
      title: 'Bạn muốn đăng xuất?',
      icon: createVNode(ExclamationCircleOutlined),
      content: 'Khi bạn ấn nút OK, bạn sẽ đăng xuất khỏi ứng dụng!',
      async onOk() {
        try {
          return await mutateAsync(undefined);
        } catch {
          return console.log('Oops errors!');
        }
      },
      onCancel() {},
    });
  }

  return { showLogoutConfirmModal };
}
