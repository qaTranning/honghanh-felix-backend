import { useDeleteCampaignRoleMutation } from '~/features/campaign/apis';

export function useDeleteCampaignRoleService() {
  const deleteCampaignRoleMutation = useDeleteCampaignRoleMutation();

  const handleDeleteCampaignRole = (campaignRoleId: number) => {
    if (!campaignRoleId) return;

    deleteCampaignRoleMutation.mutate({ id: campaignRoleId });
  };

  return {
    handleDeleteCampaignRole,
    deleteCampaignRoleMutation,
  };
}
