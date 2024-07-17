import { useGetAllUsersQuery } from '../../apis';
import type { IUser } from '../../models';
import { renderOptionUserLabel } from '../../utils';

export function useInfinitySearchNameUser(role?: IUser['role']) {
  const {
    query: { data, isLoading },
    onChangeDebounce,
  } = useGetAllUsersQuery({
    defaultParams: {
      filter: {
        role,
      },
    },
  });

  const options = computed(
    () =>
      data.value?.data.data.map((item) => ({ value: item.id, label: renderOptionUserLabel(item) }))
  );
  return { options, onChangeDebounce, isLoading };
}
