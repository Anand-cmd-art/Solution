require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.20",
  networks: {
    // Local Hardhat network
    hardhat: {
      chainId: 31337,
    },

    // Polygon zkEVM Testnet (Chain ID 1442)
    polygonZkEvmTestnet: {
      url: process.env.ALCHEMY_ZKEVM_TESTNET_URL,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 1442,            // :contentReference[oaicite:0]{index=0}
      gas: "auto",
      gasPrice: "auto",
    },

    // Polygon zkEVM Mainnet (Chain ID 1101)
    polygonZkEvmMainnet: {
      url: process.env.ALCHEMY_ZKEVM_MAINNET_URL,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 1101,            // :contentReference[oaicite:1]{index=1}
      gas: "auto",
      gasPrice: "auto",
    },
  },

  // If you plan to verify contracts on Polygonscan (or zkEVM’s explorer):
  etherscan: {
    apiKey: {
      polygonZkEvmTestnet: process.env.ZKEVM_TESTNET_POLYGONSCAN_KEY,
      polygonZkEvmMainnet: process.env.ZKEVM_MAINNET_POLYGONSCAN_KEY,
    },
  },

  // Custom GSN settings (you'll read these in your deploy scripts / contracts)
  gsn: {
    forwarderAddress: process.env.GSN_FORWARDER_ADDRESS,
    paymasterAddress: process.env.GSN_PAYMASTER_ADDRESS,
  },
};
