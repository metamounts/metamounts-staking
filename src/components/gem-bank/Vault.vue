<template>
  <!--control buttons-->
  <loading :active='isLoading' :is-full-page="fullPage" :loader='loader' />
  <div class="mb-10 flex justify-center">
    <button
      v-if="initialWalletNFTs.length > 0"
      class="nes-btn is-primary mr-5"
      @click="depositAllNFTOnChain"
    >
      Stake All
    </button>
    <button
      v-if="initialVaultNFTs.length > 0"
      class="nes-btn is-error mr-5"
      @click="withdrawAllNFTOnChain"
    >
      Unstake All
    </button>
    <slot />
  </div>

  <!--wallet + vault view-->
  <div class="flex items-stretch space-x-4">
    <!--left-->
    <NFTGrid
      title="Your wallet"
      class="flex-1"
      :nfts="initialWalletNFTs"
      :selectedNFT="selectedNFT"
      :staked="false"
      @selected="depositNFTOnChain"
    />
    <!--right-->
    <NFTGrid
      v-if="bank && vault"
      title="Staked MetaMounts"
      class="flex-1"
      :nfts="initialVaultNFTs"
      :selectedNFT="selectedNFT"
      :staked="true"
      @selected="withdrawNFTOnChain"
    />
  </div>
</template>

<script lang="tsx">
import { defineComponent, onMounted, ref, watch } from 'vue';
import NFTGrid from '@/components/gem-bank/NFTGrid.vue';
import ArrowButton from '@/components/ArrowButton.vue';
import useWallet from '@/composables/wallet';
import useCluster from '@/composables/cluster';
import {
  getNFTMetadataForMany,
  getNFTsByOwner,
  INFT,
} from '@/common/web3/NFTget';
import { initGemBank } from '@/common/gem-bank';
import { initGemFarm } from '@/common/gem-farm';
import { PublicKey } from '@solana/web3.js';
import { getListDiffBasedOnMints, removeManyFromList } from '@/common/util';
import { BN } from '@project-serum/anchor';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';

export default defineComponent({
  components: { ArrowButton, NFTGrid, Loading },
  props: {
    vault: String,
    farmerAcc: Object,
    farmerState: String
  },
  emits: ['selected-wallet-nft', 'fetchFarm', 'fetchFarmer', 'flash-deposit-wallet-nft'],
  setup(props, ctx) {
    const { wallet, getWallet } = useWallet();
    const { cluster, getConnection } = useCluster();

    // --------------------------------------- loading

    //current walet/vault state
    const isLoading = ref<boolean>(false);

    // --------------------------------------- state

    //current walet/vault state
    const currentWalletNFTs = ref<INFT[]>([]);
    const currentVaultNFTs = ref<INFT[]>([]);
    //initial walet/vault state
    const initialWalletNFTs = ref<INFT[]>([]);
    const initialVaultNFTs = ref<INFT[]>([]);
    //selected but not yet moved over in FE
    const selectedNFT = ref<INFT>();
    //selected wallet or vault
    const selectedLocation = ref<String>();

    // --------------------------------------- populate initial nfts

    const populateWalletNFTs = async () => {
      // zero out to begin with
      currentWalletNFTs.value = [];
      initialWalletNFTs.value = [];

      if (getWallet()) {
        currentWalletNFTs.value = await getNFTsByOwner(
          getWallet()!.publicKey!,
          getConnection()
        );
        initialWalletNFTs.value = [...currentWalletNFTs.value];
      }
    };

    const populateVaultNFTs = async () => {
      // zero out to begin with
      currentVaultNFTs.value = [];
      initialVaultNFTs.value = [];

      const foundGDRs = await gb.fetchAllGdrPDAs(vault.value);
      if (foundGDRs && foundGDRs.length) {
        gdrs.value = foundGDRs;
        console.log(`found a total of ${foundGDRs.length} gdrs`);

        const mints = foundGDRs.map((gdr: any) => {
          return { mint: gdr.account.gemMint };
        });
        currentVaultNFTs.value = await getNFTMetadataForMany(
          mints,
          getConnection()
        );

        initialVaultNFTs.value = [...currentVaultNFTs.value];
        console.log(
          `populated a total of ${currentVaultNFTs.value.length} vault NFTs`
        );
      }
    };

    const updateVaultState = async () => {
      vaultAcc.value = await gb.fetchVaultAcc(vault.value);
      bank.value = vaultAcc.value.bank;
    };

    watch([wallet, cluster], async () => {
      gb = await initGemBank(getConnection(), getWallet()!);
      gf = await initGemFarm(getConnection(), getWallet()!);

      //populate wallet + vault nfts
      await Promise.all([populateWalletNFTs(), populateVaultNFTs()]);
    });

    onMounted(async () => {
      gb = await initGemBank(getConnection(), getWallet()!);
      gf = await initGemFarm(getConnection(), getWallet()!);

      //prep vault + bank variables
      vault.value = new PublicKey(props.vault!);
      await updateVaultState();

      //populate wallet + vault nfts
      await Promise.all([populateWalletNFTs(), populateVaultNFTs()]);
    });

    // --------------------------------------- moving nfts

    const resetSelectedNft = () => {
      selectedLocation.value = undefined
      selectedNFT.value = undefined
    }

    const depositNFTOnChain = async(e: any) => {
      const selectedWalletNFT = e.nft
      const anySelectNFT = (selectedWalletNFT as any)
      if (props.farmerState === "staked") {
          ctx.emit('flash-deposit-wallet-nft', selectedWalletNFT);
      } else {
        const creator = new PublicKey(
          (anySelectNFT.onchainMetadata as any).data.creators[0].address
        );
        await depositGem(anySelectNFT.mint, creator, anySelectNFT.pubkey!);
      }
      await Promise.all([populateWalletNFTs(), populateVaultNFTs()]);
    }

    const depositAllNFTOnChain = async() => {
      isLoading.value = true;
      try {
        const farm = ref<string>(process.env.VUE_APP_GEM_FARM_PK || "");
        const { txSig } = await gf.stakeAllGemsWallet(
          bank.value,
          vault.value,
          new BN(1),
          initialWalletNFTs.value.map(x => x.mint),
          initialWalletNFTs.value.map(x => x.pubkey!),
          initialWalletNFTs.value.map(x => {
            return new PublicKey((x.onchainMetadata as any).data.creators[0].address)
          }),
          new PublicKey(farm.value!),
          props.farmerState === "staked"
        );
        console.log('deposit done', txSig);
      } catch (err) {
        console.log(err)
      } finally {
        ctx.emit('fetchFarm');
        ctx.emit('fetchFarmer');
        await Promise.all([populateWalletNFTs(), populateVaultNFTs()]);
        isLoading.value = false;
      }
    };


    const withdrawNFTOnChain = async(e: any) => {
      const selectedVaultNFT = e.nft;
      const anySelectNFT = (selectedVaultNFT as any);
      await withdrawGem(anySelectNFT.mint);
    }

    const withdrawAllNFTOnChain = async() => {
      isLoading.value = true;
      try {
        const farm = ref<string>(process.env.VUE_APP_GEM_FARM_PK || "");
        const { txSig } = await gf.unstakeAllGemsWallet(
          bank.value,
          vault.value,
          new BN(1),
          initialVaultNFTs.value.map(x => x.mint),
          new PublicKey(farm.value!)
        );
        console.log('withdrawal done', txSig);
      } catch (err) {
        console.log(err)
      } finally {
        ctx.emit('fetchFarm');
        ctx.emit('fetchFarmer');
        await Promise.all([populateWalletNFTs(), populateVaultNFTs()]);
        isLoading.value = false;
      }
    };

    const handleNFTWalletSelected = (e: any) =>{
      if (e.selected) {
        selectedLocation.value = "wallet"
      }else{
        selectedLocation.value = undefined
      }
      handleNFTSelected(e)
    }
    const handleNFTVaultSelected = (e: any) =>{
      if (e.selected) {
        selectedLocation.value = "vault"
      }else{
        selectedLocation.value = undefined
      }
      handleNFTSelected(e)
    }

    const handleNFTSelected = (e: any) => {
      if (e.selected) {
        selectedNFT.value = e.nft
        console.log(selectedNFT.value)
        if (selectedLocation.value === "wallet"){
          ctx.emit('selected-wallet-nft', selectedNFT.value);
        } else {
          ctx.emit('selected-wallet-nft', null);
        }
      } else {
        selectedNFT.value = undefined
        ctx.emit('selected-wallet-nft', null);
      }
    };

    //todo jam into single tx
    const moveNFTOnChain = async () => {
      const anySelectNFT = (selectedNFT.value as any)
      if (selectedLocation.value !== "wallet") {
        await withdrawGem(anySelectNFT.mint);
      }else{
        const creator = new PublicKey(
          //todo currently simply taking the 1st creator
          (anySelectNFT.onchainMetadata as any).data.creators[0].address
        );
        await depositGem(anySelectNFT.mint, creator, anySelectNFT.pubkey!);
      }
      resetSelectedNft();
      await Promise.all([populateWalletNFTs(), populateVaultNFTs()]);
    };

    // --------------------------------------- gem farm

    let gf: any;

    // --------------------------------------- gem bank

    let gb: any;
    const bank = ref<PublicKey>();
    const vault = ref<PublicKey>();
    const vaultAcc = ref<any>();
    const gdrs = ref<PublicKey[]>([]);
    const vaultLocked = ref<boolean>(false);

    const depositGem = async (
      mint: PublicKey,
      creator: PublicKey,
      source: PublicKey
    ) => {
      isLoading.value = true;
      try {
        const farm = ref<string>(process.env.VUE_APP_GEM_FARM_PK || "");
        const { txSig } = await gf.depositGemStakeWallet(
          bank.value,
          vault.value,
          new BN(1),
          mint,
          source,
          creator,
          new PublicKey(farm.value!)
        );
        console.log('deposit done', txSig);
      } catch (err) {
        console.log(err)
      } finally {
        ctx.emit('fetchFarm');
        ctx.emit('fetchFarmer');
        await Promise.all([populateWalletNFTs(), populateVaultNFTs()]);
        isLoading.value = false;
      }
    };

    const withdrawGem = async (mint: PublicKey) => {
      isLoading.value = true;
      try {
        const farm = ref<string>(process.env.VUE_APP_GEM_FARM_PK || "");
        const { txSig } = await gf.unstakeWithdrawGemWallet(
          bank.value,
          vault.value,
          new BN(1),
          mint,
          new PublicKey(farm.value!),
          props.farmerAcc!.gemsStaked
        );
        console.log('withdrawal done', txSig);
      } catch (err) {
        console.log(err)
      } finally {
        ctx.emit('fetchFarm');
        ctx.emit('fetchFarmer');
        await Promise.all([populateWalletNFTs(), populateVaultNFTs()]);
        isLoading.value = false;
      }
    };

    // --------------------------------------- return

    return {
      isLoading,
      fullPage: true,
      loader: 'bars',
      wallet,
      initialWalletNFTs,
      initialVaultNFTs,
      selectedNFT,
      selectedLocation,
      handleNFTSelected,
      withdrawNFTOnChain,
      depositNFTOnChain,
      handleNFTVaultSelected,
      handleNFTWalletSelected,
      withdrawAllNFTOnChain,
      depositAllNFTOnChain,
      moveNFTOnChain,
      bank,
      // eslint-disable-next-line vue/no-dupe-keys
      vault,
      vaultLocked,
    };
  },
});
</script>

<style scoped>
.locked {
  @apply text-center bg-black text-white;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0.7;
  z-index: 10;
}
</style>
