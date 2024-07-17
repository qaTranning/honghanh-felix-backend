import { useGetAllCampaignsQuery } from '../../apis';

export function useInfinitySearchNameCampaign() {
  const {
    query: { data, isLoading },
    onChangeDebounce,
    ...rest
  } = useGetAllCampaignsQuery({});

  const options = computed(
    () => data.value?.data.data.map((item) => ({ ...item, value: item.id, label: item.name }))
  );

  return { options, data, onChangeDebounce, isLoading, ...rest };
}
