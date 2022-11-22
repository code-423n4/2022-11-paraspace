# ParaSpace contest details
- Total Prize Pool: $144,500 USDC
  - HM awards: $102,000 USDC 
  - QA report awards: $12,000 USDC
  - Gas report awards: $6,000 USDC
  - Judge + presort awards: $24,000 USDC
  - Scout awards: $500 USDC
- Join [C4 Discord](https://discord.gg/code4rena) to register
- Submit findings [using the C4 form](https://code4rena.com/contests/2022-11-paraspace-contest/submit)
- [Read our guidelines for more details](https://docs.code4rena.com/roles/wardens)
- Starts November 23, 2022 20:00 UTC
- Ends December 5, 2022 20:00 UTC

## C4udit / Publicly Known Issues

- https://github.com/para-space/paraspace-core/tree/main/audits

# Overview

[ParaSpace](https://para.space) is a decentralized lending protocol that allows users to borrow and lend against Non-Fungible and Fungible tokens alike. ParaSpace allows users to tap into otherwise-unused capital to fund further investments and earn yields on the same.

[![Twitter URL](https://img.shields.io/twitter/follow/ParallelFi?style=social)](https://twitter.com/ParallelFi)
[![Telegram](https://img.shields.io/badge/Telegram-gray?logo=telegram)](https://t.me/parallelfi_community)
[![Medium](https://img.shields.io/badge/Medium-gray?logo=medium)](https://medium.com/@paraspace)
[![Discourse](https://img.shields.io/badge/Forum-gray?logo=discourse)](https://discourse.para.space)
[![Discord chat][discord-badge]][discord-url]

[discord-badge]: https://img.shields.io/discord/830972820846018600.svg?logo=discord&style=flat-square
[discord-url]: https://discord.com/invite/buKKx4dySW

[Website](https://para.space) |
[White Paper](https://docs.para.space/para-space/#introduction-to-para-space) |
[API Docs](https://api-docs.para.space) |
[Chat](https://discord.com/invite/buKKx4dySW)

![paraspace-architecture](https://user-images.githubusercontent.com/33961674/203233483-21f97112-774e-4dc0-97eb-c62f205a2c44.png)

# Scope

*List all files in scope in the table below -- and feel free to add notes here to emphasize areas of focus.*

| Contract | SLOC | Purpose | Libraries used |
| ----------- | ----------- | ----------- | ----------- |
| paraspace-core/contracts/misc/flashclaim/AirdropFlashClaimReceiver.sol | 147 |  | @Chainlink/vrf/* |
| paraspace-core/contracts/misc/flashclaim/UserFlashclaimRegistry.sol | 18 |  | @Chainlink/vrf/* |
| paraspace-core/contracts/misc/marketplaces/LooksRareAdapter.sol | 58 | Implements the NFT <=> ERC20 exchange logic via LooksRare marketplace | @LooksRare/contracts-exchange/* |
| paraspace-core/contracts/misc/marketplaces/SeaportAdapter.sol | 65 | Implements the NFT <=> ERC20 exchange logic via OpenSea Seaport marketplace | @ProjectOpenSea/seaport/* |
| paraspace-core/contracts/misc/marketplaces/X2Y2Adapter.sol | 60 | Implements the NFT <=> ERC20 exchange logic via X2Y2 marketplace | @openzeppelin/* |
| paraspace-core/contracts/misc/ERC721OracleWrapper.sol | 37 |  | @openzeppelin/* |
| paraspace-core/contracts/misc/NFTFloorOracle.sol | 186 | /// @notice Offchain clients can update the prices in this contract. The public can read prices | @openzeppelin/* |
| paraspace-core/contracts/misc/ParaSpaceOracle.sol | 87 | Contract to get asset prices, manage price sources and update the fallback oracle | @openzeppelin/* |
| paraspace-core/contracts/misc/ProtocolDataProvider.sol | 177 | Peripheral contract to collect and pre-process information from the Pool. | @openzeppelin/* |
| paraspace-core/contracts/misc/UniswapV3OracleWrapper.sol | 207 |  | @Uniswap/v3-core/* |
| paraspace-core/contracts/protocol/configuration/ACLManager.sol | 48 | Access Control List Manager. Main registry of system roles and permissions. | @openzeppelin/* |
| paraspace-core/contracts/protocol/configuration/PoolAddressesProvider.sol | 121 | Main registry of addresses part of or connected to the protocol, including permissioned roles | @openzeppelin/* |
| paraspace-core/contracts/protocol/configuration/PoolAddressesProviderRegistry.sol | 42 | Main registry of PoolAddressesProvider of ParaSpace markets. | @openzeppelin/* |
| paraspace-core/contracts/protocol/libraries/configuration/ReserveConfiguration.sol | 114 | Implements the bitmap logic to handle the reserve configuration | @openzeppelin/* |
| paraspace-core/contracts/protocol/libraries/configuration/UserConfiguration.sol | 51 | Implements the bitmap logic to handle the user configuration | @openzeppelin/* |
| paraspace-core/contracts/protocol/libraries/logic/AuctionLogic.sol | 64 | Implements actions involving NFT auctions | @openzeppelin/* |
| paraspace-core/contracts/protocol/libraries/logic/BorrowLogic.sol | 91 | Implements the base logic for all the actions related to borrowing | @openzeppelin/* |
| paraspace-core/contracts/protocol/libraries/logic/ConfiguratorLogic.sol | 119 | Implements the functions to initialize reserves and update xTokens and debtTokens | @openzeppelin/* |
| paraspace-core/contracts/protocol/libraries/logic/FlashClaimLogic.sol | 45 |  | @Chainlink/vrf/* |
| paraspace-core/contracts/protocol/libraries/logic/GenericLogic.sol | 269 | Implements protocol-level logic to calculate and validate the state of a user | @openzeppelin/* |
| paraspace-core/contracts/protocol/libraries/logic/LiquidationLogic.sol | 341 | Implements actions involving management of collateral in the protocol, the main one being the liquidations | @openzeppelin/* |
| paraspace-core/contracts/protocol/libraries/logic/MarketplaceLogic.sol | 283 | Implements the base logic for all the actions related to NFT buy/accept bid | @openzeppelin/* |
| paraspace-core/contracts/protocol/libraries/logic/PoolLogic.sol | 92 | Implements the logic for Pool specific functions | @openzeppelin/* |
| paraspace-core/contracts/protocol/libraries/logic/ReserveLogic.sol | 109 | Implements the logic to update the reserves state | @openzeppelin/* |
| paraspace-core/contracts/protocol/libraries/logic/SupplyLogic.sol | 303 | Implements the base logic for supply/withdraw | @openzeppelin/* |
| paraspace-core/contracts/protocol/libraries/logic/ValidationLogic.sol | 591 | Implements functions to validate the different actions of the protocol | @openzeppelin/* |
| paraspace-core/contracts/protocol/pool/DefaultReserveAuctionStrategy.sol | 51 | Implements the calculation of the current dutch auction price | @openzeppelin/* |
| paraspace-core/contracts/protocol/pool/DefaultReserveInterestRateStrategy.sol | 46 | Implements the calculation of the interest rates depending on the reserve state | @openzeppelin/* |
| paraspace-core/contracts/protocol/pool/PoolConfigurator.sol | 196 |  | @openzeppelin/* |
| paraspace-core/contracts/protocol/pool/PoolCore.sol | 434 | Main point of interaction with an ParaSpace protocol's market | @openzeppelin/* |
| paraspace-core/contracts/protocol/pool/PoolMarketplace.sol | 64 | Main point of interaction with an ParaSpace protocol's market | @openzeppelin/* |
| paraspace-core/contracts/protocol/pool/PoolParameters.sol | 134 | Main point of interaction with an ParaSpace protocol's market | @openzeppelin/* |
| paraspace-core/contracts/protocol/pool/PoolStorage.sol | 8 | Contract used as storage of the Pool contract. | @openzeppelin/* |
| paraspace-core/contracts/protocol/tokenization/base/MintableIncentivizedERC721.sol | 207 | Basic ERC721 implementation | @openzeppelin/* |
| paraspace-core/contracts/protocol/tokenization/NToken.sol | 161 | Implementation of the NFT derivative token for the ParaSpace protocol | @openzeppelin/* |
| paraspace-core/contracts/protocol/tokenization/NTokenApeStaking.sol | 89 | Implementation of the NToken for the ParaSpace protocol | @yoga-labs/ApeCoinStaking/* |
| paraspace-core/contracts/protocol/tokenization/NTokenBAYC.sol | 18 | Implementation of the NToken for the ParaSpace protocol | @openzeppelin/* |
| paraspace-core/contracts/protocol/tokenization/NTokenMAYC.sol | 18 | Implementation of the NToken for the ParaSpace protocol | @openzeppelin/* |
| paraspace-core/contracts/protocol/tokenization/NTokenMoonBirds.sol | 42 | Implementation of the interest bearing token for the ParaSpace protocol | @openzeppelin/* |
| paraspace-core/contracts/protocol/tokenization/NTokenUniswapV3.sol | 59 | Implementation of the interest bearing token for the ParaSpace protocol | @Uniswap/v3-core/* |
| paraspace-core/contracts/protocol/tokenization/libraries/MintableERC721Logic.sol | 245 | Implements the base logic for MintableERC721 | @openzeppelin/* |
| paraspace-core/contracts/protocol/tokenization/libraries/ApeStakingLogic.sol | 133 | Implements the base logic for ApeStaking | @yoga-labs/ApeCoinStaking/* |
| paraspace-core/contracts/ui/WETHGateway.sol | 55 |  | @openzeppelin/* |
| paraspace-core/contracts/ui/WPunkGateway.sol | 65 | Implements the acceptBidWithCredit feature. AcceptBidWithCredit allows users to | @openzeppelin/* |

## Out of scope

*List any files/contracts that are out of scope for this audit.*

N/A

# Additional Context

- docs: https://docs.para.space
- audit technical documentation: https://www.notion.so/parallelfinance/Audit-Technical-Documentation-0a107270dabe45d2b66a076e0bdaa943
- [deployed-contracts](https://github.com/para-space/paraspace-core/files/10064318/deployed-contracts.md)

## Scoping Details 
```
- If you have a public code repo, please share it here:  https://github.com/para-space/paraspace-core
- How many contracts are in scope?: 45
- Total SLoC for these contracts?: 5750
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

# create .env file
cp .env.example .env

# install dependencies
yarn install

# build contracts
yarn build 
```