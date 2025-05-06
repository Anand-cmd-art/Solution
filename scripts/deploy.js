// scripts/deploy.js
require("dotenv").config();
const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
  // 1) Grab your deployer account
  const [deployer] = await ethers.getSigners();
  
  // 2) Fetch its raw balance & format it
  const rawBal = await ethers.provider.getBalance(deployer.address);
  const bal = ethers.formatEther(rawBal);
  console.log("Deploying with:", deployer.address);
  console.log("Balance:", bal, "ETH");
  
  // 3) If formatted balance is zero, abort
  if (Number(bal) === 0) {
    throw new Error("❌ Deployer has no funds!");
  }
  
  // 4) Deploy MinimalForwarder
  const Forwarder = await ethers.getContractFactory("MinimalForwarder");
  const forwarder = await Forwarder.deploy();
  await forwarder.deploymentTransaction().wait();
  console.log("→ Forwarder deployed to:", await forwarder.getAddress());
  
  // 5) Deploy RideLedger
  const Ledger = await ethers.getContractFactory("RideLedger");
  const ledger = await Ledger.deploy(await forwarder.getAddress(), deployer.address);
  await ledger.deploymentTransaction().wait();
  console.log("→ RideLedger deployed to:", await ledger.getAddress());
  
  // 6) Deploy OpenFarePaymaster
  const Paymaster = await ethers.getContractFactory("OpenFarePaymaster");
  const paymaster = await Paymaster.deploy(
    process.env.GSN_RELAY_HUB,
    await forwarder.getAddress(),
    await ledger.getAddress()
  );
  await paymaster.deploymentTransaction().wait();
  console.log("→ OpenFarePaymaster deployed to:", await paymaster.getAddress());
  
  // 7) Summary
  console.table({
    Forwarder:  await forwarder.getAddress(),
    RideLedger: await ledger.getAddress(),
    Paymaster:  await paymaster.getAddress(),
  });
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Deployment failed:", err);
    process.exit(1);
  });