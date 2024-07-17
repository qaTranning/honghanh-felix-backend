export async function navigateToCampaignDetail(campaignId: number) {
  await navigateTo({
    name: 'data-campaign-update',
    query: {
      campaignId,
    },
  });
}
