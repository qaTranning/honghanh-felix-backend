export enum KycStatusEnum {
  NOT_STARTED = 'NOT_STARTED',
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  INVALID = 'INVALID',
}

export type KycStatusType = '' | 'PENDING' | 'VERIFIED' | 'INVALID';
