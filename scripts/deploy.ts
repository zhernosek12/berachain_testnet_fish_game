// Imports
// ========================================================
import hre from "hardhat";
import fs from "fs"; 
import { defineChain } from "viem"; 
import { privateKeyToAccount } from "viem/accounts"; 

// Config Needed For Custom Chain  
// ========================================================  
const chainConfiguration = defineChain({
  
  id: parseInt(`${process.env.CHAIN_ID}`), 
  name: `${process.env.NETWORK_NAME}`, 
  network: `${process.env.NETWORK_NAME}`, 
  nativeCurrency: {
    
    decimals: parseInt(`${process.env.CURRENCY_DECIMALS}`), 
    name: `${process.env.CURRENCY_NAME}`, 
    symbol: `${process.env.CURRENCY_SYMBOL}`, 
  }, 
  rpcUrls: {
    
    default: {
      
      http: [`${process.env.RPC_URL}`], 
    }, 
    public: {
      
      http: [`${process.env.RPC_URL}`], 
    }, 
  }, 
  blockExplorers: {
    
    default: {
      name: `${process.env.BLOCK_EXPLORER_NAME}`,
      url: `${process.env.BLOCK_EXPLORER_URL}`,
    }, 
  }, 
}); 

// Main Deployment Script
// ========================================================
async function main() {
    const contractName = "BeraFishGame"; 

  // NOTE: hardhat with viem currently doesn't support custom chains so there needs to be some custom functionality ↴ 
  if (hre.network.name === "berachainTestnet") {
    // Retrieve contract artifact ABI & Bytecode 
    
    const artifactFile = fs.readFileSync(
      `${hre.artifacts._artifactsPath}/contracts/${contractName}.sol/${contractName}.json`
    ); 
    const artifactJSON = JSON.parse(artifactFile.toString()) as any; 

    // Configure wallet client 
    const walletClient = await hre.viem.getWalletClient(
      
      // wallet account 
      privateKeyToAccount(hre.network.config.accounts?.[0] as `0x${string}`), 
      // configured chain 
      {
        
        chain: chainConfiguration, 
      } 
    ); 

    // Deploy contract 
    const hash = await walletClient.deployContract({
      
      abi: artifactJSON.abi, 
      bytecode: artifactJSON.bytecode, 
      args: [1719555467n], 
    }); 
    console.log({ hash }); 

    // Retrieve deployed contract address 
    const publicClient = await hre.viem.getPublicClient({
      chain: chainConfiguration, 
    }); 
    const receipt = await publicClient.waitForTransactionReceipt({ hash }); 
    console.log(`${contractName} deployed to ${receipt?.contractAddress}`); 
  } else {
    
    const contract = await hre.viem.deployContract(contractName, [
        1719555467n,
    ]);
    console.log(`${contractName} deployed to ${contract.address}`);
  } 
}

// Init
// ========================================================
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});