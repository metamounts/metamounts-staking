<template>
  <div class="nes-container with-title px-2">
    <p class="title">{{ title }}</p>
    <slot />
    <div class="grid grid-cols-2">
      <NFTCard
        v-for="nft in nfts"
        :key="nft"
        :nft="nft"
        :staked="staked"
        :selectedNFT="selectedNFT"
        @selected="handleSelected"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import NFTCard from '@/components/gem-bank/NFTCard.vue';

export default defineComponent({
  components: { NFTCard },
  emits: ['selected'],
  props: {
    title: String,
    nfts: Array,
    selectedNFT: Object,
    staked: Boolean,
  },
  setup(props, ctx) {
    const handleSelected = (e: any) => {
      ctx.emit('selected', e);
    };
    return {
      handleSelected,
    };
  },
});
</script>

<style scoped></style>
