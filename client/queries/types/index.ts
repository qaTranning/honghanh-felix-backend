import type {
  QueryKey,
  InfiniteData,
  UseInfiniteQueryOptions,
  UseMutationOptions,
  UseQueryOptions,
} from '@tanstack/vue-query';
import type { AxiosResponse } from 'axios';

import type { ExtractFnReturnType, Pretty, AnyFunction, IResponseErrorApi } from '~/common/models';

export type TErrorResponse<TError = any> = AxiosResponse<TError>['data'];

export type QueryConfig<
  QueryFnType extends AnyFunction = AnyFunction,
  TError = IResponseErrorApi,
> = UseQueryOptions<Pretty<ExtractFnReturnType<QueryFnType>>, TErrorResponse<Pretty<TError>>>;

export type MutationConfig<
  MutationFnType extends AnyFunction = AnyFunction,
  TError = IResponseErrorApi,
> = UseMutationOptions<
  Pretty<ExtractFnReturnType<MutationFnType>>,
  TErrorResponse<Pretty<TError>>,
  0 extends Parameters<MutationFnType>['length'] ? void : Parameters<MutationFnType>[0]
>;

export type InfiniteQueryConfig<
  QueryFnType extends AnyFunction = AnyFunction,
  TError extends IResponseErrorApi = IResponseErrorApi,
  TQueryKey extends QueryKey = QueryKey,
  TPageParam extends number = number,
> = Partial<
  UseInfiniteQueryOptions<
    Pretty<ExtractFnReturnType<QueryFnType>>,
    TErrorResponse<Pretty<TError>>,
    Pretty<InfiniteData<Pretty<ExtractFnReturnType<QueryFnType>>, TPageParam>>,
    Pretty<ExtractFnReturnType<QueryFnType>>,
    TQueryKey,
    TPageParam
  >
>;
