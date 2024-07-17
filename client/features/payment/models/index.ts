import type { ICampaignRole } from '~/features/campaign/models';
import type { IModel } from '~/features/model/models';
export interface IPayment {
  id: number;
  invoiceType: InvoiceTypeType;
  description: string | null;
  image: string;
  otHours: string | null;
  otSalary: string | null;
  // amountOfMoney: string | null;
  currency: string;
  campaignRoleId: number;
  modelId: number;
  othersFee: string | null;
  paymentTime: string | null;
  imageLicenseFee: string | null;
  createdAt: string;
  updatedAt: string;
  model: IModel;
  salary: string;
  invoiceStatus: InvoiceStatusType;
  referenceCode: string | null;
  rejectReason: string | null;
  bonusFees: PenaltyFeeType[];
  penaltyFee: PenaltyFeeType[];

  lastUpdatedBy: 'Admin' | 'Model';
  totalSalary: string;
  campaignRole: ICampaignRole;

  workingHours: {
    startDate: string | Date;
    endDate: string | Date;
  }[];

  workingHoursNumber: string;
  paymentPeriod?: string;
}

export type InvoiceStatusType =
  | 'WAITING_CONFIRM' // khi model tạo ra invoice(có quyền sửa)
  | 'WAITING_APPROVED' // khi admin sửa invoice
  | 'PAID'
  | 'APPROVED'
  | 'COMPLETED'
  | 'REJECTED'
  | 'CANCELED';

/*
    Khi admin thấy: WAITING_CONFIRM -> (APPROVED -> PAID | REJECTED  hoặc update thông tin(WAITING_APPROVED)
    CANCELED: model cancel invoice khi dang trong trang thai WAITING_CONFIRM
    Khi model nhận tiền (PAID) => COMPLETED(là để admin biết model đã nhận tiền) thì có thể update mã tham chiếu(admin)
  */
export type InvoiceTypeType = 'NORMAL' | 'OT';

export type PenaltyFeeType = {
  label: string;
  value: string;
};
