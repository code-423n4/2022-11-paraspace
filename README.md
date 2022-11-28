# ParaSpace contest details

- Total Prize Pool: $192,500 USDC
  - HM awards: $136,000 USDC
  - QA report awards: $16,000 USDC
  - Gas report awards: $8,000 USDC
  - Judge + presort awards: $32,000 USDC
  - Scout awards: $500 USDC
- Join [C4 Discord](https://discord.gg/code4rena) to register
- Submit findings [using the C4 form](https://code4rena.com/contests/2022-11-paraspace-contest/submit)
- [Read our guidelines for more details](https://docs.code4rena.com/roles/wardens)
- Starts November 28, 2022 20:00 UTC
- Ends December 9, 2022 20:00 UTC

## C4udit / Publicly Known Issues

- https://github.com/para-space/paraspace-core/tree/main/audits

# Overview

[ParaSpace](https://para.space) is a decentralized lending protocol that allows users to borrow and lend against Non-Fungible and Fungible tokens alike. ParaSpace allows users to tap into otherwise-unused capital to fund further investments and earn yields on the same.

[![Twitter URL](https://img.shields.io/twitter/follow/ParallelFi?style=social)](https://twitter.com/ParallelFi)
[![Telegram](https://img.shields.io/badge/Telegram-gray?logo=telegram)](https://t.me/parallelfi_community)
[![Discourse](https://img.shields.io/badge/Forum-gray?logo=discourse)](https://discourse.para.space)
[![Discord chat][discord-badge]][discord-url]

[discord-badge]: https://img.shields.io/discord/830972820846018600.svg?logo=discord&style=flat-square
[discord-url]: https://discord.com/invite/buKKx4dySW

[Website](https://para.space) |
[White Paper](https://docs.para.space/para-space/#introduction-to-para-space) |
[API Docs](https://api-docs.para.space) |
[Chat](https://discord.com/invite/buKKx4dySW)

![paraspace-architecture](https://user-images.githubusercontent.com/47150934/203772823-ef824800-55eb-427e-933f-6e8c198d6845.png)

# Scope

| Contract                                                                           | SLOC | Purpose                                                                                                    | Libraries used                   |
| ---------------------------------------------------------------------------------- | ---- | ---------------------------------------------------------------------------------------------------------- | -------------------------------- |
| paraspace-core/contracts/misc/marketplaces/LooksRareAdapter.sol                    | 89   | Implements the NFT <=> ERC20 exchange logic via LooksRare marketplace                                      | @LooksRare/contracts-exchange/\* |
| paraspace-core/contracts/misc/marketplaces/SeaportAdapter.sol                      | 112  | Implements the NFT <=> ERC20 exchange logic via OpenSea Seaport marketplace                                | @ProjectOpenSea/seaport/\*       |
| paraspace-core/contracts/misc/marketplaces/X2Y2Adapter.sol                         | 92   | Implements the NFT <=> ERC20 exchange logic via X2Y2 marketplace                                           | @openzeppelin/\*                 |
| paraspace-core/contracts/misc/NFTFloorOracle.sol                                   | 337  | /// @notice Offchain clients can update the prices in this contract. The public can read prices            | @openzeppelin/\*                 |
| paraspace-core/contracts/misc/ParaSpaceOracle.sol                                  | 163  | Contract to get asset prices, manage price sources and update the fallback oracle                          | @openzeppelin/\*                 |
| paraspace-core/contracts/misc/UniswapV3OracleWrapper.sol                           | 307  |                                                                                                            | @Uniswap/v3-core/\*              |
| paraspace-core/contracts/protocol/configuration/PoolAddressesProvider.sol          | 244  | Main registry of addresses part of or connected to the protocol, including permissioned roles              | @openzeppelin/\*                 |
| paraspace-core/contracts/protocol/libraries/logic/AuctionLogic.sol                 | 114  | Implements actions involving NFT auctions                                                                  | @openzeppelin/\*                 |
| paraspace-core/contracts/protocol/libraries/logic/BorrowLogic.sol                  | 159  | Implements the base logic for all the actions related to borrowing                                         | @openzeppelin/\*                 |
| paraspace-core/contracts/protocol/libraries/logic/FlashClaimLogic.sol              | 71   |                                                                                                            | @Chainlink/vrf/\*                |
| paraspace-core/contracts/protocol/libraries/logic/GenericLogic.sol                 | 442  | Implements protocol-level logic to calculate and validate the state of a user                              | @openzeppelin/\*                 |
| paraspace-core/contracts/protocol/libraries/logic/LiquidationLogic.sol             | 645  | Implements actions involving management of collateral in the protocol, the main one being the liquidations | @openzeppelin/\*                 |
| paraspace-core/contracts/protocol/libraries/logic/MarketplaceLogic.sol             | 482  | Implements the base logic for all the actions related to NFT buy/accept bid                                | @openzeppelin/\*                 |
| paraspace-core/contracts/protocol/libraries/logic/PoolLogic.sol                    | 175  | Implements the logic for Pool specific functions                                                           | @openzeppelin/\*                 |
| paraspace-core/contracts/protocol/libraries/logic/SupplyLogic.sol                  | 545  | Implements the base logic for supply/withdraw                                                              | @openzeppelin/\*                 |
| paraspace-core/contracts/protocol/libraries/logic/ValidationLogic.sol              | 968  | Implements functions to validate the different actions of the protocol                                     | @openzeppelin/\*                 |
| paraspace-core/contracts/protocol/pool/DefaultReserveAuctionStrategy.sol           | 94   | Implements the calculation of the current dutch auction price                                              | @openzeppelin/\*                 |
| paraspace-core/contracts/protocol/pool/PoolApeStaking.sol                          | 381  | ParaSpace Ape Staking Pool                                                                                 | @openzeppelin/\*                 |
| paraspace-core/contracts/protocol/pool/PoolCore.sol                                | 678  | Main point of interaction with an ParaSpace protocol's market                                              | @openzeppelin/\*                 |
| paraspace-core/contracts/protocol/pool/PoolMarketplace.sol                         | 114  | Main point of interaction with an ParaSpace protocol's market                                              | @openzeppelin/\*                 |
| paraspace-core/contracts/protocol/pool/PoolParameters.sol                          | 224  | Main point of interaction with an ParaSpace protocol's market                                              | @openzeppelin/\*                 |
| paraspace-core/contracts/protocol/pool/PoolStorage.sol                             | 19   | Contract used as storage of the Pool contract.                                                             | @openzeppelin/\*                 |
| paraspace-core/contracts/protocol/tokenization/base/MintableIncentivizedERC721.sol | 434  | Basic ERC721 implementation                                                                                | @openzeppelin/\*                 |
| paraspace-core/contracts/protocol/tokenization/NToken.sol                          | 267  | Implementation of the NFT derivative token for the ParaSpace protocol                                      | @openzeppelin/\*                 |
| paraspace-core/contracts/protocol/tokenization/NTokenApeStaking.sol                | 145  | Implementation of the NToken for the ParaSpace protocol                                                    | @yoga-labs/ApeCoinStaking/\*     |
| paraspace-core/contracts/protocol/tokenization/NTokenBAYC.sol                      | 65   | Implementation of the NToken for the ParaSpace protocol                                                    | @openzeppelin/\*                 |
| paraspace-core/contracts/protocol/tokenization/NTokenMAYC.sol                      | 65   | Implementation of the NToken for the ParaSpace protocol                                                    | @openzeppelin/\*                 |
| paraspace-core/contracts/protocol/tokenization/NTokenMoonBirds.sol                 | 87   | Implementation of the interest bearing token for the ParaSpace protocol                                    | @openzeppelin/\*                 |
| paraspace-core/contracts/protocol/tokenization/NTokenUniswapV3.sol                 | 109  | Implementation of the interest bearing token for the ParaSpace protocol                                    | @Uniswap/v3-core/\*              |
| paraspace-core/contracts/protocol/tokenization/libraries/MintableERC721Logic.sol   | 427  | Implements the base logic for MintableERC721                                                               | @openzeppelin/\*                 |
| paraspace-core/contracts/protocol/tokenization/libraries/ApeStakingLogic.sol       | 197  | Implements the base logic for ApeStaking                                                                   | @yoga-labs/ApeCoinStaking/\*     |
| paraspace-core/contracts/ui/WPunkGateway.sol                                       | 156  | Implements the acceptBidWithCredit feature. AcceptBidWithCredit allows users to                            | @openzeppelin/\*                 |

## Out of scope

The issue raised in PR https://github.com/para-space/paraspace-core/pull/7 has been already identified and evaluated, therefore, not eligible for rewards.

# Additional Context

- docs: https://docs.para.space
- audit technical documentation: https://www.notion.so/parallelfinance/Audit-Technical-Documentation-0a107270dabe45d2b66a076e0bdaa943
- code walkthrough: https://drive.google.com/file/d/1_3lz2le-DJ-pzfpoBiawETQrzeKWAq30/view
- [goerli deployed contracts](https://github.com/para-space/paraspace-core/files/10064318/deployed-contracts.md)

## Scoping Details

```
- If you have a public code repo, please share it here:  https://github.com/para-space/paraspace-core
- How many contracts are in scope?: 32
- Total SLoC for these contracts?: 8408
- How many external imports are there?: 12
- How many separate interfaces and struct definitions are there for the contracts within scope?: 44 interfaces, 35 struct definitions
- Does most of your code generally use composition or inheritance?: Yes
- How many external calls?: 306
- What is the overall line coverage percentage provided by your tests?: 85
- Is there a need to understand a separate part of the codebase / get context in order to audit this part of the protocol?: No
- Please describe required context: N/A
- Does it use an oracle?: Yes. Chainlink + offchain client
- Does the token conform to the ERC20 standard?: Yes, plus ERC-721
- Are there any novel or unique curve logic or mathematical models?: https://docs.para.space/para-space/para-space/risk-framework
- Does it use a timelock function?: No
- Is it an NFT?: Yes. It does NFT lending & marketplace
- Does it have an AMM?: Yes
- Is it a fork of a popular project?: Yes. Forked from AaveV3 protocol. https://docs.para.space
- Does it use rollups?: No
- Is it multi-chain?: No
- Does it use a side-chain?: No
```

# Tests

```
cd paraspace-core

# install dependencies
yarn

# build contracts
yarn build

# run tests
make fast-test
```
