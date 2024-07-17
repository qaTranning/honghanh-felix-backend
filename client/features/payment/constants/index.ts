import type { InvoiceStatusType } from '../models';

export const INVOICE_STATUS_ARRAY: {
  color: string;
  label: string;
  value: InvoiceStatusType;
}[] = [
  {
    color: 'cyan',
    label: 'Chờ người mẫu xác nhận',
    value: 'WAITING_CONFIRM',
  },
  {
    color: 'purple',
    label: 'Chờ phê duyệt',
    value: 'WAITING_APPROVED',
  },

  {
    color: 'green',
    label: 'Đã phê duyệt',
    value: 'APPROVED',
  },

  {
    color: 'blue',
    label: 'Đã thanh toán',
    value: 'PAID',
  },

  {
    color: 'yellow',
    label: 'Hoàn thành',
    value: 'COMPLETED',
  },
  {
    color: 'red',
    label: 'Từ chối',
    value: 'REJECTED',
  },
  {
    color: '#808080',
    label: 'Người mẫu huỷ',
    value: 'CANCELED',
  },
];
