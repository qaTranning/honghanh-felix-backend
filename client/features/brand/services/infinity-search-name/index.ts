import { useGetAllBrandsQuery } from '../../apis';

export function useInfinitySearchNameBrand() {
  const {
    query: { data, isLoading },
    onChangeDebounce,
  } = useGetAllBrandsQuery({});

  const options = computed(
    () => data.value?.data.data.map((item) => ({ value: item.id, label: item.title }))
  );

  return { options, onChangeDebounce, isLoading };
}
