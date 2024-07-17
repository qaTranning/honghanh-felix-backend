<template>
  <div>
    <p>intro home card</p>
  </div>
</template>

<script setup lang="ts">
import { useQueryProfile } from '../../../apis';

const { data } = useQueryProfile();
</script>
