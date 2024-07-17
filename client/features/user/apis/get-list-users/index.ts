import { useQuery } from '@tanstack/vue-query';
import { merge } from 'lodash-es';
import type { IUser } from '../../models';
import { usePaginateReq, useString } from '~/common';
import { requestApi } from '~/common/libs';
import type { DeepPartial, IBaseQueryParams, IMetaResponse, IResponseApi } from '~/common/models';
import { allQueriesKeys, type QueryConfig } from '~/queries';
import type { KycStatusType } from '~/features/kyc/models';

interface Filter {
  search?: string;
  status?: string;
  role?: IUser['role'];
  gender?: number;
  isFeatured?: boolean;
  isModelNotExist?: boolean;
  kycStatus?: KycStatusType;
}
export interface IParamsGetAllUser extends IBaseQueryParams<Filter> {}

interface IGetAllUserRequest {
  params: IParamsGetAllUser;
}

interface IGetAllUserResponse {
  data: IUser[];
  meta: IMetaResponse;
}

export function getAllUsersRequest(req: IGetAllUserRequest) {
  const { params } = req;
  return requestApi<typeof params, IResponseApi<IGetAllUserResponse>>({
    method: 'POST',
    url: 'user/all',
    data: params,
  });
}

interface UseGetAllUsersQueryProps {
  configs?: QueryConfig<typeof getAllUsersRequest>;
  defaultParams?: DeepPartial<IParamsGetAllUser>;
}

export function useGetAllUsersQuery(props: UseGetAllUsersQueryProps = {}) {
  const { page, pageSize } = usePaginateReq();
  const { configs, defaultParams } = props;
  const role = ref('');
  const isModelNotExist = ref(undefined);
  const [search, { onChangeDebounce }] = useString();
  const statusRef = ref<string[]>([]);
  const [kycStatus] = useString();

  const status = ref<string | undefined>(undefined);

  function changeKycStatus(status?: KycStatusType) {
    kycStatus.value = status || '';
  }

  function changeStatus(tStatus: string) {
    status.value = tStatus;
    // const isInclude = statusRef.value.includes(status);
    // // multiple
    // // if (isInclude) {
    // //   statusRef.value = statusRef.value.filter((s) => s !== status);
    // // } else {
    // //   statusRef.value = statusRef.value.concat(status);
    // // }

    // // single

    // if (isInclude) {
    //   statusRef.value = [];
    // } else {
    //   statusRef.value = ([] as string[]).concat(status);
    // }
  }

  const currentParams = computed<IParamsGetAllUser>(() => {
    return merge(defaultParams, {
      paginate: {
        perPage: pageSize.value,
        page: page.value,
      },
      filter: {
        ...(isModelNotExist.value ? { isModelNotExist: isModelNotExist.value } : {}),
        ...(role.value ? { role: role.value } : {}),
        search: search.value,
        status: status.value !== 'ALL' ? status.value : '',
        kycStatus: kycStatus.value || undefined,
      },
      order: {
        createAt: 'desc',
      },
    });
  });

  const queryKeyRef = computed(() => [...allQueriesKeys.user.list.queryKey, currentParams]);

  const query = useQuery({
    queryKey: queryKeyRef,
    queryFn: () =>
      getAllUsersRequest({
        params: currentParams.value,
      }),
    ...configs,
  });

  return {
    page,
    pageSize,
    query,
    role,
    search,
    onChangeDebounce,
    statusRef,
    changeStatus,
    kycStatus,
    changeKycStatus,
  };
}
