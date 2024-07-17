export function getColorStatusCampaign(status?: string) {
  switch (status) {
    case 'PROCESSING':
      return 'blue';
    case 'COMPLETED':
      return 'green';
    case 'WAITING_PAYMENT':
      return 'blue';
    case 'PAID':
      return 'green';
    case 'CANCELED':
      return 'red';
    default:
      return '';
  }
}