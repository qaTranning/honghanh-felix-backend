import type { IUser } from '../../models';

export function getColorTagRole(role: IUser['role']) {
  switch (role) {
    case 'ADMIN':
      return 'coral';

    case 'MODEL':
      return 'blue';

    default:
      return 'green';
  }
}
