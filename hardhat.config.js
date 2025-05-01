require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.20",

  defaultNetwork: "polygonZkEvmTestnet",


  networks: {
    // Local Hardhat network
    hardhat: {
      chainId: 31337,
    },



    // Polygon zkEVM Mainnet (Chain ID 1101)
    polygonZkEvmMainnet: {
      url: process.env.ALCHEMY_ZKEVM_MAINNET_URL,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 1101,            
      gas: "auto",
      gasPrice: "auto",
    },
  },

  
  Polygonscan: {
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
