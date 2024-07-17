import { merge } from 'lodash-es';
import { useQuery } from '@tanstack/vue-query';
import type { IGallery } from '../../models';
import { usePaginateReq, useString } from '~/common';
import { requestApi } from '~/common/libs';
import type { DeepPartial, IRequestListBody, IResponseListApi } from '~/common/models';
import { allQueriesKeys, type QueryConfig } from '~/queries';

interface IRequest {
  body: BodyType;
}

type BodyType = IRequestListBody<{ name: string }>;

function queryFunc(req: IRequest) {
  const { body } = req;
  return requestApi<typeof body, IResponseListApi<IGallery>>({
    method: 'POST',
    url: 'gallery/all',
    data: body,
  });
}

interface IProps {
  configs?: QueryConfig<typeof queryFunc>;
  defaultParams?: DeepPartial<BodyType>;
}

export function useQueryAllGallery(props: IProps = {}) {
  const { page, pageSize } = usePaginateReq();
  const { configs, defaultParams } = props;
  const [name, { onChangeDebounce }] = useString();

  const variable = computed<BodyType>(() =>
    merge(
      {
        paginate: {
          perPage: pageSize.value,
          page: page.value,
        },
        filter: { name: name.value },
      },

      defaultParams
    )
  );

  const queryKeyRef = computed(() => [...allQueriesKeys.gallery.list.queryKey, variable]);

  const query = useQuery({
    queryKey: queryKeyRef,
    queryFn: () =>
      queryFunc({
        body: variable.value,
      }),
    ...configs,
  });

  const listData = computed(() => query.data.value?.data.data || []);
  const meta = computed(() => query.data.value?.data.meta);

  return {
    page,
    pageSize,
    onChangeDebounce,
    name,
    listData,
    meta,
    ...query,
  };
}
