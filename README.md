# DeFi Borrowing Script: Uniswap to Compound

## Overview of Script

This script facilitates a borrowing process in the decentralized finance (DeFi) ecosystem by interacting with Uniswap and Compound protocols. The primary objective is to enable users to borrow ETH by using USDC as collateral. Here's a breakdown of the workflow:

1. **Initialization**: The script loads environment variables, including RPC URLs, private keys, and contract addresses, to set up the necessary configurations.

2. **Provider and Signer Setup**: Initializes the provider and signer to interact with the blockchain and execute transactions.

3. **USDC Balance Check**: Verifies if the user has sufficient USDC in their wallet to be used as collateral.

4. **Compound Protocol Configuration**: Loads configuration details from the Compound protocol, such as collateral factors and interest rates.

5. **USDC Approval**: Approves the Compound protocol to use the user's USDC as collateral.

6. **Deposit USDC**: Deposits the approved USDC into the Compound protocol by interacting with the cUSDC contract.

7. **Borrow Limit Calculation**: Calculates the maximum amount of ETH that can be borrowed based on the deposited USDC collateral.

8. **Market Status Check**: Assesses the status of the ETH borrow market, including interest rates and liquidity.

9. **Borrow Request Preparation and Execution**: Prepares and executes a borrow request if the market conditions are stable.

10. **Borrow Confirmation**: Confirms that the borrowed ETH has been successfully transferred to the user's wallet.

11. **Error Handling**: Manages various error scenarios, including failed approvals, deposit failures, and market instability.

## Diagram Illustration

To visualize the sequence of steps and interactions between the protocols, please refer to the diagram included in the repository.

![Sequence Diagram](Sequence%20Diagram.png)

The diagram illustrates the detailed flow of the borrowing process, showing interactions between the user, the Compound protocol, USDC contract, and ETH market. It helps in understanding the order of operations and decision points in the borrowing workflow.

---


---

## Code Explanation

This section provides a detailed explanation of the DeFi borrowing script. It covers key functions, logic, and how the script interacts with various DeFi protocols such as Compound and USDC. 

### 1. **Initialization**

The script begins by loading environment variables and setting up the necessary configuration:

```javascript
// Load Environment Variables
const dotenv = require('dotenv');
dotenv.config();

// Set up RPC URL, Private Key, and Contract Addresses
const RPC_URL = process.env.RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const COMPOUND_CONTRACT_ADDRESS = process.env.COMPOUND_CONTRACT_ADDRESS;
const USDC_CONTRACT_ADDRESS = process.env.USDC_CONTRACT_ADDRESS;
```

- **dotenv**: This package loads environment variables from a `.env` file to keep sensitive information secure.
- **RPC_URL**: The URL used to connect to the Ethereum blockchain.
- **PRIVATE_KEY**: The private key used to sign transactions.
- **COMPOUND_CONTRACT_ADDRESS** and **USDC_CONTRACT_ADDRESS**: Addresses of the Compound and USDC smart contracts.

### 2. **Provider and Signer Setup**

```javascript
const { ethers } = require('ethers');
const provider = new ethers.JsonRpcProvider(RPC_URL);
const signer = new ethers.Wallet(PRIVATE_KEY, provider);
```

- **ethers.JsonRpcProvider**: Connects to the Ethereum network.
- **ethers.Wallet**: Creates a wallet instance with the user's private key for transaction signing.

### 3. **USDC Balance Check**

```javascript
const usdc = new ethers.Contract(USDC_CONTRACT_ADDRESS, USDC_ABI, provider);
const balance = await usdc.balanceOf(signer.address);
if (balance.lt(requiredAmount)) {
    throw new Error('Insufficient USDC Balance');
}
```

- **usdc.balanceOf**: Checks the amount of USDC in the user's wallet.
- **requiredAmount**: The amount of USDC needed for the borrowing process. If the balance is less than this amount, an error is thrown.

### 4. **Compound Protocol Configuration**

```javascript
const compound = new ethers.Contract(COMPOUND_CONTRACT_ADDRESS, COMPOUND_ABI, provider);
const config = await compound.getConfiguration();
```

- **compound.getConfiguration**: Retrieves configuration details from the Compound protocol, including collateral factors and interest rates.

### 5. **USDC Approval**

```javascript
const usdcWithSigner = usdc.connect(signer);
const tx = await usdcWithSigner.approve(COMPOUND_CONTRACT_ADDRESS, amount);
await tx.wait();
```

- **usdc.connect(signer)**: Connects the USDC contract to the signer to authorize transactions.
- **usdc.approve**: Approves the Compound protocol to use the specified amount of USDC as collateral.
- **tx.wait()**: Waits for the approval transaction to be confirmed.

### 6. **Deposit USDC**

```javascript
const depositTx = await compound.connect(signer).depositUSDC(amount);
await depositTx.wait();
```

- **compound.depositUSDC(amount)**: Deposits the approved amount of USDC into the Compound protocol.
- **await depositTx.wait()**: Waits for the deposit transaction to be confirmed.

### 7. **Calculate Borrow Limit**

```javascript
const borrowLimit = await compound.getBorrowLimit(signer.address);
```

- **compound.getBorrowLimit**: Calculates the maximum amount of ETH that can be borrowed based on the deposited USDC and collateral factors.

### 8. **Market Status Check**

```javascript
const marketStatus = await compound.getMarketStatus();
if (marketStatus.isStable === false) {
    throw new Error('Market Unstable');
}
```

- **compound.getMarketStatus**: Fetches the current status of the ETH borrow market.
- **marketStatus.isStable**: Determines if the market conditions are stable. If not, an error is thrown to halt the process.

### 9. **Prepare and Execute Borrow Request**

```javascript
const borrowTx = await compound.connect(signer).borrowETH(borrowAmount);
await borrowTx.wait();
```

- **compound.borrowETH(borrowAmount)**: Initiates the borrowing of ETH using the USDC collateral. The `borrowAmount` is the amount of ETH requested.
- **await borrowTx.wait()**: Waits for the borrow transaction to be confirmed.

### 10. **Retrieve Borrowed ETH**

```javascript
const ethBalance = await provider.getBalance(signer.address);
console.log(`Borrowed ETH Balance: ${ethers.utils.formatEther(ethBalance)}`);
```

- **provider.getBalance**: Checks the ETH balance in the user's wallet to confirm that the borrowed ETH has been received.
- **ethers.utils.formatEther**: Converts the ETH balance from Wei to Ether for easier readability.

### 11. **Error Handling**

Throughout the script, various error scenarios are handled, such as insufficient balance, approval failures, deposit failures, and unstable market conditions. Errors are thrown with descriptive messages to assist in debugging and ensure that the process stops when critical issues occur.

---



