import type { IModel } from '../../models';
import { useGetDetailUserQuery } from '~/features/user/apis';
import type { IUser } from '~/features/user/models';

interface UseGetDetailModelQueryProps {}

export function useGetDetailModelQuery(_props: UseGetDetailModelQueryProps = {}) {
  const { query, currentUserId } = useGetDetailUserQuery();

  const resultUser = computed(() => query.data.value?.data as IUser | undefined);
  const resultModel = computed(() => query.data.value?.data.model as IModel | undefined);

  return {
    query,
    currentModelId: currentUserId,
    resultUser,
    resultModel,
  };
}
