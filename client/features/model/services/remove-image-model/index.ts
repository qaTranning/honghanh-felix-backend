import { Modal } from 'ant-design-vue';
import { createVNode } from 'vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { useQueryClient } from '@tanstack/vue-query';
import { useMutationRemoveModelImage } from '../../apis/remove-image';
import { allQueriesKeys } from '~/queries';
interface Props {
  onSuccess: () => void;
  id?: number;
}
export function useRemoveImageModel(props: Props) {
  const { onSuccess, id } = props;
  const queryClient = useQueryClient();

  const { mutateAsync } = useMutationRemoveModelImage({
    configs: {
      onSuccess(data, variables, context) {
        console.log('dsadas');
        if (id) {
          queryClient.invalidateQueries(allQueriesKeys.user.detail(id));
        }
      },
    },
  });

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
