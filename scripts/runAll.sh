set -e

echo "→ Deploying contracts to zkEVM testnet…"
npx hardhat run scripts/deploy.js --network polygonZkEvmTestnet

echo "→ Funding Paymaster…"
npx hardhat run scripts/fundPaymaster.js --network polygonZkEvmTestnet

echo "→ Building & launching docker services…"
docker compose -f infra/docker-compose.yml up --build -d

echo "All systems running. Frontend → http://localhost:3000"