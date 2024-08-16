require('dotenv').config();
const { ethers } = require('ethers');
const AAVE_LENDING_POOL_ABI = require('./abis/aaveLendingPool.json');
const UNISWAP_ROUTER_ABI = require('./abis/uniswapRouter.json');
const TOKEN_ABI = require('./abis/token.json');

// Step 1: Set up provider and signer
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Token addresses on Sepolia testnet
const USDC = { address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', decimals: 6 };  // Example address, replace with Sepolia equivalent
const LINK = { address: '0x514910771AF9Ca656af840dff83E8264EcF986CA', decimals: 18 };  // Example address, replace with Sepolia equivalent

// Uniswap Router and Aave Lending Pool Contract Addresses (on Sepolia)
const UNISWAP_ROUTER_ADDRESS = '0xE592427A0AEce92De3Edee1F18E0157C05861564';  // Uniswap V3 Swap Router
const AAVE_LENDING_POOL_ADDRESS = '0x88757f2f99175387ab4c6a4b3067c77a695b0349';  // Aave Lending Pool on Sepolia

async function approveToken(tokenAddress, amount, spender) {
  try {
    const tokenContract = new ethers.Contract(tokenAddress, TOKEN_ABI, signer);
    const approveAmount = ethers.utils.parseUnits(amount.toString(), USDC.decimals);
    const transaction = await tokenContract.approve(spender, approveAmount);
    await transaction.wait();
    console.log(`Approved ${amount} USDC for swapping.`);
  } catch (error) {
    console.error('Token approval failed:', error);
  }
}

async function swapUSDCtoLINK(amount) {
  try {
    const uniswapRouter = new ethers.Contract(UNISWAP_ROUTER_ADDRESS, UNISWAP_ROUTER_ABI, signer);
    const amountIn = ethers.utils.parseUnits(amount.toString(), USDC.decimals);

    // Prepare swap params
    const params = {
      tokenIn: USDC.address,
      tokenOut: LINK.address,
      fee: 3000,  // 0.3% fee tier
      recipient: signer.address,
      deadline: Math.floor(Date.now() / 1000) + 60 * 20,  // 20 minutes deadline
      amountIn,
      amountOutMinimum: 0,
      sqrtPriceLimitX96: 0,
    };

    const transaction = await uniswapRouter.exactInputSingle(params);
    await transaction.wait();
    console.log(`Swapped ${amount} USDC for LINK.`);
  } catch (error) {
    console.error('Swap failed:', error);
  }
}

async function supplyLINKtoAave() {
  try {
    const lendingPool = new ethers.Contract(AAVE_LENDING_POOL_ADDRESS, AAVE_LENDING_POOL_ABI, signer);
    const linkContract = new ethers.Contract(LINK.address, TOKEN_ABI, signer);

    // Check LINK balance after swap
    const linkBalance = await linkContract.balanceOf(signer.address);
    if (linkBalance.gt(0)) {
      // Approve Aave Lending Pool to use LINK
      const approveTransaction = await linkContract.approve(AAVE_LENDING_POOL_ADDRESS, linkBalance);
      await approveTransaction.wait();

      // Supply LINK to Aave
      const supplyTransaction = await lendingPool.deposit(LINK.address, linkBalance, signer.address, 0);
      await supplyTransaction.wait();
      console.log(`Supplied ${ethers.utils.formatUnits(linkBalance, LINK.decimals)} LINK to Aave.`);
    } else {
      console.log('No LINK available to supply.');
    }
  } catch (error) {
    console.error('Supplying LINK to Aave failed:', error);
  }
}

// Main function
async function main() {
  const swapAmount = '100';  // Example: swapping 100 USDC for LINK

  await approveToken(USDC.address, swapAmount, UNISWAP_ROUTER_ADDRESS);
  await swapUSDCtoLINK(swapAmount);
  await supplyLINKtoAave();
}

main().catch(console.error);
