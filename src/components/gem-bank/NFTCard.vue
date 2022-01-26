<template>
  <div
    class="flex flex-row w-full"
  >
    <img
      class="my-2 card rounded"
      :src="nft.externalMetadata.image"
      :alt="nft.onchainMetadata.data.name"
    />
      <div class="flex flex-col">
        <div class="flex flex-col mb-auto">
          <p class="mt-4 ml-2 text-xs"> {{nft.onchainMetadata.data.name}} </p>
          <p class="mt-1 ml-2 text-xs"> Rank: {{mint_rank[nft.mint.toBase58()]}} </p>
        </div>
        <div class="flex mb-3 justify-center">
          <button v-if="staked" class="nes-btn is-error text-xs py-1 mx-3" @click="selectNFT">
            Unstake
          </button>
          <button v-else class="nes-btn is-primary text-xs py-1 mx-3" @click="selectNFT">
            Stake
          </button>
        </div>
      </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
export default defineComponent({
  props: {
    nft: { type: Object, required: true },
    staked: Boolean,
    selectedNFT: Object,
  },
  emits: ['selected'],
  setup(props, ctx) {
    const mint_rank = require('@/common/util/mint_rank.json')
    const selected = ref<boolean>(false);
    const toggleSelect = () => {
      if (!(selected.value === true && props.selectedNFT !== props.nft)) {
        selected.value = !selected.value;
      }
      console.log('selected', props.nft.mint.toBase58());
      ctx.emit('selected', {
        nft: props.nft,
        selected: selected.value,
      });
    };

    const selectNFT = () => {
      ctx.emit('selected', {
        nft: props.nft,
        selected: selected.value,
      });
    }

    return {
      mint_rank,
      selected,
      selectNFT,
      toggleSelect,
    };
  },
});
</script>

<style scoped>
img {
  max-width: 100%;
  max-height: 100%;
  height: auto;
  width: auto;
}

.card {
  width: 120px;
  height: 120px;
}
</style>
