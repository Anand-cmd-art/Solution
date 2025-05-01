require("dotenv").config();
const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  const Forwarder = await hre.ethers.getContractFactory("MinimalForwarder");
  const forwarder = await Forwarder.deploy();
  await forwarder.deployed();

  const Ledger = await hre.ethers.getContractFactory("RideLedger");
  const ledger  = await Ledger.deploy(forwarder.address, deployer.address); // backend == deployer
  await ledger.deployed();

  const Paymaster = await hre.ethers.getContractFactory("Paymaster");
  const paymaster = await Paymaster.deploy(process.env.GSN_RELAY_HUB, ledger.address);
  await paymaster.deployed();

  console.table({
    Forwarder: forwarder.address,
    RideLedger: ledger.address,
    Paymaster: paymaster.address
  });
}

main().catch(err => { console.error(err); process.exit(1); });