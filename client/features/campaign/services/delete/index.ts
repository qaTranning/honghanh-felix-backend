import { useDeleteCampaignMutation } from '../../apis';

export function useDeleteCampaignService() {
  const { mutateAsync, isPending } = useDeleteCampaignMutation();

  async function handleDeleteCampaign(campaignId: number) {
    // mutate(campaignId);
    await mutateAsync({ campaignId });
  }

  return {
    handleDeleteCampaign,
    isPending,
  };
}
