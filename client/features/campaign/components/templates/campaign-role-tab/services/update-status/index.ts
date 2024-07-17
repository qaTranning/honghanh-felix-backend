import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { Modal } from 'ant-design-vue';
import { useUpdateStatusCampaignRoleMutation } from '~/features/campaign/apis';

export function useCampaignRoleUpdateStatus() {
  const { onMutateAsync } = useUpdateStatusCampaignRoleMutation();
  function showModalConfirmChangeStatus(campaignRoleId: number, status: string) {
    const changeStatus = status === 'COMPLETED' ? 'PROCESSING' : 'COMPLETED';
    const changeStatusName = status === 'COMPLETED' ? 'Đang hoạt động' : 'Hoàn thành';

    Modal.confirm({
      title: 'Bạn có muốn chuyển trạng thái vai trò chiến dịch này?',
      icon: h(ExclamationCircleOutlined),
      content: 'Vai trò chiến dịch sẽ được chuyển sang trạng thái ' + changeStatusName,
      async onOk() {
        try {
          return onMutateAsync({ id: campaignRoleId, status: changeStatus });
        } catch {
          return console.log('Oops errors!');
        }
      },
      onCancel() {},
    });
  }

  return { showModalConfirmChangeStatus };
}
