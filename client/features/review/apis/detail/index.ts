import { useQuery } from '@tanstack/vue-query';
import { computed } from 'vue';
import { requestApi } from '~/common/libs';
import type { IResponseApi } from '~/common/models';
import type { IReview } from '~/features/review/models';
import { allQueriesKeys, type QueryConfig } from '~/queries';

interface IGetDetailReviewRequest {
  params: {
    id: number;
  };
}

function getDetailReviewRequest(req: IGetDetailReviewRequest) {
  const { params } = req;
  return requestApi<never, IResponseApi<IReview>>({
    method: 'GET',
    url: `review/detail`,
    params: {
      ...params,
    },
  });
}

interface UseGetDetailReviewQueryProps {
  configs?: QueryConfig<typeof getDetailReviewRequest>;
}

export function useQueryDetailReview(props: UseGetDetailReviewQueryProps = {}) {
  const { configs } = props;

  const currentReviewId = ref<number | null>(null);

  const enabledRef = computed(() => !!currentReviewId.value ?? false);

  const reviewQueryKey = computed(
    () => allQueriesKeys.review.detail(currentReviewId.value).queryKey
  );

  const query = useQuery({
    enabled: enabledRef,
    queryKey: reviewQueryKey,

    queryFn: () =>
      getDetailReviewRequest({
        params: { id: currentReviewId.value as number },
      }),
    ...configs,
  });

  return {
    ...query,
    currentReviewId,
  };
}
