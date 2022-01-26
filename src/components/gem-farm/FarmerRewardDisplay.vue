<template>
    <div class="mb-2">Estimated claimable: {{ Math.floor((((reward.accruedReward - reward.paidOutReward) / (1000000000)) + (parseInt(gems) * (Math.round(currentTS/1000) - reward.fixedRate.lastUpdatedTs) * 12 / 86400)) * 1000)/1000 }} $MOUNT</div>
    <FixedScheduleDisplay
      :key="farmReward"
      :gems="gems"
      :schedule="reward.fixedRate.promisedSchedule"
    />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import FixedScheduleDisplay from '@/components/gem-farm/FixedScheduleDisplay.vue';
import { parseDate } from '@/common/util';
import numeral from 'numeral';

export default defineComponent({
  components: { FixedScheduleDisplay },
  props: {
    reward: Object,
    farmReward: Object,
    gems: Number,
    title: String,
  },
  data() {
    return {
      currentTS: Date.now()
    }
  },

  created() {
    setInterval(() => {
      this.currentTS = Date.now()
    }, 1000)
  },
  setup() {
    const parseRewardType = (reward: any): string => {
      //returns "variable" or "fixed"
      return Object.keys(reward.rewardType)[0];
    };

    return {
      parseRewardType,
      parseDate,
      numeral,
    };
  },
});
</script>

<style scoped></style>
