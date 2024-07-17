import { merge } from 'lodash-es';
import { useQuery } from '@tanstack/vue-query';
import type { IRequestCampaign } from '../../models';
import { usePaginateReq, useString } from '~/common';
import { requestApi } from '~/common/libs';
import type { DeepPartial, IBaseQueryParams, IResponseListApi } from '~/common/models';
import { allQueriesKeys, type QueryConfig } from '~/queries';

interface Filter {
  campaignId?: number;
  modelId?: number;
  status?: number;
  name?: string;
  upcomingJob?: boolean;
  startWorkingTime?: string;
  endWorkingTime?: string;
}

export interface IBodyQueryAllRequestCampaign extends IBaseQueryParams<Filter> {}

interface IInput {
  body: IBodyQueryAllRequestCampaign;
}

export function queryAllRegisterCampaign(req: IInput) {
  const { body } = req;
  return requestApi<typeof body, IResponseListApi<IRequestCampaign>>({
    method: 'POST',
    url: 'register-campaign/all',
    data: body,
  });
}

interface UseQueryProps {
  configs?: QueryConfig<typeof queryAllRegisterCampaign>;
  defaultParams?: DeepPartial<IBodyQueryAllRequestCampaign>;
}

export function useQueryAllRequestCampaign(props: UseQueryProps = {}) {
  const { page, pageSize } = usePaginateReq();
  const { configs, defaultParams } = props;
  const [search, { onChangeDebounce }] = useString();
  const modelId = ref<number>();

  const currentBody = computed<IBodyQueryAllRequestCampaign>(() =>
    merge(
      {
        paginate: {
          perPage: pageSize.value,
          page: page.value,
        },
        filter: {
          name: search.value || undefined,
          modelId: modelId.value || undefined,
        },
        order: {
          createAt: 'desc',
        },
      },

      defaultParams
    )
  );

  const queryKeyRef = computed(() => [
    ...allQueriesKeys.requestCampaign.list.queryKey,
    currentBody,
  ]);

  const query = useQuery({
    queryKey: queryKeyRef,
    queryFn: () =>
      queryAllRegisterCampaign({
        body: currentBody.value,
      }),
    ...configs,
  });

  return {
    page,
    pageSize,
    query,
    search,
    onChangeDebounce,
    modelId,
  };
}
