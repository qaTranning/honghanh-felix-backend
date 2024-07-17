export async function navigateToModelDetail(modelId: number) {
  await navigateTo({
    name: 'data-model-update',
    query: {
      modelId,
    },
  });
}
