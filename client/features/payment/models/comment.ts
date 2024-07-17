import type { IPayment } from '.';
import type { IBaseEntity } from '~/common/models';
import type { IUser } from '~/features/user/models';

export interface IInvoiceComment extends IBaseEntity {
  invoiceId: number;
  userId: number;
  comment: string;
  user: IUser;
  invoice: IPayment;
}
