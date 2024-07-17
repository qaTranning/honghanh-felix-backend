import { useQuery } from '@tanstack/vue-query';
import { merge } from 'lodash-es';
import { usePaginateReq, useString } from '~/common';
import { requestApi } from '~/common/libs';
import type { DeepPartial, IBaseQueryParams, IResponseListApi } from '~/common/models';
import type { IReviewCampaign } from '~/features/campaign/models';
import { allQueriesKeys, type QueryConfig } from '~/queries';

interface Filter {
  search?: string;
  campaignId?: number;
  modelId?: number;
}
export interface IParamsGetAllReview extends IBaseQueryParams<Filter> {}

interface IGetAllReviewRequest {
  params: IParamsGetAllReview;
}

export function getAllReviewsRequest(req: IGetAllReviewRequest) {
  const { params } = req;
  return requestApi<typeof params, IResponseListApi<IReviewCampaign>>({
    method: 'POST',
    url: 'review/all',
    data: params,
  });
}

interface UseGetAllReviewsQueryProps {
  configs?: QueryConfig<typeof getAllReviewsRequest>;
  defaultParams?: DeepPartial<IParamsGetAllReview>;
}

export function useGetAllReviewsQuery(props: UseGetAllReviewsQueryProps = {}) {
  const { page, pageSize } = usePaginateReq();
  const { configs, defaultParams } = props;
  const [search, { onChangeDebounce }] = useString();

  const currentParams = computed(() =>
    merge(
      {
        paginate: {
          perPage: pageSize.value,
          page: page.value,
        },
        filter: {
          ...(search.value && { search: search.value }),
        },
        order: {
          createAt: 'desc',
        },
      },

      defaultParams
    )
  );

  const queryKeyRef = computed(() => [...allQueriesKeys.campaign.review.queryKey, currentParams]);

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
    query,
    search,
    onChangeDebounce,
  };
}
