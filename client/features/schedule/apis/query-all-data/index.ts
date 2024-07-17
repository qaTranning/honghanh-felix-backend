import { merge } from 'lodash-es';
import { useQuery } from '@tanstack/vue-query';
import type { ISchedule } from '../../models';
import { usePaginateReq, useString } from '~/common';
import { requestApi } from '~/common/libs';
import type { DeepPartial, IBaseQueryParams, IResponseListApi } from '~/common/models';
import { allQueriesKeys, type QueryConfig } from '~/queries';

interface Filter {
  startDate?: Date;
  endDate?: Date;
  modelId?: number;
  type?: number;
}

export interface IBodyQueryAllSchedule extends IBaseQueryParams<Filter> {}

interface IInput {
  body: IBodyQueryAllSchedule;
}

export function queryAllSchedule(req: IInput) {
  const { body } = req;
  return requestApi<typeof body, IResponseListApi<ISchedule>>({
    method: 'POST',
    url: 'schedule/all',
    data: body,
  });
}

interface UseQueryProps {
  configs?: QueryConfig<typeof queryAllSchedule>;
  defaultParams?: DeepPartial<IBodyQueryAllSchedule>;
}

export function useQueryAllSchedule(props: UseQueryProps = {}) {
  const { page, pageSize } = usePaginateReq();
  const { configs, defaultParams } = props;
  const [search, { onChangeDebounce }] = useString();
  const modelId = ref<number>();

  const currentBody = computed<IBodyQueryAllSchedule>(() =>
    merge(
      {
        paginate: {
          perPage: pageSize.value,
          page: page.value,
        },
        filter: {
          modelId: modelId.value || undefined,
        },
        order: {
          createAt: 'desc',
        },
      },

      defaultParams
    )
  );

  const queryKeyRef = computed(() => [...allQueriesKeys.schedule.list.queryKey, currentBody]);

  const query = useQuery({
    queryKey: queryKeyRef,
    queryFn: () =>
      queryAllSchedule({
        body: currentBody.value,
      }),
    ...configs,
  });

  return {
    page,
    pageSize,
    query,
    onChangeDebounce,
    modelId,
  };
}
