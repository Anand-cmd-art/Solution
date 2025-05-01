// scripts/deploy.js
require("dotenv").config();
const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  // 1) Forwarder
  const Forwarder = await hre.ethers.getContractFactory("MinimalForwarder");
  const forwarder = await Forwarder.deploy();
  await forwarder.deployed();

  // 2) Ledger
  const Ledger = await hre.ethers.getContractFactory("RideLedger");
  // Pass forwarder.address and your backend address here
  const ledger = await Ledger.deploy(forwarder.address, deployer.address);
  await ledger.deployed();

  // 3) Paymaster
  const Paymaster = await hre.ethers.getContractFactory("OpenFarePaymaster");
  const paymaster = await Paymaster.deploy(
    process.env.GSN_RELAY_HUB,
    forwarder.address,
    ledger.address
  );
  await paymaster.deployed();

  console.table({
    Forwarder: forwarder.address,
    RideLedger: ledger.address,
    Paymaster: paymaster.address,
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});     
