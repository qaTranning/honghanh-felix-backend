import { Modal, Input } from 'ant-design-vue';
import { createVNode } from 'vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { useMutationUpdatePaymentStatus } from '../../apis';

export function useUpdatePaymentStatusModal() {
  const { mutateAsync } = useMutationUpdatePaymentStatus({});

  const rejectReason = ref('');

  function showConfirmReject(id: number) {
    Modal.confirm({
      title: 'Bạn muốn từ chối thanh toán hoá đơn này?',
      icon: createVNode(ExclamationCircleOutlined),
      content: h(Input, {
        placeholder: 'Nhập lý do từ chối',
        'onUpdate:value': (v) => {
          rejectReason.value = v;
        },
      }),
      async onOk() {
        try {
          return await mutateAsync({
            body: {
              invoiceStatus: 'REJECTED',
              rejectReason: rejectReason.value || undefined,
            },
            params: {
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
  function showConfirmApprove(id: number) {
    Modal.confirm({
      title: 'Bạn chắc chắn muốn phê duyệt hoá đơn này?',
      icon: createVNode(ExclamationCircleOutlined),
      //   content: '',
      async onOk() {
        try {
          return await mutateAsync({
            body: {
              invoiceStatus: 'APPROVED',
            },
            params: {
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

  function showConfirmPay(id: number) {
    Modal.confirm({
      title: 'Bạn muốn xác nhận đã thanh toán hoá đơn này?',
      icon: createVNode(ExclamationCircleOutlined),
      //   content: '',
      async onOk() {
        try {
          return await mutateAsync({
            body: {
              invoiceStatus: 'PAID',
            },
            params: {
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

  function showConfirmComplete(id: number) {
    Modal.confirm({
      title: 'Xác nhận hoàn thành thanh toán?',
      icon: createVNode(ExclamationCircleOutlined),
      //   content: '',
      async onOk() {
        try {
          return await mutateAsync({
            body: {
              invoiceStatus: 'PAID',
            },
            params: {
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

  return { showConfirmReject, showConfirmPay, showConfirmComplete, showConfirmApprove };
}
