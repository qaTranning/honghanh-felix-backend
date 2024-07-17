import type { IProfile } from '~/features/profile/models';

export interface WelcomeHomeCardProps {
  profile?: IProfile;
}

export interface WelcomeHomeCardEmits {
  (e: 'start'): void;
}
