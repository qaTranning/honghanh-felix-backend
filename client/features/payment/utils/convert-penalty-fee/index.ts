import type { PenaltyFeeType } from '../../models';

function isArrayOfObjects(input: any): boolean {
  if (!Array.isArray(input)) {
    return false;
  }
  for (const item of input) {
    if (
      typeof item !== 'object' ||
      item === null ||
      !('label' in item) ||
      !('value' in item) ||
      typeof item.label !== 'string' ||
      typeof item.value !== 'string'
    ) {
      return false;
    }
  }
  return true;
}

export function convertPenaltyFeeToArray(json: string | null): PenaltyFeeType[] {
  if (!json) {
    return [];
  }

  try {
    const obj = JSON.parse(json);

    // check match type

    const isMatch = isArrayOfObjects(obj);

    if (!isMatch) {
      return [];
    }
    return obj;
  } catch (err) {
    return [];
  }
}

export function convertPenaltyFeeToApi(obj?: PenaltyFeeType[]): string | undefined {
  if (!obj) {
    return undefined;
  }
  try {
    // check

    const isCheck = isArrayOfObjects(obj);

    if (!isCheck) {
      return '';
    }

    const newObj = obj.map((item) => ({ label: item.label.trim(), value: item.value.trim() }));

    const myJSON = JSON.stringify(newObj);

    return myJSON;
  } catch (error) {
    return '';
  }
}
