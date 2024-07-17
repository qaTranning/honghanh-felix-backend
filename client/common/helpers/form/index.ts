import isEmpty from 'lodash-es/isEmpty';

export function handleObjectValuesDirtyForm<TData>(
  values: TData,
  isFieldDirty: (path: any) => boolean
) {
  const returnData: any = {};

  for (const [key, value] of Object.entries(values as Map<string, any>)) {
    if (isFieldDirty(key)) returnData[key] = value;
  }

  return returnData as Partial<TData>;
}

export function handlePayloadUpdateForm<TData>(
  values: TData,
  isFieldDirty: (path: any) => boolean,
  callback?: (value: Partial<TData>) => void
) {
  const payload = handleObjectValuesDirtyForm(values, isFieldDirty);

  if (isEmpty(payload)) {
    return false;
  }

  if (callback) {
    callback(payload);
  }

  return true;
}

interface IMakeDefaultValuesProps<T> {
  values: T;
  types: ('empty-string' | 'undefined' | 'null' | 'empty-array' | 'empty-object')[];
}
export function makeDefaultValues<T extends object>(params: IMakeDefaultValuesProps<T>) {
  const { values, types } = params;

  const returnValues = { ...values } as any;

  for (const [key, value] of Object.entries(values)) {
    if (types.includes('empty-string') && value === '') {
      returnValues[key] = undefined;
    }

    if (types.includes('undefined') && value === undefined) {
      returnValues[key] = undefined;
    }

    if (types.includes('null') && value === null) {
      returnValues[key] = undefined;
    }

    if (types.includes('empty-array') && Array.isArray(value) && value.length === 0) {
      returnValues[key] = undefined;
    }

    if (types.includes('empty-object') && typeof value === 'object' && isEmpty(value)) {
      returnValues[key] = undefined;
    }
  }

  return returnValues;
}
