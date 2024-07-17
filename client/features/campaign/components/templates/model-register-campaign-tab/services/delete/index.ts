import {
  useDeleteRegisterCampaignMutation,
  type IBodyDeleteRegisterCampaignRequest,
} from '~/features/campaign/apis';

export function useDeleteRegisterCampaignService() {
  const deleteRegisterCampaignMutation = useDeleteRegisterCampaignMutation();

  const handleDeleteRegisterCampaign = (body: IBodyDeleteRegisterCampaignRequest) => {
    deleteRegisterCampaignMutation.mutate({ body });
  };

  return {
    handleDeleteRegisterCampaign,
    deleteRegisterCampaignMutation,
  };
}
