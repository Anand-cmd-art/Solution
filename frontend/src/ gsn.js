
import { RelayProvider } from "@opengsn/provider"; // realer is used to sign the gassless transactions

import { ethers } from "ethers"; // web3.js is not wokring well with GSN and Polgon zkEVM
import { getDefaultProvider } from "ethers"; // ethers.js is used to sign the transactions
export async function getGSNSigner() {
  // we are using the detault network ( metamask wallet) 
  const original = window.ethereum;
  if (!original) throw new Error("No wallet found");

  const gsnProvider = await RelayProvider.newProvider({
    provider: original,
    config: { paymasterAddress: process.env.REACT_APP_PAYMASTER }
  }).init();

  return new ethers.BrowserProvider(gsnProvider).getSigner();
}
