<template>
  <div class="m-auto w-[1150px] max-w-[98%] pt-6">
    <div class="grid grid-cols-3 gap-2">
      <RootWelcomHomeCard :profile="data?.data" @start="handleClickStart" />

      <RootRecentVisitedCard class="col-span-2" :modules="ROOT_DASHBOARD_LINKS" />

      <div class="col-span-2">
        <NewCampaignHomeCard />
      </div>
      <NewModelHomeCard />
    </div>
  </div>
</template>

<script setup lang="ts">
import { RootWelcomHomeCard, RootRecentVisitedCard } from '../../components';

import { ROOT_DASHBOARD_LINKS } from '../../constants';
import { NewCampaignHomeCard } from '~/features/campaign';
import { NewModelHomeCard } from '~/features/model';

import { useQueryProfile } from '~/features/profile';
const { data } = useQueryProfile();

function handleClickStart() {
  navigateTo({ name: 'data' });
}
</script>
