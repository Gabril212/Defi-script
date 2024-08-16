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

