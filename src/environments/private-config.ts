// Blockchain Faucet
export const faucet = { // needs to be in a private.json file
  faucetAccount: 'Account_Name_To_Fund_New_Accounts',
  activePrivKey: 'activePrivateKey_for_faucetAccount',
  recaptchaSiteKey: null,
  recaptchaSecret: null,
  signupRedirectAddress: 'http://localhost:8080/#/register?token=DUMMY',
  soundacAmount: 0,
  vestAmount: 0,
  soundacMemo: 'Funds from faucet'
};

// Blockchain Faucet Config
export const faucetConfig = {
  private_wif: faucet.activePrivKey,
  account_creation_fee: '0.000001 2.28.0', // use soundac chain property rather than hard coding here, find method in soundac-js to get property blockchain
  account: faucet.faucetAccount,
  newAccountVest: faucet.vestAmount,
  newAccountSoundac: faucet.soundacAmount,
  newAccountSoundacMemo: 'Funds from faucet',
};
