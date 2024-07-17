import type { IModel } from '../../models';

export function getColorTagRole(role: IModel['role']) {
  switch (role) {
    case 'ADMIN':
      return 'coral';

    case 'MODEL':
      return 'blue';

    default:
      return 'green';
  }
}
