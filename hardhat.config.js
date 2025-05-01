// hardhat.config.js
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.20",

  defaultNetwork: "polygonZkEvmTestnet",

  networks: {
    hardhat: {
      chainId: 31337,
    },
    polygonZkEvmTestnet: {
      url: process.env.ALCHEMY_ZKEVM_TESTNET_URL,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 1442,
    },
    polygonZkEvmMainnet: {
      url: process.env.ALCHEMY_ZKEVM_MAINNET_URL,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 1101,
    },
  },

  etherscan: {
    apiKey: {
      polygonZkEvmTestnet: process.env.ZKEVM_TESTNET_POLYGONSCAN_KEY || "",
      polygonZkEvmMainnet: process.env.ZKEVM_MAINNET_POLYGONSCAN_KEY || "",
    },
  },

  gsn: {
    forwarderAddress: process.env.GSN_FORWARDER_ADDRESS || "",
    paymasterAddress: process.env.GSN_PAYMASTER_ADDRESS || "",
  },
};
