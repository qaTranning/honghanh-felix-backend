export function formatNumberPrice(
  n: number | null | undefined,
  separator: ',' | '.' = ','
): string {
  if (n && typeof n === 'number') {
    // If the number is not null and is an actual number, format the number
    return n.toString().replace(/\B(?!\.\d*)(?=(\d{3})+(?!\d))/g, separator);
  }
  // Return 0 if the number is null or not a number
  return '0';
}

export const customToFixed = (n: number | string, digits = 2) => {
  const v = Number(n);

  if (Number.isNaN(v)) {
    return 0;
  }

  return parseFloat(v.toFixed(digits));
};
