import { useQuery } from '@tanstack/vue-query';
import { merge } from 'lodash-es';
import { useNumber, usePaginateReq, useString } from '~/common';
import { requestApi } from '~/common/libs';
import type { DeepPartial, IBaseQueryParams, IResponseListApi } from '~/common/models';
import type { IReview } from '~/features/review/models';
import { allQueriesKeys, type QueryConfig } from '~/queries';

interface Filter {
  search?: string;
  modelId?: number;
  campaignId?: number;
}
interface IParamsGetAllReview extends IBaseQueryParams<Filter> {}

interface IGetAllReviewRequest {
  params: IParamsGetAllReview;
}

function getAllReviewsRequest(req: IGetAllReviewRequest) {
  const { params } = req;
  return requestApi<typeof params, IResponseListApi<IReview>>({
    method: 'POST',
    url: 'review/all',
    data: params,
  });
}

interface UseGetAllReviewsQueryProps {
  configs?: QueryConfig<typeof getAllReviewsRequest>;
  defaultParams?: DeepPartial<IParamsGetAllReview>;
}

export function useQueryAllReview(props: UseGetAllReviewsQueryProps = {}) {
  const { page, pageSize } = usePaginateReq();
  const { configs, defaultParams } = props;
  const [search, { onChangeDebounce }] = useString();

  const [modelId] = useNumber();
  const [campaignId] = useNumber();

  const currentParams = computed<IParamsGetAllReview>(() =>
    merge(
      {
        paginate: {
          perPage: pageSize.value,
          page: page.value,
        },
        filter: {
          search: search.value || undefined,
          modelId: modelId.value || undefined,
          campaignId: campaignId.value || undefined,
        },
        order: {
          createAt: 'desc',
        },
      },

      defaultParams
    )
  );

  const queryKeyRef = computed(() => [...allQueriesKeys.review.list.queryKey, currentParams]);

  const query = useQuery({
    queryKey: queryKeyRef,
    queryFn: () =>
      getAllReviewsRequest({
        params: currentParams.value,
      }),
    ...configs,
  });

  return {
    page,
    pageSize,
    ...query,
    search,
    onChangeDebounce,
    modelId,
    campaignId,
  };
}
