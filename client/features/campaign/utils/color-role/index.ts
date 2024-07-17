import type { ICampaign } from '../../campaigns';

export function getColorTagRole(role: ICampaign['role']) {
  switch (role) {
    case 'ADMIN':
      return 'coral';

    case 'CAMPAIGN':
      return 'blue';

    default:
      return 'green';
  }
}
