<template>
  <loading :active='isLoading' :is-full-page="fullPage" :loader='loader' />
  <div v-if="!wallet" class="flex justify-center mt-20">
    <div class="justify-center w-1/2 flex flex-col">
      <div class="w-full mx-auto rounded-lg border-2 border-sky-blue p-5 shadow-lg">
        <div class="text-center mt-2 text-2xl font-medium">Metamounts Staking</div>
        <div v-if="farmAcc" class="mt-5 pl-2 font-light">Total Metamounts Staked: {{ farmAcc.gemsStaked }}</div>
        <div v-else class="mt-5 pl-2 font-light">Metamounts Staked: -</div>
        <div v-if="farmAcc" class="mt-1 pl-2 font-light">% of Metamounts Staked: {{ Math.floor((parseInt(farmAcc.gemsStaked)/1101.0 * 100 ) * 10)/10 }}%</div>
        <div v-else class="mt-1 pl-2 font-light">% of Metamounts Staked: -</div>
        <div v-if="farmAcc && magicEdenFloor && solPrice" class="mt-1 pl-2 font-light">Minimum Value Locked: ${{ (Math.floor((parseInt(farmAcc.gemsStaked) * magicEdenFloor * solPrice) * 100))/100 }}</div>
        <div v-else class="mt-1 pl-2 font-light">Minimum Value Locked: -</div>
      </div>
      <ConfigPane />
    </div>
  </div>
  <div v-else>
    <!--farm address-->
    <div v-if="farmerAcc">
      <FarmerDisplay
        :key="farmerAcc"
        :farm="farm"
        :farmAcc="farmAcc"
        :farmer="farmer"
        :farmerAcc="farmerAcc"
        class="mb-10"
        @refresh-farmer="handleRefreshFarmer"
      />
      <Vault
        :key="farmerAcc"
        class="mb-10"
        :vault="farmerAcc.vault.toBase58()"
        :farmerAcc="farmerAcc"
        :farmerState="farmerState"
        @selected-wallet-nft="handleNewSelectedNFT"
        @flash-deposit-wallet-nft="flashDepositSelectedNFT"
        @fetchFarm="fetchFarn"
        @fetchFarmer="fetchFarmer"
      >
        <button v-if="(((farmerAcc.rewardA.accruedReward - farmerAcc.rewardA.paidOutReward) / (1000000000)) + (parseInt(farmerAcc.gemsStaked) * (Math.round(currentTS/1000) - farmerAcc.rewardA.fixedRate.lastUpdatedTs) * 12 / 86400)) > 0" class="nes-btn is-warning" @click="claim">
          Claim $MOUNT
        </button>
      </Vault>
    </div>
    <div v-else> 
      <div class="mx-auto text-center mt-20 mb-5 w-3/4">
        Staking account associated to your wallet is not found... Create an account to start staking!
      </div>
      <div class="w-full text-center">
        <button class="nes-btn is-primary" @click="initFarmer">
          Create Account
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, nextTick, onMounted, ref, watch } from 'vue';
import useWallet from '@/composables/wallet';
import useCluster from '@/composables/cluster';
import { initGemFarm } from '@/common/gem-farm';
import { PublicKey } from '@solana/web3.js';
import ConfigPane from '@/components/ConfigPane.vue';
import FarmerDisplay from '@/components/gem-farm/FarmerDisplay.vue';
import Vault from '@/components/gem-bank/Vault.vue';
import { INFT } from '@/common/web3/NFTget';
import { stringifyPKsAndBNs } from '@/clients/gem-common/types';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
import axios from 'axios';

export default defineComponent({
  components: { Vault, FarmerDisplay, ConfigPane, Loading},

  created() {
    setInterval(() => {
      this.currentTS = Date.now()
    }, 1000)
  },

  setup() {
    const { wallet, getWallet } = useWallet();
    const { cluster, getConnection } = useCluster();

    let gf: any;
    let initGf: any;
    watch([wallet, cluster], async () => {
      await freshStart();
    });

    // --------------------------------------- Locked up  value
    const magicEdenFloor = ref<Number>();
    const solPrice = ref<Number>();

    // --------------------------------------- loading

    //current walet/vault state
    const isLoading = ref<boolean>(false);

    // --------------------------------------- farmer details
    const farm = ref<string>(process.env.VUE_APP_GEM_FARM_PK || "");
    const farmAcc = ref<any>();

    const farmerIdentity = ref<string>();
    const farmerAcc = ref<any>();
    const farmerState = ref<string>();

    const availableA = ref<string>();
    const availableB = ref<string>();

    //needed in case we switch in from another window
    onMounted(async () => {
      await freshStart();
      const meRes = (await axios.get('https://api-mainnet.magiceden.io/rpc/getCollectionEscrowStats/metamounts/')).data
      const solPriceRes = (await axios.get('https://data.messari.io/api/v1/assets/solana/metrics')).data
      magicEdenFloor.value = meRes.results.floorPrice/1000000000
      solPrice.value = solPriceRes.data.market_data.price_usd
    });

    const updateAvailableRewards = async () => {
      availableA.value = farmerAcc.value.rewardA.accruedReward
        .sub(farmerAcc.value.rewardA.paidOutReward)
        .toString();
      availableB.value = farmerAcc.value.rewardB.accruedReward
        .sub(farmerAcc.value.rewardB.paidOutReward)
        .toString();
    };

    const fetchInitFarn = async () => {
      farmAcc.value = await initGf.fetchFarmAcc(new PublicKey(farm.value!));
      console.log(
        `farm found at ${farm.value}:`,
        stringifyPKsAndBNs(farmAcc.value)
      );
    };

    const fetchFarn = async () => {
      farmAcc.value = await gf.fetchFarmAcc(new PublicKey(farm.value!));
      console.log(
        `farm found at ${farm.value}:`,
        stringifyPKsAndBNs(farmAcc.value)
      );
    };

    const fetchFarmer = async () => {
      const [farmerPDA] = await gf.findFarmerPDA(
        new PublicKey(farm.value!),
        getWallet()!.publicKey
      );
      farmerIdentity.value = getWallet()!.publicKey?.toBase58();
      farmerAcc.value = await gf.fetchFarmerAcc(farmerPDA);
      farmerState.value = gf.parseFarmerState(farmerAcc.value);
      await updateAvailableRewards();
      console.log(
        `farmer found at ${farmerIdentity.value}:`,
        stringifyPKsAndBNs(farmerAcc.value)
      );
    };

    const freshStart = async () => {

      try {
        initGf = await initGemFarm(getConnection());
        await fetchInitFarn();
      } catch (e) {
          console.log(`farm with PK ${farm.value} not found :(`);
      }
      if (getWallet() && getConnection()) {
        gf = await initGemFarm(getConnection(), getWallet()!);
        farmerIdentity.value = getWallet()!.publicKey?.toBase58();

        //reset stuff
        farmAcc.value = undefined;
        farmerAcc.value = undefined;
        farmerState.value = undefined;
        availableA.value = undefined;
        availableB.value = undefined;

        try {
          await fetchFarn();
          await fetchFarmer();
        } catch (e) {
          console.log(`farm with PK ${farm.value} not found :(`);
        }
      }
    };

    const initFarmer = async () => {
      isLoading.value = true;
      try {
        await gf.initFarmerWallet(new PublicKey(farm.value!));
        await fetchFarmer();
      } catch (err) {
        console.log(err)
      } finally {
        isLoading.value = false;
      }
    };

    // --------------------------------------- staking

    const claim = async () => {
      isLoading.value = true;
      try {
        await gf.claimWallet(
          new PublicKey(farm.value!),
          new PublicKey(farmAcc.value.rewardA.rewardMint!),
          new PublicKey(farmAcc.value.rewardB.rewardMint!)
        );
      } catch (err) {
        console.log(err)
      } finally {
        await fetchFarmer();
        isLoading.value = false;

      }
    };

    const handleRefreshFarmer = async () => {
      await fetchFarmer();
    };

    // --------------------------------------- adding extra gem
    const selectedNFT = ref<INFT>();

    const resetSelectedNft = () => {
      selectedNFT.value = undefined
    }

    const handleNewSelectedNFT = (newSelectedNFT: INFT) => {
      console.log(`selected NFT`);
      selectedNFT.value = newSelectedNFT;
    };

    const addSingleGem = async (
      gemMint: PublicKey,
      gemSource: PublicKey,
      creator: PublicKey
    ) => {
      await gf.flashDepositWallet(
        new PublicKey(farm.value!),
        '1',
        gemMint,
        gemSource,
        creator
      );
      resetSelectedNft();
    };

    const flashDepositSelectedNFT = async (newSelectedNFT: INFT) => {
      selectedNFT.value = newSelectedNFT;
      await addGem();
    };

    const addGem = async () => {
      isLoading.value = true;
      try {
        const anySelectNFT = (selectedNFT.value as any)
        const creator = new PublicKey(
          (anySelectNFT.onchainMetadata as any).data.creators[0].address
        );
        console.log('creator is', creator.toBase58());
        await addSingleGem(anySelectNFT.mint, anySelectNFT.pubkey!, creator);
        
        console.log(`added another ${anySelectNFT.length} gems into staking vault`);
      } catch (err) {
        console.log(err)
      } finally {
        await fetchFarmer();
        isLoading.value = false;
      }
    };

    return {
      currentTS: Date.now(),
      isLoading,
      fullPage: true,
      loader: 'bars',
      wallet,
      farm,
      farmAcc,
      farmer: farmerIdentity,
      farmerAcc,
      farmerState,
      availableA,
      availableB,
      initFarmer,
      claim,
      handleRefreshFarmer,
      flashDepositSelectedNFT,
      selectedNFT,
      handleNewSelectedNFT,
      addGem,
      fetchFarn,
      fetchFarmer,
      magicEdenFloor,
      solPrice
    };
  },
});
</script>

<style scoped></style>
