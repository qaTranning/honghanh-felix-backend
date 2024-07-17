import { Modal } from 'ant-design-vue';
import { createVNode } from 'vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { useMutationRemoveGallery } from '../../apis';

interface Props {
  onSuccess: () => void;
}

export function useRemoveModalGallery(props: Props) {
  const { onSuccess } = props;
  const { mutateAsync } = useMutationRemoveGallery({});

  function showPromiseConfirm(ids: number[]) {
    Modal.confirm({
      title: 'Bạn có muốn xóa?',
      icon: createVNode(ExclamationCircleOutlined),
      content: 'Hành động này không thể khôi phục!',
      async onOk() {
        try {
          await mutateAsync({ body: { ids } });
          return onSuccess();
        } catch {
          return console.log('Oops errors!');
        }
      },
      onCancel() {},
    });
  }
  return { showPromiseConfirm };
}
