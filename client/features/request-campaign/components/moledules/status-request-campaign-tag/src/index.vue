<template>
  <div>
    <a-tag :color="getColor($props.status)">{{ getName($props.status) }}</a-tag>
  </div>
</template>

<script setup lang="ts">
import { ERegisterCampaignStatus } from '../../../../models';

defineProps<{ status: ERegisterCampaignStatus }>();

function getName(value: ERegisterCampaignStatus) {
  switch (value) {
    case ERegisterCampaignStatus.REGISTERED:
      return 'REGISTERED';
    case ERegisterCampaignStatus.ACCEPTED:
      return 'ACCEPTED';
    case ERegisterCampaignStatus.REJECTED:
      return 'REJECTED';
    case ERegisterCampaignStatus.COMPLETED:
      return 'COMPLETED';
    case ERegisterCampaignStatus.CANCELED:
      return 'CANCELED';

    default:
      return 'UNKNOW';
  }
}

function getColor(value: ERegisterCampaignStatus) {
  switch (value) {
    case ERegisterCampaignStatus.REGISTERED:
      return 'purple';
    case ERegisterCampaignStatus.ACCEPTED:
      return 'green';
    case ERegisterCampaignStatus.REJECTED:
      return 'red';
    case ERegisterCampaignStatus.COMPLETED:
      return 'blue';
    case ERegisterCampaignStatus.CANCELED:
      return 'gray';

    default:
      return '';
  }
}
</script>
