export async function navigateToUserDetail(userId: number) {
  await navigateTo({
    name: 'data-user-update',
    query: {
      id: userId,
    },
  });
}
