// scripts/fundPaymaster.js
require("dotenv").config();
const { ethers } = require("hardhat");

async function main() {
  // 1) Read config
  const paymasterAddress = process.env.PAYMASTER_ADDRESS;
  if (!paymasterAddress) {
    throw new Error("❌ Missing PAYMASTER_ADDRESS in your .env");
  }
  const amount = process.env.PAYMASTER_FUND_AMOUNT || "1.0"; // in MATIC

  // 2) Prepare signer
  const [sender] = await ethers.getSigners();
  console.log(`→ Funding Paymaster ${paymasterAddress} with ${amount} MATIC from ${sender.address}`);

  // 3) Parse to wei
  const wei = ethers.parseEther(amount);

  // 4) Send the native MATIC to the paymaster address
  const tx = await sender.sendTransaction({
    to: paymasterAddress,
    value: wei
  });
  console.log("→ Funding tx submitted:", tx.hash);

  // 5) Await confirmation
  await tx.wait();
  console.log("✅ Paymaster funded successfully");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Error funding Paymaster:", err);
    process.exit(1);
  });