// scripts/fundPaymaster.js
require("dotenv").config();
const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  // 1) Get the target Paymaster address & amount
  const paymasterAddress = process.env.PAYMASTER_ADDRESS;
  if (!paymasterAddress) {
    throw new Error("❌  Missing PAYMASTER_ADDRESS in your .env");
  }

  const amount = process.env.PAYMASTER_FUND_AMOUNT || "1.0"; // default 1 MATIC
  const weiValue = ethers.utils.parseEther(amount);

  // 2) Prepare signer
  const [sender] = await ethers.getSigners();
  console.log(`→ Funding Paymaster ${paymasterAddress} with ${amount} MATIC from ${sender.address}`);

  // 3) Attach to the deployed contract
  const paymaster = await ethers.getContractAt("RiderLedgerPaymaster", paymasterAddress, sender);

  // 4) Call deposit() (inherited from BasePaymaster) to forward the funds into RelayHub
  const tx = await paymaster.deposit({ value: weiValue });
  console.log("   Transaction submitted:", tx.hash);

  // 5) Wait for confirmation
  await tx.wait();
  console.log("✅  Paymaster funded successfully");
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error("❌  Error funding Paymaster:", error);
    process.exit(1);
  });
