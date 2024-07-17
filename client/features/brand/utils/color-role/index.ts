import type { IModel } from '../../models';

export function getColorTagStatus(role: IModel['status']) {
  switch (role) {
    case 'BANNED':
      return 'coral';

    case 'PENDING':
      return 'blue';

    default:
      return 'green';
  }
}
