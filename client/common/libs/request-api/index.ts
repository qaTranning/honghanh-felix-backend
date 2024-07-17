import axios, {
  AxiosError,
  type AxiosRequestConfig,
  type AxiosResponse,
  HttpStatusCode,
  type Method,
} from 'axios';
import { logger } from '../logger';
import { authGetAccessToken, authDeleteAccessToken } from '~/features/auth/utils/token';
import type { IResponseErrorApi } from '~/common/models';
import { API_ENDPOINT, ENV_FUNC } from '~/common/env';

const TIMEOUT_MESSAGE = '🚧🚧🚧 Server connection time out! Try later.';

const baseURL = API_ENDPOINT;

logger.info('Api endpoint: ', baseURL);

const timeout = import.meta.env.API_TIMEOUT; // seconds

export const axiosClient = axios.create({
  // baseURL: getApiEndpoint(),

  timeout: timeout * 1000,
  timeoutErrorMessage: TIMEOUT_MESSAGE,
  headers: {
    accept: 'application/json',
    'Content-Type': 'application/json; charset=utf-8',

    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN',
    responseEncoding: 'utf8',
    responseType: 'json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    Pragma: 'no-cache',
    Expires: '0',
    'Access-Control-Allow-Origin': '*',
    'X-Application': 'web app',
    'X-Version': '1.0.1',
  },

  // paramsSerializer(params) {
  //   return queryString.stringify(params);
  // },

  // withCredentials: true, if using cookies
});

interface IOptionsRequest<TDataReq> extends AxiosRequestConfig<TDataReq> {
  method: Uppercase<Method>;
  isFormData?: boolean;
}

export const requestApi = async <TDataReq = any, TDataRes = any, TDataErr = IResponseErrorApi>(
  options: IOptionsRequest<TDataReq>
) => {
  const { isFormData = false, ...axiosOptions } = options;
  // axiosClient.defaults.withCredentials = true;  //if using cookies
  const accessToken = authGetAccessToken(); // TODO: get access token from local storage

  if (accessToken) axiosClient.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

  logger.debug('Axios options', JSON.stringify(options));

  const onSuccess = (response: AxiosResponse<TDataRes>) => {
    logger.debug('Response API:', JSON.stringify(response));

    return {
      ...response.data,
    };
  };

  const onError = (error: AxiosError<TDataErr>) => {
    logger.error('Axios error:', JSON.stringify(error));

    if (error.code === 'ECONNABORTED') {
      logger.error('Axios Error', TIMEOUT_MESSAGE);
    } else if (
      error?.response?.status === HttpStatusCode.Unauthorized &&
      error.config?.baseURL?.includes(baseURL) &&
      accessToken
    ) {
      logger.error('Axios Error', 'Please, Sign in again!');

      setTimeout(() => {
        window.location.href = '/auth';
        authDeleteAccessToken();
      }, 500);
    }

    return Promise.reject({
      ...error.response?.data,
    });
  };

  const headers = isFormData
    ? { ...axiosOptions.headers, 'Content-Type': 'multipart/form-data' }
    : axiosOptions.headers;

  return axiosClient({
    ...axiosOptions,
    baseURL: ENV_FUNC.getApiEndpoint(),

    headers,
  })
    .then(onSuccess)
    .catch(onError);
};
