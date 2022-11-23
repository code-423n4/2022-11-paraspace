import {DRE, getDb, getParaSpaceConfig} from "./misc-utils";
import {
  tEthereumAddress,
  eContractid,
  tStringTokenSmallUnits,
  ERC20TokenContractId,
  ERC721TokenContractId,
} from "./types";
import {
  ATokenDebtToken__factory,
  AuctionLogic__factory,
  MintableERC20,
  MintableERC721,
  MockNToken__factory,
  MockReserveAuctionStrategy__factory,
  NFTFloorOracle__factory,
  ParaProxy__factory,
  PoolApeStaking__factory,
  PTokenSApe__factory,
  StETHDebtToken__factory,
  X2Y2Adapter__factory,
} from "../../types";
import {StETH, MockAToken} from "../../types";
import {MockContract} from "ethereum-waffle";
import {
  getAllERC20Tokens,
  getApeStakingLogic,
  getPunks,
  getFirstSigner,
  getWETH,
  getMintableERC721Logic,
} from "./contracts-getters";
import {
  convertToCurrencyDecimals,
  getFunctionSignatures,
} from "./contracts-helpers";
import {
  ProtocolDataProvider__factory,
  PToken__factory,
  NToken__factory,
  ReservesSetupHelper__factory,
  ParaSpaceOracle__factory,
  DefaultReserveInterestRateStrategy__factory,
  DefaultReserveAuctionStrategy__factory,
  DelegationAwarePToken__factory,
  PoolAddressesProvider__factory,
  PoolAddressesProviderRegistry__factory,
  PoolConfigurator__factory,
  MintableDelegationERC20__factory,
  MintableERC20__factory,
  MintableERC721__factory,
  MockAggregator__factory,
  MockPToken__factory,
  MockVariableDebtToken__factory,
  PriceOracle__factory,
  VariableDebtToken__factory,
  WETH9Mocked__factory,
  ConfiguratorLogic__factory,
  MockIncentivesController__factory,
  MockInitializableFromConstructorImple__factory,
  MockInitializableImple__factory,
  MockInitializableImpleV2__factory,
  InitializableImmutableAdminUpgradeabilityProxy__factory,
  WETH9Mocked,
  ACLManager__factory,
  MockReserveConfiguration__factory,
  MockReentrantInitializableImple__factory,
  UiPoolDataProvider__factory,
  UiIncentiveDataProvider__factory,
  WalletBalanceProvider__factory,
  WETHGateway__factory,
  ERC721OracleWrapper__factory,
  CryptoPunksMarket__factory,
  WPunk__factory,
  WPunkGateway__factory,
  WPunk,
  CryptoPunksMarket,
  LiquidationLogic__factory,
  BoredApeYachtClub__factory,
  MutantApeYachtClub__factory,
  Doodles__factory,
  ParaSpaceFallbackOracle__factory,
  Doodles,
  BoredApeYachtClub,
  MutantApeYachtClub,
  MockTokenFaucet__factory,
  Azuki,
  CloneX,
  Land,
  Meebits,
  Moonbirds,
  Azuki__factory,
  CloneX__factory,
  Moonbirds__factory,
  Meebits__factory,
  Land__factory,
  ConduitController__factory,
  Seaport__factory,
  PausableZoneController__factory,
  CurrencyManager__factory,
  ExecutionManager__factory,
  LooksRareExchange__factory,
  RoyaltyFeeManager__factory,
  RoyaltyFeeRegistry__factory,
  TransferSelectorNFT__factory,
  TransferManagerERC721__factory,
  TransferManagerERC1155__factory,
  StrategyStandardSaleForFixedPrice__factory,
  X2Y2R1__factory,
  ERC721Delegate__factory,
  NTokenMoonBirds__factory,
  UniswapV3OracleWrapper__factory,
  NTokenUniswapV3__factory,
  MarketplaceLogic__factory,
  SeaportAdapter__factory,
  LooksRareAdapter__factory,
  UniswapV3Factory__factory,
  StETH__factory,
  MockAToken__factory,
  PTokenAToken__factory,
  PTokenStETH__factory,
  UserFlashclaimRegistry__factory,
  MockAirdropProject__factory,
  PoolCore__factory,
  PoolParameters__factory,
  PoolMarketplace__factory,
  ApeCoinStaking__factory,
  NTokenBAYC__factory,
  NTokenMAYC__factory,
} from "../../types";

import * as nonfungiblePositionManager from "@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json";
import * as uniSwapRouter from "@uniswap/v3-periphery/artifacts/contracts/SwapRouter.sol/SwapRouter.json";
import * as nFTDescriptor from "@uniswap/v3-periphery/artifacts/contracts/libraries/NFTDescriptor.sol/NFTDescriptor.json";
import * as nonfungibleTokenPositionDescriptor from "@uniswap/v3-periphery/artifacts/contracts/NonfungibleTokenPositionDescriptor.sol/NonfungibleTokenPositionDescriptor.json";

import {
  withSaveAndVerify,
  insertContractAddressInDb,
} from "./contracts-helpers";
import {MintableDelegationERC20} from "../../types";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {Address} from "hardhat-deploy/dist/types";
import {Contract} from "ethers";
import {LiquidationLogicLibraryAddresses} from "../../types/factories/protocol/libraries/logic/LiquidationLogic__factory";
import {MarketplaceLogicLibraryAddresses} from "../../types/factories/protocol/libraries/logic/MarketplaceLogic__factory";
import {PoolCoreLibraryAddresses} from "../../types/factories/protocol/pool/PoolCore__factory";
import {PoolMarketplaceLibraryAddresses} from "../../types/factories/protocol/pool/PoolMarketplace__factory";
import {PoolParametersLibraryAddresses} from "../../types/factories/protocol/pool/PoolParameters__factory";

import {pick} from "lodash";
import {ZERO_ADDRESS} from "./constants";
import {GLOBAL_OVERRIDES} from "./hardhat-constants";

const readArtifact = async (id: string) => {
  return (DRE as HardhatRuntimeEnvironment).artifacts.readArtifact(id);
};

export const deployPoolAddressesProvider = async (
  marketId: string,
  owner: string,
  verify?: boolean
) => {
  return withSaveAndVerify(
    await new PoolAddressesProvider__factory(await getFirstSigner()).deploy(
      marketId,
      owner,
      GLOBAL_OVERRIDES
    ),
    eContractid.PoolAddressesProvider,
    [marketId, owner],
    verify
  );
};
export const deployPoolAddressesProviderRegistry = async (
  owner: string,
  verify?: boolean
) =>
  withSaveAndVerify(
    await new PoolAddressesProviderRegistry__factory(
      await getFirstSigner()
    ).deploy(owner, GLOBAL_OVERRIDES),
    eContractid.PoolAddressesProviderRegistry,
    [owner],
    verify
  );

export const deployACLManager = async (
  provider: tEthereumAddress,
  verify?: boolean
) =>
  withSaveAndVerify(
    await new ACLManager__factory(await getFirstSigner()).deploy(
      provider,
      GLOBAL_OVERRIDES
    ),
    eContractid.ACLManager,
    [provider],
    verify
  );

export const deployConfiguratorLogicLibrary = async (verify?: boolean) =>
  withSaveAndVerify(
    await new ConfiguratorLogic__factory(await getFirstSigner()).deploy(
      GLOBAL_OVERRIDES
    ),
    eContractid.ConfiguratorLogic,
    [],
    verify
  );

export const deployPoolConfigurator = async (verify?: boolean) => {
  const configuratorLogic = await deployConfiguratorLogicLibrary(verify);
  const libraries = {
    ["contracts/protocol/libraries/logic/ConfiguratorLogic.sol:ConfiguratorLogic"]:
      configuratorLogic.address,
  };
  const poolConfiguratorImpl = await new PoolConfigurator__factory(
    libraries,
    await getFirstSigner()
  ).deploy(GLOBAL_OVERRIDES);
  return withSaveAndVerify(
    poolConfiguratorImpl,
    eContractid.PoolConfiguratorImpl,
    [],
    verify,
    libraries
  );
};

export const deploySupplyLogic = async (verify?: boolean) => {
  const supplyLogicArtifact = await readArtifact(eContractid.SupplyLogic);

  const supplyLogicFactory = await DRE.ethers.getContractFactory(
    supplyLogicArtifact.abi,
    supplyLogicArtifact.bytecode
  );
  const supplyLogic = await (
    await supplyLogicFactory
      .connect(await getFirstSigner())
      .deploy(GLOBAL_OVERRIDES)
  ).deployed();

  return withSaveAndVerify(supplyLogic, eContractid.SupplyLogic, [], verify);
};

export const deployFlashClaimLogic = async (verify?: boolean) => {
  const supplyLogicArtifact = await readArtifact(eContractid.FlashClaimLogic);

  const supplyLogicFactory = await DRE.ethers.getContractFactory(
    supplyLogicArtifact.abi,
    supplyLogicArtifact.bytecode
  );
  const supplyLogic = await (
    await supplyLogicFactory
      .connect(await getFirstSigner())
      .deploy(GLOBAL_OVERRIDES)
  ).deployed();

  return withSaveAndVerify(
    supplyLogic,
    eContractid.FlashClaimLogic,
    [],
    verify
  );
};

export const deployBorrowLogic = async (verify?: boolean) => {
  const borrowLogicArtifact = await readArtifact(eContractid.BorrowLogic);

  const borrowLogicFactory = await DRE.ethers.getContractFactory(
    borrowLogicArtifact.abi,
    borrowLogicArtifact.bytecode
  );
  const borrowLogic = await (
    await borrowLogicFactory
      .connect(await getFirstSigner())
      .deploy(GLOBAL_OVERRIDES)
  ).deployed();

  return withSaveAndVerify(borrowLogic, eContractid.BorrowLogic, [], verify);
};

export const deployLiquidationLogic = async (
  libraries: LiquidationLogicLibraryAddresses,
  verify?: boolean
) => {
  const liquidationLibrary = await new LiquidationLogic__factory(
    libraries,
    await getFirstSigner()
  ).deploy(GLOBAL_OVERRIDES);

  return withSaveAndVerify(
    liquidationLibrary,
    eContractid.LiquidationLogic,
    [],
    verify,
    libraries
  );
};

export const deployAuctionLogic = async (verify?: boolean) => {
  const auctionLibrary = await new AuctionLogic__factory(
    await getFirstSigner()
  ).deploy(GLOBAL_OVERRIDES);

  return withSaveAndVerify(
    auctionLibrary,
    eContractid.AuctionLogic,
    [],
    verify
  );
};

export const deployPoolLogic = async (verify?: boolean) => {
  const poolLogicArtifact = await readArtifact(eContractid.PoolLogic);

  const poolLogicFactory = await DRE.ethers.getContractFactory(
    poolLogicArtifact.abi,
    poolLogicArtifact.bytecode
  );
  const poolLogic = await (
    await poolLogicFactory
      .connect(await getFirstSigner())
      .deploy(GLOBAL_OVERRIDES)
  ).deployed();

  return withSaveAndVerify(poolLogic, eContractid.PoolLogic, [], verify);
};

export const deployPoolCoreLibraries = async (
  verify?: boolean
): Promise<PoolCoreLibraryAddresses> => {
  const supplyLogic = await deploySupplyLogic(verify);
  const borrowLogic = await deployBorrowLogic(verify);
  const auctionLogic = await deployAuctionLogic(verify);
  const liquidationLogic = await deployLiquidationLogic(
    {
      ["contracts/protocol/libraries/logic/SupplyLogic.sol:SupplyLogic"]:
        supplyLogic.address,
    },
    verify
  );
  const flashClaimLogic = await deployFlashClaimLogic(verify);

  return {
    ["contracts/protocol/libraries/logic/AuctionLogic.sol:AuctionLogic"]:
      auctionLogic.address,
    ["contracts/protocol/libraries/logic/LiquidationLogic.sol:LiquidationLogic"]:
      liquidationLogic.address,
    ["contracts/protocol/libraries/logic/SupplyLogic.sol:SupplyLogic"]:
      supplyLogic.address,
    ["contracts/protocol/libraries/logic/BorrowLogic.sol:BorrowLogic"]:
      borrowLogic.address,
    ["contracts/protocol/libraries/logic/FlashClaimLogic.sol:FlashClaimLogic"]:
      flashClaimLogic.address,
  };
};

export const deployPoolMarketplaceLibraries = async (
  coreLibraries: PoolCoreLibraryAddresses,
  verify?: boolean
): Promise<PoolMarketplaceLibraryAddresses> => {
  const marketplaceLogic = await deployMarketplaceLogic(
    pick(coreLibraries, [
      "contracts/protocol/libraries/logic/SupplyLogic.sol:SupplyLogic",
      "contracts/protocol/libraries/logic/BorrowLogic.sol:BorrowLogic",
    ]),
    verify
  );
  return {
    ["contracts/protocol/libraries/logic/MarketplaceLogic.sol:MarketplaceLogic"]:
      marketplaceLogic.address,
  };
};

export const deployPoolParametersLibraries = async (
  verify?: boolean
): Promise<PoolParametersLibraryAddresses> => {
  const poolLogic = await deployPoolLogic(verify);
  return {
    ["contracts/protocol/libraries/logic/PoolLogic.sol:PoolLogic"]:
      poolLogic.address,
  };
};

const checkPoolSignatures = () => {
  const poolCoreSelectors = getFunctionSignatures(PoolCore__factory.abi);

  const poolParametersSelectors = getFunctionSignatures(
    PoolParameters__factory.abi
  );

  const poolMarketplaceSelectors = getFunctionSignatures(
    PoolMarketplace__factory.abi
  );

  const poolApeStakingSelectors = getFunctionSignatures(
    PoolApeStaking__factory.abi
  );

  const poolProxySelectors = getFunctionSignatures(ParaProxy__factory.abi);

  const allSelectors = {};
  const poolSelectors = [
    ...poolCoreSelectors,
    ...poolParametersSelectors,
    ...poolMarketplaceSelectors,
    ...poolApeStakingSelectors,
    ...poolProxySelectors,
  ];
  for (const selector of poolSelectors) {
    if (!allSelectors[selector.signature]) {
      allSelectors[selector.signature] = selector;
    } else {
      throw new Error(
        `added function ${selector.name} conflict with exist function:${
          allSelectors[selector.signature].name
        }`
      );
    }
  }

  return {
    poolCoreSelectors,
    poolParametersSelectors,
    poolMarketplaceSelectors,
    poolApeStakingSelectors,
  };
};

export const deployPoolComponents = async (
  provider: string,
  verify?: boolean
) => {
  const coreLibraries = await deployPoolCoreLibraries(verify);
  const marketplaceLibraries = await deployPoolMarketplaceLibraries(
    coreLibraries,
    verify
  );
  const parametersLibraries = await deployPoolParametersLibraries(verify);

  const apeStakingLibraries = pick(coreLibraries, [
    "contracts/protocol/libraries/logic/BorrowLogic.sol:BorrowLogic",
    "contracts/protocol/libraries/logic/SupplyLogic.sol:SupplyLogic",
  ]);

  const poolCore = await new PoolCore__factory(
    coreLibraries,
    await getFirstSigner()
  ).deploy(provider, GLOBAL_OVERRIDES);

  const poolParameters = await new PoolParameters__factory(
    parametersLibraries,
    await getFirstSigner()
  ).deploy(provider, GLOBAL_OVERRIDES);

  const poolMarketplace = await new PoolMarketplace__factory(
    marketplaceLibraries,
    await getFirstSigner()
  ).deploy(provider, GLOBAL_OVERRIDES);

  const poolApeStaking = await new PoolApeStaking__factory(
    apeStakingLibraries,
    await getFirstSigner()
  ).deploy(provider, GLOBAL_OVERRIDES);

  const {
    poolCoreSelectors,
    poolParametersSelectors,
    poolMarketplaceSelectors,
    poolApeStakingSelectors,
  } = checkPoolSignatures();

  return {
    poolCore: await withSaveAndVerify(
      poolCore,
      eContractid.PoolCoreImpl,
      [provider],
      verify,
      coreLibraries,
      poolCoreSelectors
    ),
    poolParameters: await withSaveAndVerify(
      poolParameters,
      eContractid.PoolParametersImpl,
      [provider],
      verify,
      parametersLibraries,
      poolParametersSelectors
    ),
    poolMarketplace: await withSaveAndVerify(
      poolMarketplace,
      eContractid.PoolMarketplaceImpl,
      [provider],
      verify,
      marketplaceLibraries,
      poolMarketplaceSelectors
    ),
    poolApeStaking: await withSaveAndVerify(
      poolApeStaking,
      eContractid.PoolApeStakingImpl,
      [provider],
      verify,
      undefined,
      poolApeStakingSelectors
    ),
    poolCoreSelectors: poolCoreSelectors.map((s) => s.signature),
    poolParametersSelectors: poolParametersSelectors.map((s) => s.signature),
    poolMarketplaceSelectors: poolMarketplaceSelectors.map((s) => s.signature),
    poolApeStakingSelectors: poolApeStakingSelectors.map((s) => s.signature),
  };
};

export const deployPriceOracle = async (verify?: boolean) =>
  withSaveAndVerify(
    await new PriceOracle__factory(await getFirstSigner()).deploy(
      GLOBAL_OVERRIDES
    ),
    eContractid.PriceOracle,
    [],
    verify
  );

export const deployAggregator = async (
  symbol: string,
  price: tStringTokenSmallUnits,
  verify?: boolean
) =>
  withSaveAndVerify(
    await new MockAggregator__factory(await getFirstSigner()).deploy(
      price,
      GLOBAL_OVERRIDES
    ),
    eContractid.Aggregator.concat(`.${symbol}`),
    [price],
    verify
  );

export const deployParaSpaceOracle = async (
  args: [
    tEthereumAddress,
    tEthereumAddress[],
    tEthereumAddress[],
    tEthereumAddress,
    tEthereumAddress,
    string
  ],
  verify?: boolean
) =>
  withSaveAndVerify(
    await new ParaSpaceOracle__factory(await getFirstSigner()).deploy(
      ...args,
      GLOBAL_OVERRIDES
    ),
    eContractid.ParaSpaceOracle,
    [...args],
    verify
  );

export const deployNFTFloorPriceOracle = async (verify?: boolean) => {
  const nftFloorOracle = await withSaveAndVerify(
    await new NFTFloorOracle__factory(await getFirstSigner()).deploy(
      GLOBAL_OVERRIDES
    ),
    eContractid.NFTFloorOracle,
    [],
    verify
  );
  return nftFloorOracle;
};

export const deployProtocolDataProvider = async (
  addressesProvider: tEthereumAddress,
  verify?: boolean
) =>
  withSaveAndVerify(
    await new ProtocolDataProvider__factory(await getFirstSigner()).deploy(
      addressesProvider,
      GLOBAL_OVERRIDES
    ),
    eContractid.ProtocolDataProvider,
    [addressesProvider],
    verify
  );

export const deployMintableERC20 = async (
  args: [string, string, string],
  verify?: boolean
): Promise<MintableERC20> =>
  withSaveAndVerify(
    await new MintableERC20__factory(await getFirstSigner()).deploy(
      ...args,
      GLOBAL_OVERRIDES
    ),
    args[1],
    [...args],
    verify
  );

export const deployMintableERC721 = async (
  args: [string, string, string],
  verify?: boolean
): Promise<MintableERC721> =>
  withSaveAndVerify(
    await new MintableERC721__factory(await getFirstSigner()).deploy(
      ...args,
      GLOBAL_OVERRIDES
    ),
    args[1],
    [...args],
    verify
  );

export const deployMintableDelegationERC20 = async (
  args: [string, string, string],
  verify?: boolean
): Promise<MintableDelegationERC20> =>
  withSaveAndVerify(
    await new MintableDelegationERC20__factory(await getFirstSigner()).deploy(
      ...args,
      GLOBAL_OVERRIDES
    ),
    eContractid.MintableDelegationERC20,
    [...args],
    verify
  );

export const deployMockReserveAuctionStrategy = async (
  args: [string, string, string, string, string, string],
  verify?: boolean
) =>
  withSaveAndVerify(
    await new MockReserveAuctionStrategy__factory(
      await getFirstSigner()
    ).deploy(...args, GLOBAL_OVERRIDES),
    eContractid.MockReserveAuctionStrategy,
    [...args],
    verify
  );

export const deployReserveAuctionStrategy = async (
  strategyName: string,
  args: [string, string, string, string, string, string],
  verify?: boolean
) =>
  withSaveAndVerify(
    await new DefaultReserveAuctionStrategy__factory(
      await getFirstSigner()
    ).deploy(...args, GLOBAL_OVERRIDES),
    strategyName,
    [...args],
    verify
  );

export const deployReserveInterestRateStrategy = async (
  strategyName: string,
  args: [tEthereumAddress, string, string, string, string],
  verify?: boolean
) =>
  withSaveAndVerify(
    await new DefaultReserveInterestRateStrategy__factory(
      await getFirstSigner()
    ).deploy(...args, GLOBAL_OVERRIDES),
    strategyName,
    [...args],
    verify
  );

export const deployGenericVariableDebtToken = async (
  poolAddress: tEthereumAddress,
  verify?: boolean
) =>
  withSaveAndVerify(
    await new VariableDebtToken__factory(await getFirstSigner()).deploy(
      poolAddress,
      GLOBAL_OVERRIDES
    ),
    eContractid.VariableDebtTokenImpl,
    [poolAddress],
    verify
  );

export const deployGenericPToken = async (
  [
    poolAddress,
    underlyingAssetAddress,
    treasuryAddress,
    incentivesController,
    name,
    symbol,
  ]: [
    tEthereumAddress,
    tEthereumAddress,
    tEthereumAddress,
    tEthereumAddress,
    string,
    string
  ],
  verify?: boolean
) => {
  const instance = await withSaveAndVerify(
    await new PToken__factory(await getFirstSigner()).deploy(
      poolAddress,
      GLOBAL_OVERRIDES
    ),
    eContractid.PTokenImpl,
    [poolAddress],
    verify
  );

  await instance.initialize(
    poolAddress,
    treasuryAddress,
    underlyingAssetAddress,
    incentivesController,
    "18",
    name,
    symbol,
    "0x10"
  );

  return instance;
};

export const deployGenericPTokenImpl = async (
  poolAddress: tEthereumAddress,
  verify?: boolean
) =>
  withSaveAndVerify(
    await new PToken__factory(await getFirstSigner()).deploy(
      poolAddress,
      GLOBAL_OVERRIDES
    ),
    eContractid.PTokenImpl,
    [poolAddress],
    verify
  );

export const deployGenericNTokenImpl = async (
  poolAddress: tEthereumAddress,
  atomicPricing: boolean,
  verify?: boolean
) => {
  let mintableERC721Logic;
  mintableERC721Logic = await getMintableERC721Logic();
  if (!mintableERC721Logic) {
    mintableERC721Logic = await deployMintableERC721Logic(verify);
  }

  const libraries = {
    ["contracts/protocol/tokenization/libraries/MintableERC721Logic.sol:MintableERC721Logic"]:
      mintableERC721Logic.address,
  };
  return withSaveAndVerify(
    await new NToken__factory(libraries, await getFirstSigner()).deploy(
      poolAddress,
      atomicPricing,
      GLOBAL_OVERRIDES
    ),
    eContractid.NTokenImpl,
    [poolAddress, atomicPricing],
    verify
  );
};

export const deployUniswapV3NTokenImpl = async (
  poolAddress: tEthereumAddress,
  verify?: boolean
) => {
  let mintableERC721Logic;
  mintableERC721Logic = await getMintableERC721Logic();
  if (!mintableERC721Logic) {
    mintableERC721Logic = await deployMintableERC721Logic(verify);
  }

  const libraries = {
    ["contracts/protocol/tokenization/libraries/MintableERC721Logic.sol:MintableERC721Logic"]:
      mintableERC721Logic.address,
  };
  return withSaveAndVerify(
    await new NTokenUniswapV3__factory(
      libraries,
      await getFirstSigner()
    ).deploy(poolAddress, GLOBAL_OVERRIDES),
    eContractid.NTokenUniswapV3Impl,
    [poolAddress],
    verify
  );
};

export const deployGenericMoonbirdNTokenImpl = async (
  poolAddress: tEthereumAddress,
  verify?: boolean
) => {
  let mintableERC721Logic;
  mintableERC721Logic = await getMintableERC721Logic();
  if (!mintableERC721Logic) {
    mintableERC721Logic = await deployMintableERC721Logic(verify);
  }

  const libraries = {
    ["contracts/protocol/tokenization/libraries/MintableERC721Logic.sol:MintableERC721Logic"]:
      mintableERC721Logic.address,
  };
  return withSaveAndVerify(
    await new NTokenMoonBirds__factory(
      libraries,
      await getFirstSigner()
    ).deploy(poolAddress, GLOBAL_OVERRIDES),
    eContractid.NTokenMoonBirdsImpl,
    [poolAddress],
    verify
  );
};

export const deployDelegationAwarePToken = async (
  [
    poolAddress,
    underlyingAssetAddress,
    treasuryAddress,
    incentivesController,
    name,
    symbol,
  ]: [
    tEthereumAddress,
    tEthereumAddress,
    tEthereumAddress,
    tEthereumAddress,
    string,
    string
  ],
  verify?: boolean
) => {
  const instance = await withSaveAndVerify(
    await new DelegationAwarePToken__factory(await getFirstSigner()).deploy(
      poolAddress,
      GLOBAL_OVERRIDES
    ),
    eContractid.DelegationAwarePTokenImpl,
    [poolAddress],
    verify
  );

  await instance.initialize(
    poolAddress,
    treasuryAddress,
    underlyingAssetAddress,
    incentivesController,
    "18",
    name,
    symbol,
    "0x10"
  );

  return instance;
};

export const deployDelegationAwarePTokenImpl = async (
  poolAddress: tEthereumAddress,
  verify?: boolean
) =>
  withSaveAndVerify(
    await new DelegationAwarePToken__factory(await getFirstSigner()).deploy(
      poolAddress,
      GLOBAL_OVERRIDES
    ),
    eContractid.DelegationAwarePTokenImpl,
    [poolAddress],
    verify
  );

export const deployAllERC20Tokens = async (verify?: boolean) => {
  const tokens: {
    [symbol: string]:
      | MockContract
      | MintableERC20
      | WETH9Mocked
      | StETH
      | MockAToken;
  } = {};

  const paraSpaceConfig = getParaSpaceConfig();
  const reservesConfig = paraSpaceConfig.ReservesConfig;
  const tokensConfig = paraSpaceConfig.Tokens;

  for (const tokenSymbol of Object.keys(ERC20TokenContractId)) {
    const db = getDb();
    const contractAddress = db
      .get(`${tokenSymbol}.${DRE.network.name}`)
      .value()?.address;
    const reserveConfig = reservesConfig[tokenSymbol];
    if (!reserveConfig) {
      continue;
    }

    // if contract address is already in db, then skip to next tokenSymbol
    if (contractAddress) {
      console.log("contract address is already in db ", tokenSymbol);
      continue;
    } else if (tokensConfig[tokenSymbol]) {
      console.log("contract address is already onchain ", tokenSymbol);
      await insertContractAddressInDb(
        tokenSymbol,
        getParaSpaceConfig().Tokens[tokenSymbol],
        false
      );
      continue;
    } else {
      console.log("deploying now ", tokenSymbol);
      if (tokenSymbol === ERC20TokenContractId.WETH) {
        tokens[tokenSymbol] = await deployWETH(verify);
        continue;
      }

      if (tokenSymbol === ERC20TokenContractId.stETH) {
        tokens[tokenSymbol] = await deployStETH(
          [tokenSymbol, tokenSymbol, reserveConfig.reserveDecimals],
          verify
        );
        continue;
      }

      if (tokenSymbol === ERC20TokenContractId.aWETH) {
        tokens[tokenSymbol] = await deployMockAToken(
          [tokenSymbol, tokenSymbol, reserveConfig.reserveDecimals],
          verify
        );
        continue;
      }

      tokens[tokenSymbol] = await deployMintableERC20(
        [tokenSymbol, tokenSymbol, reserveConfig.reserveDecimals],
        verify
      );
    }
  }

  return tokens;
};

export const deployAllERC721Tokens = async (verify?: boolean) => {
  const erc20Tokens = await getAllERC20Tokens();
  const tokens: {
    [symbol: string]:
      | MockContract
      | MintableERC721
      | WPunk
      | CryptoPunksMarket
      | Doodles
      | BoredApeYachtClub
      | MutantApeYachtClub
      | Azuki
      | CloneX
      | Land
      | Meebits
      | Moonbirds
      | Contract;
  } = {};
  const paraSpaceConfig = getParaSpaceConfig();
  const reservesConfig = paraSpaceConfig.ReservesConfig;
  const tokensConfig = paraSpaceConfig.Tokens;

  for (const tokenSymbol of Object.keys(ERC721TokenContractId)) {
    const db = getDb();
    const contractAddress = db
      .get(`${tokenSymbol}.${DRE.network.name}`)
      .value()?.address;
    const reserveConfig = reservesConfig[tokenSymbol];
    if (!reserveConfig) {
      continue;
    }

    // if contract address is already in db, then skip to next tokenSymbol
    if (contractAddress) {
      console.log("contract address is already in db ", tokenSymbol);
      continue;
    } else if (tokensConfig[tokenSymbol]) {
      console.log("contract address is already onchain ", tokenSymbol);
      await insertContractAddressInDb(
        tokenSymbol,
        tokensConfig[tokenSymbol],
        false
      );
      if (
        tokenSymbol === ERC721TokenContractId.UniswapV3 &&
        paraSpaceConfig.Uniswap.V3Factory
      ) {
        await insertContractAddressInDb(
          eContractid.UniswapV3Factory,
          paraSpaceConfig.Uniswap.V3Factory,
          false
        );
      }
      if (
        tokenSymbol === ERC721TokenContractId.WPUNKS &&
        paraSpaceConfig.Tokens.PUNKS
      ) {
        await insertContractAddressInDb(
          eContractid.PUNKS,
          paraSpaceConfig.Tokens.PUNKS,
          false
        );
      }
      continue;
    } else {
      console.log("deploying now ", tokenSymbol);

      // we are using hardhat, we want to use mock ERC721 contracts
      if (tokenSymbol === ERC721TokenContractId.WPUNKS) {
        const punks = await deployPunks([], verify);
        tokens[eContractid.PUNKS] = punks;
        tokens[tokenSymbol] = await deployWPunks([punks.address], verify);
        continue;
      }

      if (tokenSymbol === ERC721TokenContractId.BAYC) {
        tokens[tokenSymbol] = await deployBAYC(
          [tokenSymbol, tokenSymbol, "8000", "0"],
          verify
        );
        continue;
      }

      if (tokenSymbol === ERC721TokenContractId.MAYC) {
        tokens[tokenSymbol] = await deployMAYC(
          [tokenSymbol, tokenSymbol, ZERO_ADDRESS, ZERO_ADDRESS],
          verify
        );
        const bakc = await deployMintableERC721(["BAKC", "BAKC", ""], verify);

        const apeCoinStaking = await deployApeCoinStaking(
          [
            erc20Tokens.APE.address,
            tokens.BAYC.address,
            tokens.MAYC.address,
            bakc.address,
          ],
          verify
        );
        const amount = await convertToCurrencyDecimals(
          erc20Tokens.APE.address,
          "94694400"
        );

        await apeCoinStaking.addTimeRange(
          0,
          amount,
          "1666771200",
          "1761465600",
          amount,
          GLOBAL_OVERRIDES
        );
        await apeCoinStaking.addTimeRange(
          1,
          amount,
          "1666771200",
          "1761465600",
          amount,
          GLOBAL_OVERRIDES
        );
        await apeCoinStaking.addTimeRange(
          2,
          amount,
          "1666771200",
          "1761465600",
          amount,
          GLOBAL_OVERRIDES
        );
        await apeCoinStaking.addTimeRange(
          3,
          amount,
          "1666771200",
          "1761465600",
          amount,
          GLOBAL_OVERRIDES
        );
        continue;
      }

      if (tokenSymbol === ERC721TokenContractId.DOODLE) {
        tokens[tokenSymbol] = await deployDoodle([], verify);
        continue;
      }

      if (tokenSymbol === ERC721TokenContractId.AZUKI) {
        tokens[tokenSymbol] = await deployAzuki([5, 10000, 8900, 200], verify);
        continue;
      }

      if (tokenSymbol === ERC721TokenContractId.CLONEX) {
        tokens[tokenSymbol] = await deployCloneX([], verify);
        continue;
      }

      if (tokenSymbol === ERC721TokenContractId.MEEBITS) {
        const punks = await getPunks();
        tokens[tokenSymbol] = await deployMeebits(
          [punks.address, ZERO_ADDRESS, paraSpaceConfig.ParaSpaceTeam],
          verify
        );
        continue;
      }

      if (tokenSymbol === ERC721TokenContractId.OTHR) {
        tokens[tokenSymbol] = await deployOTHR(
          [
            "OTHR",
            "OTHR",
            [ZERO_ADDRESS, ZERO_ADDRESS, ZERO_ADDRESS],
            [10, 100, 1000, 10000],
            [[paraSpaceConfig.ParaSpaceTeam, 100]],
            paraSpaceConfig.ParaSpaceTeam,
            paraSpaceConfig.ParaSpaceTeam,
            "0x63616e6469646174653100000000000000000000000000000000000000000000",
            5,
            paraSpaceConfig.ParaSpaceTeam,
          ],
          verify
        );
        continue;
      }

      if (tokenSymbol === ERC721TokenContractId.MOONBIRD) {
        tokens[tokenSymbol] = await deployMoonbirds(
          [
            "MOON",
            "MOON",
            "0x0000000000000000000000000000000000000000",
            paraSpaceConfig.ParaSpaceTeam,
            paraSpaceConfig.ParaSpaceTeam,
          ],
          verify
        );
        await (tokens[tokenSymbol] as Moonbirds).setNestingOpen(
          true,
          GLOBAL_OVERRIDES
        );
        continue;
      }

      if (tokenSymbol === ERC721TokenContractId.UniswapV3) {
        const weth = await getWETH();
        const positionDescriptor =
          await deployNonfungibleTokenPositionDescriptor(
            [
              weth.address,
              // 'ETH' as a bytes32 string
              "0x4554480000000000000000000000000000000000000000000000000000000000",
            ],
            verify
          );
        const factory = await deployUniswapV3Factory([], verify);
        await deployUniswapSwapRouter([factory.address, weth.address], verify);
        const nonfungiblePositionManager =
          await deployNonfungiblePositionManager(
            [factory.address, weth.address, positionDescriptor.address],
            verify
          );
        tokens[tokenSymbol] = nonfungiblePositionManager;
        continue;
      }

      tokens[tokenSymbol] = await deployMintableERC721(
        [tokenSymbol, tokenSymbol, ""],
        verify
      );
    }
  }

  return tokens;
};

export const deployMoonbirds = async (
  args: [string, string, tEthereumAddress, tEthereumAddress, tEthereumAddress],
  verify?: boolean
) =>
  withSaveAndVerify(
    await new Moonbirds__factory(await getFirstSigner()).deploy(
      ...args,
      GLOBAL_OVERRIDES
    ),
    eContractid.MOONBIRD,
    [...args],
    verify
  );

export const deployReservesSetupHelper = async (verify?: boolean) =>
  withSaveAndVerify(
    await new ReservesSetupHelper__factory(await getFirstSigner()).deploy(
      GLOBAL_OVERRIDES
    ),
    eContractid.ReservesSetupHelper,
    [],
    verify
  );

export const deployInitializableImmutableAdminUpgradeabilityProxy = async (
  args: [tEthereumAddress],
  verify?: boolean
) =>
  withSaveAndVerify(
    await new InitializableImmutableAdminUpgradeabilityProxy__factory(
      await getFirstSigner()
    ).deploy(...args, GLOBAL_OVERRIDES),
    eContractid.InitializableImmutableAdminUpgradeabilityProxy,
    [...args],
    verify
  );

export const deployWETH = async (verify?: boolean) =>
  withSaveAndVerify(
    await new WETH9Mocked__factory(await getFirstSigner()).deploy(
      GLOBAL_OVERRIDES
    ),
    eContractid.WETH,
    [],
    verify
  );

export const deployMockVariableDebtToken = async (
  args: [
    tEthereumAddress,
    tEthereumAddress,
    tEthereumAddress,
    string,
    string,
    string
  ],
  verify?: boolean
) => {
  const instance = await withSaveAndVerify(
    await new MockVariableDebtToken__factory(await getFirstSigner()).deploy(
      args[0],
      GLOBAL_OVERRIDES
    ),
    eContractid.MockVariableDebtToken,
    [args[0]],
    verify
  );

  await instance.initialize(
    args[0],
    args[1],
    args[2],
    "18",
    args[3],
    args[4],
    args[5],
    GLOBAL_OVERRIDES
  );

  return instance;
};

export const deployMockNToken = async (
  args: [
    tEthereumAddress,
    tEthereumAddress,
    tEthereumAddress,
    string,
    string,
    string
  ],
  verify?: boolean
) => {
  let mintableERC721Logic;
  mintableERC721Logic = await getMintableERC721Logic();
  if (!mintableERC721Logic) {
    mintableERC721Logic = await deployMintableERC721Logic(verify);
  }

  const libraries = {
    ["contracts/protocol/tokenization/libraries/MintableERC721Logic.sol:MintableERC721Logic"]:
      mintableERC721Logic.address,
  };

  const instance = await withSaveAndVerify(
    await new MockNToken__factory(libraries, await getFirstSigner()).deploy(
      args[0],
      GLOBAL_OVERRIDES
    ),
    eContractid.MockNToken,
    [args[0], false],
    verify
  );

  await instance.initialize(
    args[0],
    args[1],
    args[2],
    args[3],
    args[4],
    args[5],
    GLOBAL_OVERRIDES
  );

  return instance;
};

export const deployMockPToken = async (
  args: [
    tEthereumAddress,
    tEthereumAddress,
    tEthereumAddress,
    tEthereumAddress,
    string,
    string,
    string
  ],
  verify?: boolean
) => {
  const instance = await withSaveAndVerify(
    await new MockPToken__factory(await getFirstSigner()).deploy(
      args[0],
      GLOBAL_OVERRIDES
    ),
    eContractid.MockPToken,
    [args[0]],
    verify
  );

  await instance.initialize(
    args[0],
    args[2],
    args[1],
    args[3],
    "18",
    args[4],
    args[5],
    args[6],
    GLOBAL_OVERRIDES
  );

  return instance;
};

export const deployMockIncentivesController = async (verify?: boolean) =>
  withSaveAndVerify(
    await new MockIncentivesController__factory(await getFirstSigner()).deploy(
      GLOBAL_OVERRIDES
    ),
    eContractid.MockIncentivesController,
    [],
    verify
  );

export const deployMockReserveConfiguration = async (verify?: boolean) =>
  withSaveAndVerify(
    await new MockReserveConfiguration__factory(await getFirstSigner()).deploy(
      GLOBAL_OVERRIDES
    ),
    eContractid.MockReserveConfiguration,
    [],
    verify
  );

// export const deployMockPool = async (verify?: boolean) =>
//   withSaveAndVerify(
//     await new MockPool__factory(await getFirstSigner()).deploy(GLOBAL_OVERRIDES),
//     eContractid.MockPool,
//     [],
//     verify
//   );

export const deployMockInitializableImple = async (verify?: boolean) =>
  withSaveAndVerify(
    await new MockInitializableImple__factory(await getFirstSigner()).deploy(
      GLOBAL_OVERRIDES
    ),
    eContractid.MockInitializableImple,
    [],
    verify
  );

export const deployMockInitializableImpleV2 = async (verify?: boolean) =>
  withSaveAndVerify(
    await new MockInitializableImpleV2__factory(await getFirstSigner()).deploy(
      GLOBAL_OVERRIDES
    ),
    eContractid.MockInitializableImpleV2,
    [],
    verify
  );

export const deployMockInitializableFromConstructorImple = async (
  args: [string],
  verify?: boolean
) =>
  withSaveAndVerify(
    await new MockInitializableFromConstructorImple__factory(
      await getFirstSigner()
    ).deploy(...args, GLOBAL_OVERRIDES),
    eContractid.MockInitializableFromConstructorImple,
    [...args],
    verify
  );

export const deployMockReentrantInitializableImple = async (verify?: boolean) =>
  withSaveAndVerify(
    await new MockReentrantInitializableImple__factory(
      await getFirstSigner()
    ).deploy(GLOBAL_OVERRIDES),
    eContractid.MockReentrantInitializableImple,
    [],
    verify
  );

export const deployUiPoolDataProvider = async (
  arg1: string,
  arg2: string,
  verify?: boolean
) =>
  withSaveAndVerify(
    await new UiPoolDataProvider__factory(await getFirstSigner()).deploy(
      arg1,
      arg2,
      GLOBAL_OVERRIDES
    ),
    eContractid.UiPoolDataProvider,
    [arg1, arg2],
    verify
  );

export const deployUiIncentiveDataProvider = async (verify?: boolean) =>
  withSaveAndVerify(
    await new UiIncentiveDataProvider__factory(await getFirstSigner()).deploy(
      GLOBAL_OVERRIDES
    ),
    eContractid.UiIncentiveDataProvider,
    [],
    verify
  );

export const deployWalletBalanceProvider = async (verify?: boolean) =>
  withSaveAndVerify(
    await new WalletBalanceProvider__factory(await getFirstSigner()).deploy(
      GLOBAL_OVERRIDES
    ),
    eContractid.WalletBalanceProvider,
    [],
    verify
  );

export const deployWETHGateway = async (
  weth: string,
  pool: Address,
  verify?: boolean
) =>
  withSaveAndVerify(
    await new WETHGateway__factory(await getFirstSigner()).deploy(
      weth,
      pool,
      GLOBAL_OVERRIDES
    ),
    eContractid.WETHGatewayImpl,
    [weth, pool],
    verify
  );

export const deployWETHGatewayProxy = async (
  admin: string,
  wethGateway: string,
  initData: string,
  verify?: boolean
) => {
  const wethGatewayProxy =
    await new InitializableImmutableAdminUpgradeabilityProxy__factory(
      await getFirstSigner()
    ).deploy(admin, GLOBAL_OVERRIDES);
  await wethGatewayProxy["initialize(address,bytes)"](
    wethGateway,
    initData,
    GLOBAL_OVERRIDES
  );
  return withSaveAndVerify(
    wethGatewayProxy,
    eContractid.WETHGatewayProxy,
    [admin],
    verify
  );
};

export const deployMoonbirdHelper = async (verify?: boolean) => {
  const moonBirdHelperArtifact = await readArtifact(eContractid.MoonBirdHelper);

  const moonBirdHelperFactory = await DRE.ethers.getContractFactory(
    moonBirdHelperArtifact.abi,
    moonBirdHelperArtifact.bytecode
  );
  const moonBirdHelper = await (
    await moonBirdHelperFactory
      .connect(await getFirstSigner())
      .deploy(GLOBAL_OVERRIDES)
  ).deployed();

  return withSaveAndVerify(moonBirdHelper, eContractid.PoolLogic, [], verify);
};

export const deployMeebits = async (
  args: [tEthereumAddress, tEthereumAddress, tEthereumAddress],
  verify?: boolean
) =>
  withSaveAndVerify(
    await new Meebits__factory(await getFirstSigner()).deploy(
      ...args,
      GLOBAL_OVERRIDES
    ),
    eContractid.Meebits,
    [...args],
    verify
  );

export const deployAzuki = async (
  args: [number, number, number, number],
  verify?: boolean
) =>
  withSaveAndVerify(
    await new Azuki__factory(await getFirstSigner()).deploy(
      ...args,
      GLOBAL_OVERRIDES
    ),
    eContractid.Azuki,
    [...args],
    verify
  );

export const deployOTHR = async (
  // eslint-disable-next-line
  args: [any, any, any, any, any, any, any, any, any, any],
  verify?: boolean
) =>
  withSaveAndVerify(
    await new Land__factory(await getFirstSigner()).deploy(
      ...args,
      GLOBAL_OVERRIDES
    ),
    eContractid.OTHR,
    [...args],
    verify
  );

export const deployCloneX = async (args: [], verify?: boolean) =>
  withSaveAndVerify(
    await new CloneX__factory(await getFirstSigner()).deploy(
      ...args,
      GLOBAL_OVERRIDES
    ),
    eContractid.CloneX,
    [...args],
    verify
  );

export const deployDoodle = async (args: [], verify?: boolean) =>
  withSaveAndVerify(
    await new Doodles__factory(await getFirstSigner()).deploy(
      ...args,
      GLOBAL_OVERRIDES
    ),
    eContractid.Doodles,
    [...args],
    verify
  );

export const deployMAYC = async (
  args: [string, string, string, string],
  verify?: boolean
) =>
  withSaveAndVerify(
    await new MutantApeYachtClub__factory(await getFirstSigner()).deploy(
      ...args,
      GLOBAL_OVERRIDES
    ),
    eContractid.MutantApeYachtClub,
    [...args],
    verify
  );

export const deployBAYC = async (
  args: [string, string, string, string],
  verify?: boolean
) =>
  withSaveAndVerify(
    await new BoredApeYachtClub__factory(await getFirstSigner()).deploy(
      ...args,
      GLOBAL_OVERRIDES
    ),
    eContractid.BoredApeYachtClub,
    [...args],
    verify
  );

export const deployERC721OracleWrapper = async (
  addressesProvider: string,
  oracleAddress: string,
  asset: string,
  symbol: string,
  verify?: boolean
) =>
  withSaveAndVerify(
    await new ERC721OracleWrapper__factory(await getFirstSigner()).deploy(
      addressesProvider,
      oracleAddress,
      asset,
      GLOBAL_OVERRIDES
    ),
    eContractid.Aggregator.concat(`.${symbol}`),
    [addressesProvider, oracleAddress, asset],
    verify
  );

export const deployPunks = async (args: [], verify?: boolean) =>
  withSaveAndVerify(
    await new CryptoPunksMarket__factory(await getFirstSigner()).deploy(
      ...args,
      GLOBAL_OVERRIDES
    ),
    eContractid.PUNKS,
    [...args],
    verify
  );

export const deployWPunks = async (
  args: [tEthereumAddress],
  verify?: boolean
) =>
  withSaveAndVerify(
    await new WPunk__factory(await getFirstSigner()).deploy(
      ...args,
      GLOBAL_OVERRIDES
    ),
    eContractid.WPunk,
    [...args],
    verify
  );

export const deployPunkGateway = async (
  args: [
    tEthereumAddress,
    tEthereumAddress,
    // tEthereumAddress,
    tEthereumAddress
  ],
  verify?: boolean
) => {
  const punkImpl = await new WPunkGateway__factory(
    await getFirstSigner()
  ).deploy(...args, GLOBAL_OVERRIDES);
  return withSaveAndVerify(
    punkImpl,
    eContractid.WPunkGatewayImpl,
    [...args],
    verify
  );
};

export const deployPunkGatewayProxy = async (
  admin: string,
  punkGateway: string,
  initData: string,
  verify?: boolean
) => {
  const punkGatewayProxy =
    await new InitializableImmutableAdminUpgradeabilityProxy__factory(
      await getFirstSigner()
    ).deploy(admin, GLOBAL_OVERRIDES);
  await punkGatewayProxy["initialize(address,bytes)"](
    punkGateway,
    initData,
    GLOBAL_OVERRIDES
  );
  return withSaveAndVerify(
    punkGatewayProxy,
    eContractid.WPunkGatewayProxy,
    [admin],
    verify
  );
};

// export const deployParaSpaceToken = async (verify?: boolean) => {
//   const paraspaceToken = await new ParaSpaceToken__factory(
//     await getFirstSigner()
//   ).deploy(GLOBAL_OVERRIDES);
//
//   return withSaveAndVerify(paraspaceToken, eContractid.ParaSpace, [], verify);
// };
//
// export const deployStakedParaSpace = async (
//   args: [string, string, string, string, string, string, string, string],
//   verify?: boolean
// ) => {
//   const paraspaceStakeV3 = await new StakedParaSpaceV3__factory(
//     await getFirstSigner()
//   ).deploy(...args, GLOBAL_OVERRIDES);
//
//   return withSaveAndVerify(
//     paraspaceStakeV3,
//     eContractid.sParaSpace,
//     [...args],
//     verify
//   );
// };
//
// export const deployRewardsController = async (
//   emissionManager: string,
//   verify?: boolean
// ) => {
//   console.log("deploying reward controller");
//   const rewardsController = await new RewardsController__factory(
//     await getFirstSigner()
//   ).deploy(emissionManager, GLOBAL_OVERRIDES);
//
//   return withSaveAndVerify(
//     rewardsController,
//     eContractid.RewardsController,
//     [emissionManager],
//     verify
//   );
// };
//
// export const deployPCV = async (
//   stakedParaSpace: string,
//   paraspace: string,
//   verify?: boolean
// ) => {
//   const pcv = await new PCV__factory(await getFirstSigner()).deploy(
//     stakedParaSpace,
//     paraspace
//   );
//
//   return withSaveAndVerify(
//     pcv,
//     eContractid.PCV,
//     [stakedParaSpace, paraspace],
//     verify
//   );
// };

export const deployParaSpaceFallbackOracle = async (
  args: [string, string, string, string, string],
  verify?: boolean
) => {
  const fallBackOracle = await new ParaSpaceFallbackOracle__factory(
    await getFirstSigner()
  ).deploy(...args, GLOBAL_OVERRIDES);

  return withSaveAndVerify(
    fallBackOracle,
    eContractid.PriceOracle,
    [...args],
    verify
  );
};

export const deployMockTokenFaucet = async (
  erc20configs,
  erc721configs,
  punkConfig,
  verify?: boolean
) =>
  withSaveAndVerify(
    await new MockTokenFaucet__factory(await getFirstSigner()).deploy(
      erc20configs,
      erc721configs,
      punkConfig,
      GLOBAL_OVERRIDES
    ),
    eContractid.MockTokenFaucet,
    [erc20configs, erc721configs, punkConfig],
    verify
  );

export const deploySeaportAdapter = async (verify?: boolean) => {
  const seaportAdapter = await new SeaportAdapter__factory(
    await getFirstSigner()
  ).deploy(GLOBAL_OVERRIDES);

  return withSaveAndVerify(
    seaportAdapter,
    eContractid.SeaportAdapter,
    [],
    verify
  );
};

export const deployLooksRareAdapter = async (verify?: boolean) => {
  const looksRareAdapter = await new LooksRareAdapter__factory(
    await getFirstSigner()
  ).deploy(GLOBAL_OVERRIDES);

  return withSaveAndVerify(
    looksRareAdapter,
    eContractid.LooksRareAdapter,
    [],
    verify
  );
};

export const deployX2Y2Adapter = async (verify?: boolean) => {
  const x2y2Adapter = await new X2Y2Adapter__factory(
    await getFirstSigner()
  ).deploy(GLOBAL_OVERRIDES);

  return withSaveAndVerify(x2y2Adapter, eContractid.X2Y2Adapter, [], verify);
};

export const deployMarketplaceLogic = async (
  libraries: MarketplaceLogicLibraryAddresses,
  verify?: boolean
) => {
  const marketplaceLogic = await new MarketplaceLogic__factory(
    libraries,
    await getFirstSigner()
  ).deploy(GLOBAL_OVERRIDES);

  return withSaveAndVerify(
    marketplaceLogic,
    eContractid.MarketplaceLogic,
    [],
    verify,
    libraries
  );
};

export const deployConduitController = async (verify?: boolean) =>
  withSaveAndVerify(
    await new ConduitController__factory(await getFirstSigner()).deploy(
      GLOBAL_OVERRIDES
    ),
    eContractid.ConduitController,
    [],
    verify
  );

export const deployPausableZoneController = async (
  owner: tEthereumAddress,
  verify?: boolean
) =>
  withSaveAndVerify(
    await new PausableZoneController__factory(await getFirstSigner()).deploy(
      owner,
      GLOBAL_OVERRIDES
    ),
    eContractid.PausableZoneController,
    [owner],
    verify
  );

export const deploySeaport = async (
  conduitController: string,
  verify?: boolean
) =>
  withSaveAndVerify(
    await new Seaport__factory(await getFirstSigner()).deploy(
      conduitController,
      GLOBAL_OVERRIDES
    ),
    eContractid.Seaport,
    [conduitController],
    verify
  );

export const deployCurrencyManager = async (verify?: boolean) =>
  withSaveAndVerify(
    await new CurrencyManager__factory(await getFirstSigner()).deploy(
      GLOBAL_OVERRIDES
    ),
    eContractid.CurrencyManager,
    [],
    verify
  );

export const deployExecutionManager = async (verify?: boolean) =>
  withSaveAndVerify(
    await new ExecutionManager__factory(await getFirstSigner()).deploy(
      GLOBAL_OVERRIDES
    ),
    eContractid.ExecutionManager,
    [],
    verify
  );

export const deployLooksRareExchange = async (
  currencyManager: string,
  executionManager: string,
  royaltyFeeManager: string,
  weth: string,
  protocolFeeRecipient: string,
  verify?: boolean
) =>
  withSaveAndVerify(
    await new LooksRareExchange__factory(await getFirstSigner()).deploy(
      currencyManager,
      executionManager,
      royaltyFeeManager,
      weth,
      protocolFeeRecipient,
      GLOBAL_OVERRIDES
    ),
    eContractid.LooksRareExchange,
    [
      currencyManager,
      executionManager,
      royaltyFeeManager,
      weth,
      protocolFeeRecipient,
    ],
    verify
  );

export const deployRoyaltyFeeManager = async (
  royaltyFeeRegistry: string,
  verify?: boolean
) =>
  withSaveAndVerify(
    await new RoyaltyFeeManager__factory(await getFirstSigner()).deploy(
      royaltyFeeRegistry,
      GLOBAL_OVERRIDES
    ),
    eContractid.RoyaltyFeeManager,
    [royaltyFeeRegistry],
    verify
  );

export const deployRoyaltyFeeRegistry = async (
  royaltyFeeLimit: string,
  verify?: boolean
) =>
  withSaveAndVerify(
    await new RoyaltyFeeRegistry__factory(await getFirstSigner()).deploy(
      royaltyFeeLimit,
      GLOBAL_OVERRIDES
    ),
    eContractid.RoyaltyFeeRegistry,
    [royaltyFeeLimit],
    verify
  );

export const deployTransferSelectorNFT = async (
  transferManagerERC721: string,
  transferManagerERC1155: string,
  verify?: boolean
) =>
  withSaveAndVerify(
    await new TransferSelectorNFT__factory(await getFirstSigner()).deploy(
      transferManagerERC721,
      transferManagerERC1155,
      GLOBAL_OVERRIDES
    ),
    eContractid.TransferSelectorNFT,
    [transferManagerERC721, transferManagerERC1155],
    verify
  );

export const deployTransferManagerERC721 = async (
  looksRareExchange: string,
  verify?: boolean
) =>
  withSaveAndVerify(
    await new TransferManagerERC721__factory(await getFirstSigner()).deploy(
      looksRareExchange,
      GLOBAL_OVERRIDES
    ),
    eContractid.TransferManagerERC721,
    [looksRareExchange],
    verify
  );

export const deployTransferManagerERC1155 = async (
  looksRareExchange: string,
  verify?: boolean
) =>
  withSaveAndVerify(
    await new TransferManagerERC1155__factory(await getFirstSigner()).deploy(
      looksRareExchange,
      GLOBAL_OVERRIDES
    ),
    eContractid.TransferManagerERC1155,
    [looksRareExchange],
    verify
  );

export const deployStrategyStandardSaleForFixedPrice = async (
  protocolFee: string,
  verify?: boolean
) =>
  withSaveAndVerify(
    await new StrategyStandardSaleForFixedPrice__factory(
      await getFirstSigner()
    ).deploy(protocolFee, GLOBAL_OVERRIDES),
    eContractid.StrategyStandardSaleForFixedPrice,
    [protocolFee],
    verify
  );

export const deployX2Y2R1 = async (verify?: boolean) =>
  withSaveAndVerify(
    await new X2Y2R1__factory(await getFirstSigner()).deploy(GLOBAL_OVERRIDES),
    eContractid.X2Y2R1,
    [],
    verify
  );

export const deployERC721Delegate = async (verify?: boolean) =>
  withSaveAndVerify(
    await new ERC721Delegate__factory(await getFirstSigner()).deploy(
      GLOBAL_OVERRIDES
    ),
    eContractid.ERC721Delegate,
    [],
    verify
  );

export const deployUniswapV3Factory = async (args: [], verify?: boolean) => {
  const uniswapV3Factory = await new UniswapV3Factory__factory(
    await getFirstSigner()
  ).deploy(...args, GLOBAL_OVERRIDES);
  return withSaveAndVerify(
    uniswapV3Factory,
    eContractid.UniswapV3Factory,
    [...args],
    verify
  );
};

export const deployNonfungibleTokenPositionDescriptor = async (
  args: [string, string],
  verify?: boolean
) => {
  const nFTDescriptorFactory = await (
    await DRE.ethers.getContractFactoryFromArtifact(nFTDescriptor)
  )
    .connect(await getFirstSigner())
    .deploy(GLOBAL_OVERRIDES);

  const nftDescriptorLibraryContract = await withSaveAndVerify(
    nFTDescriptorFactory,
    eContractid.NFTDescriptor,
    [],
    verify
  );
  const libraries = {
    NFTDescriptor: nftDescriptorLibraryContract.address,
  };
  const nonfungibleTokenPositionDescriptorFactory = await (
    await DRE.ethers.getContractFactoryFromArtifact(
      nonfungibleTokenPositionDescriptor,
      {
        libraries,
      }
    )
  )
    .connect(await getFirstSigner())
    .deploy(...args, GLOBAL_OVERRIDES);

  return withSaveAndVerify(
    nonfungibleTokenPositionDescriptorFactory,
    eContractid.NonfungibleTokenPositionDescriptor,
    [...args],
    verify,
    libraries
  );
};

export const deployUniswapV3OracleWrapper = async (
  factory: string,
  manager: string,
  addressProvider: string,
  verify?: boolean
) =>
  withSaveAndVerify(
    await new UniswapV3OracleWrapper__factory(await getFirstSigner()).deploy(
      factory,
      manager,
      addressProvider,
      GLOBAL_OVERRIDES
    ),
    eContractid.Aggregator.concat(`.${eContractid.UniswapV3}`),
    [factory, manager, addressProvider],
    verify
  );

export const deployNonfungiblePositionManager = async (
  args: [string, string, string],
  verify?: boolean
) => {
  const nonfungiblePositionManagerFactory = await (
    await DRE.ethers.getContractFactoryFromArtifact(nonfungiblePositionManager)
  )
    .connect(await getFirstSigner())
    .deploy(...args, GLOBAL_OVERRIDES);

  return withSaveAndVerify(
    nonfungiblePositionManagerFactory,
    eContractid.UniswapV3,
    [...args],
    verify
  );
};

export const deployUniswapSwapRouter = async (
  args: [string, string],
  verify?: boolean
) => {
  const swapRouter = await (
    await DRE.ethers.getContractFactoryFromArtifact(uniSwapRouter)
  )
    .connect(await getFirstSigner())
    .deploy(...args, GLOBAL_OVERRIDES);

  return withSaveAndVerify(
    swapRouter,
    eContractid.UniswapV3SwapRouter,
    [...args],
    verify
  );
};

export const deployStETH = async (
  args: [string, string, string],
  verify?: boolean
): Promise<StETH> =>
  withSaveAndVerify(
    await new StETH__factory(await getFirstSigner()).deploy(
      ...args,
      GLOBAL_OVERRIDES
    ),
    args[1],
    [...args],
    verify
  );

export const deployMockAToken = async (
  args: [string, string, string],
  verify?: boolean
): Promise<MockAToken> =>
  withSaveAndVerify(
    await new MockAToken__factory(await getFirstSigner()).deploy(
      ...args,
      GLOBAL_OVERRIDES
    ),
    args[1],
    [...args],
    verify
  );

export const deployPTokenAToken = async (
  poolAddress: tEthereumAddress,
  verify?: boolean
) =>
  withSaveAndVerify(
    await new PTokenAToken__factory(await getFirstSigner()).deploy(
      poolAddress,
      GLOBAL_OVERRIDES
    ),
    eContractid.PTokenATokenImpl,
    [poolAddress],
    verify
  );

export const deployPTokenStETH = async (
  poolAddress: tEthereumAddress,
  verify?: boolean
) =>
  withSaveAndVerify(
    await new PTokenStETH__factory(await getFirstSigner()).deploy(
      poolAddress,
      GLOBAL_OVERRIDES
    ),
    eContractid.PTokenStETHImpl,
    [poolAddress],
    verify
  );

export const deployPTokenSApe = async (
  poolAddress: tEthereumAddress,
  verify?: boolean
) =>
  withSaveAndVerify(
    await new PTokenSApe__factory(await getFirstSigner()).deploy(
      poolAddress,
      GLOBAL_OVERRIDES
    ),
    eContractid.PTokenSApeImpl,
    [poolAddress],
    verify
  );

export const deployUserFlashClaimRegistry = async (
  poolAddress: tEthereumAddress,
  verify?: boolean
) =>
  withSaveAndVerify(
    await new UserFlashclaimRegistry__factory(await getFirstSigner()).deploy(
      poolAddress,
      GLOBAL_OVERRIDES
    ),
    eContractid.FlashClaimRegistry,
    [poolAddress],
    verify
  );

export const deployMockAirdropProject = async (
  underlyingAddress: tEthereumAddress,
  verify?: boolean
) =>
  withSaveAndVerify(
    await new MockAirdropProject__factory(await getFirstSigner()).deploy(
      underlyingAddress,
      GLOBAL_OVERRIDES
    ),
    eContractid.MockAirdropProject,
    [underlyingAddress],
    verify
  );

export const deployApeCoinStaking = async (
  args: [string, string, string, string],
  verify?: boolean
) =>
  withSaveAndVerify(
    await new ApeCoinStaking__factory(await getFirstSigner()).deploy(
      ...args,
      GLOBAL_OVERRIDES
    ),
    eContractid.ApeCoinStaking,
    [...args],
    verify
  );

export const deployApeStakingLogic = async (verify?: boolean) => {
  const apeStakingLogicArtifact = await readArtifact(
    eContractid.ApeStakingLogic
  );

  const apeStakingLogicFactory = await DRE.ethers.getContractFactory(
    apeStakingLogicArtifact.abi,
    apeStakingLogicArtifact.bytecode
  );
  const apeStakingLogic = await (
    await apeStakingLogicFactory
      .connect(await getFirstSigner())
      .deploy(GLOBAL_OVERRIDES)
  ).deployed();

  return withSaveAndVerify(
    apeStakingLogic,
    eContractid.ApeStakingLogic,
    [],
    verify
  );
};

export const deployNTokenBAYCImpl = async (
  apeCoinStaking: tEthereumAddress,
  poolAddress: tEthereumAddress,
  verify?: boolean
) => {
  let apeStakingLogic;
  apeStakingLogic = await getApeStakingLogic();
  if (!apeStakingLogic) {
    apeStakingLogic = await deployApeStakingLogic(verify);
  }
  let mintableERC721Logic;
  mintableERC721Logic = await getMintableERC721Logic();
  if (!mintableERC721Logic) {
    mintableERC721Logic = await deployMintableERC721Logic(verify);
  }

  const libraries = {
    ["contracts/protocol/tokenization/libraries/ApeStakingLogic.sol:ApeStakingLogic"]:
      apeStakingLogic.address,
    ["contracts/protocol/tokenization/libraries/MintableERC721Logic.sol:MintableERC721Logic"]:
      mintableERC721Logic.address,
  };

  return withSaveAndVerify(
    await new NTokenBAYC__factory(libraries, await getFirstSigner()).deploy(
      poolAddress,
      apeCoinStaking,
      GLOBAL_OVERRIDES
    ),
    eContractid.NTokenBAYCImpl,
    [poolAddress, apeCoinStaking],
    verify
  );
};

export const deployNTokenMAYCImpl = async (
  apeCoinStaking: tEthereumAddress,
  poolAddress: tEthereumAddress,
  verify?: boolean
) => {
  let apeStakingLogic;
  apeStakingLogic = await getApeStakingLogic();
  if (!apeStakingLogic) {
    apeStakingLogic = await deployApeStakingLogic();
  }
  let mintableERC721Logic;
  mintableERC721Logic = await getMintableERC721Logic();
  if (!mintableERC721Logic) {
    mintableERC721Logic = await deployMintableERC721Logic(verify);
  }

  const libraries = {
    ["contracts/protocol/tokenization/libraries/ApeStakingLogic.sol:ApeStakingLogic"]:
      apeStakingLogic.address,
    ["contracts/protocol/tokenization/libraries/MintableERC721Logic.sol:MintableERC721Logic"]:
      mintableERC721Logic.address,
  };
  return withSaveAndVerify(
    await new NTokenMAYC__factory(libraries, await getFirstSigner()).deploy(
      poolAddress,
      apeCoinStaking,
      GLOBAL_OVERRIDES
    ),
    eContractid.NTokenMAYCImpl,
    [poolAddress, apeCoinStaking],
    verify
  );
};
export const deployATokenDebtToken = async (
  poolAddress: tEthereumAddress,
  verify?: boolean
) =>
  withSaveAndVerify(
    await new ATokenDebtToken__factory(await getFirstSigner()).deploy(
      poolAddress,
      GLOBAL_OVERRIDES
    ),
    eContractid.ATokenDebtToken,
    [poolAddress],
    verify
  );

export const deployStETHDebtToken = async (
  poolAddress: tEthereumAddress,
  verify?: boolean
) =>
  withSaveAndVerify(
    await new StETHDebtToken__factory(await getFirstSigner()).deploy(
      poolAddress,
      GLOBAL_OVERRIDES
    ),
    eContractid.StETHDebtToken,
    [poolAddress],
    verify
  );

export const deployMintableERC721Logic = async (verify?: boolean) => {
  const mintableERC721LogicArtifact = await readArtifact(
    eContractid.MintableERC721Logic
  );

  const mintableERC721LogicFactory = await DRE.ethers.getContractFactory(
    mintableERC721LogicArtifact.abi,
    mintableERC721LogicArtifact.bytecode
  );
  const mintableERC721Logic = await (
    await mintableERC721LogicFactory
      .connect(await getFirstSigner())
      .deploy(GLOBAL_OVERRIDES)
  ).deployed();

  return withSaveAndVerify(
    mintableERC721Logic,
    eContractid.MintableERC721Logic,
    [],
    verify
  );
};
