import type { UseProfileUpdateformType } from '~/features/profile/services';

export interface ProfileUpdateFormProps {
  loading?: boolean;
  form: UseProfileUpdateformType;
}

export interface ProfileUpdateFormEmits {
  (e: 'click-dashboard'): void;
  (e: 'click-cancel'): void;
}
