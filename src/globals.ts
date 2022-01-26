import { PublicKey } from '@solana/web3.js';

export const DEFAULTS = {
  CLUSTER: 'mainnet',
  //todo these need to be PER cluster
  GEM_BANK_PROG_ID: new PublicKey(
    process.env.VUE_APP_GEM_BANK_PROG_ID || ""
  ),
  GEM_FARM_PROG_ID: new PublicKey(
    process.env.VUE_APP_GEM_FARM_PROG_ID || ""
  ),
};