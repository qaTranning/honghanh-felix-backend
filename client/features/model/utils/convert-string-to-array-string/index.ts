export function convertStringToArrayString(value?: string): string[] {
  if (!value) {
    return [];
  }

  const arrayString = value.split(',');

  return arrayString;
}

export function convertArrayStringToString(value?: string[]): string {
  if (!value) {
    return '';
  }

  if (value.length === 0) {
    return '';
  }

  const trimValue = value.map((item) => item.trim());
  return trimValue.join(',');
}
