import type { IUser } from '~/features/user/models';

export interface IBrand {
  id: number;
  title: string;
  taxCode: string;
  address: string;
  email: string;
  phone: string;
  description: string;
  thumbnail: string;
  website: string;
  status: StatusBrand;
  userId: number;
  user: IUser;
}

enum StatusBrand {
  ACTIVE = 'ACTIVE',
  PENDING = 'PENDING',
  BANNED = 'BANNED',
}
