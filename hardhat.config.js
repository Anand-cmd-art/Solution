// hardhat.config.js
require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.20",
  defaultNetwork: "polygonZkEvmTestnet",
  networks: {
    hardhat: { chainId: 31337 },
    polygonZkEvmTestnet: {
      url: process.env.ALCHEMY_ZKEVM_TESTNET_URL || 
           "https://polygonzkevm-testnet.g.alchemy.com/v2/demo", // Fallback URL (replace with a working one)
      accounts: [process.env.PRIVATE_KEY].filter(Boolean),
      chainId: 2442,
    },
    polygonZkEvmMainnet: {
      url: process.env.ALCHEMY_ZKEVM_MAINNET_URL || 
           "https://polygonzkevm-mainnet.g.alchemy.com/v2/demo", // Fallback URL (replace with a working one)
      accounts: [process.env.PRIVATE_KEY].filter(Boolean),
      chainId: 1101,
    },
    sepolia: {
      url: process.env.ALCHEMY_SEPOLIA_URL,
      chainId: 11155111,
      accounts: [process.env.PRIVATE_KEY].filter(Boolean),
    },
  },
  etherscan: {
    apiKey: {
      // polygonZkEvmTestnet: process.env.ZKEVM_TESTNET_POLYGONSCAN_KEY || "",
      polygonZkEvmMainnet: process.env.ZKEVM_MAINNET_POLYGONSCAN_KEY || "KJRFAEJSHJIXUQBNPVUGJGRVBQUH3C2V25",
    },
  },
};