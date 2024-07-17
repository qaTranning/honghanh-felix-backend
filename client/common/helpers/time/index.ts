import dayjs from 'dayjs';

import customParseFormat from 'dayjs/plugin/customParseFormat';

import type { Dayjs } from 'dayjs';

/**
 * The function `convertTimeAndDate` takes a time string and returns it formatted as a date and time in
 * the format 'DD-MM-YYYY | hh:mm'.
 * @param {string} time - The `time` parameter is a string representing a specific date and time.
 * @returns a formatted string that represents the input time in the format "DD-MM-YYYY | hh:mm".
 */
export function convertTimeAndDate(time?: string) {
  if (!time) {
    return '';
  }
  return dayjs(time).format('DD-MM-YYYY | hh:mm');
}

export function convertTimeAndDateFormat(format: FormatDateTimeEnum, time?: string) {
  if (!time) {
    return '';
  }
  return dayjs(time).format(format);
}

// eslint-disable-next-line import/no-named-as-default-member
dayjs.extend(customParseFormat);

export enum FormatDateTimeEnum {
  'YYYY-MM-DD' = 'YYYY-MM-DD',
  'DD-MM-YYYY' = 'DD-MM-YYYY',
  'MM-DD-YYYY' = 'MM-DD-YYYY',
  'DD/MM/YYYY' = 'DD/MM/YYYY',
  'YYYY/MM/DD' = 'YYYY/MM/DD',
  'HH:mm - DD/MM/YYYY' = 'HH:mm - DD/MM/YYYY',
  'MMM DD' = 'MMM DD',
  'MMM DD, YYYY' = 'MMM DD, YYYY',
  'MMMM DD, YYYY' = 'MMMM DD, YYYY',
  'hh : mm' = 'hh : mm',
  'DD.MM.YY hh:mm' = 'DD.MM.YY hh:mm',
  'DD-MM-YY hh:mm' = 'DD-MM-YY hh:mm',
  'h:mm a' = 'h:mm a',
  'hh:mm A' = 'hh:mm A',
  'DD' = 'DD',
  'ddd' = 'ddd',
  'HH' = 'HH',
  'HH:mm' = 'HH:mm',
  'hh:mm' = 'hh:mm',
  'DD.MM.YYYY hh:mm A' = 'DD.MM.YYYY hh:mm A',
  'hh:mm A - DD/MM/YYYY' = 'hh:mm A - DD/MM/YYYY',
  'DD-MM-YYYY HH:mm:ss' = 'DD-MM-YYYY HH:mm:ss',
  'DD MMM hh:mm A' = 'DD MMM hh:mm A',
  'YYYY-MM-DD HH:mm' = 'YYYY-MM-DD HH:mm',
  'DD MMM HH:mm' = 'DD MMM HH:mm',
  'DD MMMM YYYY' = 'DD MMMM YYYY',
  'MMMM YYYY' = 'MMMM YYYY',
  'DD-MM-YYYY HH:mm' = 'DD-MM-YYYY HH:mm',
}

type FormatDateTimeType = {
  date: Dayjs;
  format: keyof typeof FormatDateTimeEnum;
};

/**
 * "Format a date string using the dayjs library."
 *
 * The first line of the function is a comment. It's a good idea to include a comment at the top of
 * each function that describes what the function does
 * @param object with 2 keys: date and format
 * @key {Date|string|Dayjs} date - The date you want to format.
 * @key {FormatDateTimeEnum} format - The format you want to use to format the date.
 */
export const formatDate = ({ date, format }: FormatDateTimeType) => {
  if (dayjs(date).isValid()) {
    return dayjs(date).format(FormatDateTimeEnum[format]);
  }

  return '';
};

export function combineToDate(date: Dayjs, time: Dayjs) {
  return new Date(
    dayjs(
      formatDate({
        date,
        format: 'YYYY-MM-DD',
      }) +
        ' ' +
        formatDate({ date: time, format: 'hh:mm' })
    ).toDate()
  );
}
