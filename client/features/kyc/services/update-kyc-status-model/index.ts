import { Input, Modal } from 'ant-design-vue';
import { createVNode } from 'vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { useMutationUpdateKycStatus } from '../../apis';

export function useUpdateKycStatusModal() {
  const { mutateAsync } = useMutationUpdateKycStatus({});

  const kycComment = ref('');

  function showConfirmReject(id: number) {
    kycComment.value = '';
    Modal.confirm({
      title: 'Bạn muốn từ chối xác minh người mẫu này?',
      icon: createVNode(ExclamationCircleOutlined),
      content: h(Input, {
        placeholder: 'Nhập lý do từ chối',
        'onUpdate:value': (v) => {
          kycComment.value = v;
        },
      }),
      async onOk() {
        try {
          return await mutateAsync({
            body: {
              action: 'INVALID',
              kycComment: kycComment.value || undefined,
              id,
            },
          });
        } catch {
          return console.log('Oops errors!');
        }
      },
      onCancel() {},
    });
  }

  function showConfirmVerify(id: number) {
    Modal.confirm({
      title: 'Bạn muốn xác nhận đã xác minh người mẫu này?',
      icon: createVNode(ExclamationCircleOutlined),
      //   content: '',
      async onOk() {
        try {
          return await mutateAsync({
            body: {
              action: 'VERIFIED',
              kycComment: undefined,
              id,
            },
          });
        } catch {
          return console.log('Oops errors!');
        }
      },
      onCancel() {},
    });
  }

  return { showConfirmReject, showConfirmVerify };
}
