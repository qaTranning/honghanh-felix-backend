import { useGetAllUsersQuery } from '~/features/user/apis';

export function useGetAllModelsQuery() {
  const query = useGetAllUsersQuery({
    defaultParams: {
      filter: {
        role: 'MODEL',
      },
    },
  });

  return query;
}
