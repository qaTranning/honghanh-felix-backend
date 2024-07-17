import type { IUser } from '../../models';
import { profileHandleName } from '~/features/profile';

export function renderOptionUserLabel(user: IUser) {
  return profileHandleName(user.firstname, user.lastname) + ' (' + user.email + ')';
}
