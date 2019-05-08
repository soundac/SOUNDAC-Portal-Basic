import { faucet, faucetConfig } from './private-config';

export const environment = {
  production: true,
  apiUrl: 'https://api.soundacblockchain.com/api/',
  blockchainFaucet: faucet,
  blockchainFaucetConfig: faucetConfig
};
