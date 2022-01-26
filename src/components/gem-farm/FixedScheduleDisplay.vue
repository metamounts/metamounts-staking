<template>
  <div class="mb-2">Reward rate: {{12 * parseInt(gems)}} $MOUNT /day</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  props: {
    schedule: Object,
    gems: Number,
  },
  setup() {
    return {};
  },
});
</script>

<style scoped></style>