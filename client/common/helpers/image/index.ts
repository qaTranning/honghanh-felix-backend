// eslint-disable-next-line import/named
import { isString } from 'lodash';

// export function getUrlImageLow(name?: string) {
//   if (!name) {
//     return '';
//   }

//   const API_ENDPOINT = ENV_FUNC.getApiEndpoint();
//   return API_ENDPOINT + '/local-file/file/' + name;
// }
export function getUrlImageLow(name = '') {
  if (!isString(name)) {
    return '';
  }

  // return `https://storage.googleapis.com/felixzone-041023/${name}`;
  return `https://storage.googleapis.com/felixzone-production/${name}`;
}
