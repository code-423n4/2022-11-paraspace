import {
  eContractid,
  ERC20TokenContractId,
  ERC721TokenContractId,
  iMultiPoolsAssets,
  IReserveParams,
  tEthereumAddress,
} from "./types";
import {ProtocolDataProvider} from "../../types";
import {chunk, isLocalTestnet, isPublicTestnet, waitForTx} from "./misc-utils";
import {
  getACLManager,
  getReservesSetupHelper,
  getPoolAddressesProvider,
  getPoolConfiguratorProxy,
  getPoolProxy,
  getApeCoinStaking,
} from "./contracts-getters";
import {insertContractAddressInDb} from "./contracts-helpers";
import {BigNumber, BigNumberish} from "ethers";
import {GLOBAL_OVERRIDES} from "./hardhat-constants";
import {
  deployReserveInterestRateStrategy,
  deployDelegationAwarePTokenImpl,
  deployGenericPTokenImpl,
  deployGenericNTokenImpl,
  deployGenericVariableDebtToken,
  deployGenericMoonbirdNTokenImpl,
  deployUniswapV3NTokenImpl,
  deployReserveAuctionStrategy,
  deployPTokenStETH,
  deployPTokenAToken,
  deployNTokenBAYCImpl,
  deployNTokenMAYCImpl,
  deployATokenDebtToken,
  deployStETHDebtToken,
  deployPTokenSApe,
} from "./contracts-deployments";
import {ZERO_ADDRESS} from "./constants";

export const initReservesByHelper = async (
  reservesParams: iMultiPoolsAssets<IReserveParams>,
  tokenAddresses: {[symbol: string]: tEthereumAddress},
  xTokenNamePrefix: string,
  variableDebtTokenNamePrefix: string,
  symbolPrefix: string,
  admin: tEthereumAddress,
  treasuryAddress: tEthereumAddress,
  incentivesController: tEthereumAddress,
  verify: boolean,
  genericPTokenImplAddress?: tEthereumAddress,
  genericNTokenImplAddress?: tEthereumAddress,
  genericVariableDebtTokenAddress?: tEthereumAddress,
  defaultReserveInterestRateStrategyAddress?: tEthereumAddress,
  defaultReserveAuctionStrategyAddress?: tEthereumAddress,
  delegationAwarePTokenImpl?: tEthereumAddress,
  poolAddressesProviderProxy?: tEthereumAddress,
  poolProxy?: tEthereumAddress,
  poolConfiguratorProxyAddress?: tEthereumAddress
): Promise<BigNumber> => {
  const gasUsage = BigNumber.from("0");

  const addressProvider = await getPoolAddressesProvider(
    poolAddressesProviderProxy
  );
  const pool = await getPoolProxy(poolProxy);
  // CHUNK CONFIGURATION
  const initChunks = 4;

  // Initialize variables for future reserves initialization
  const reserveTokens: string[] = [];
  const reserveInitDecimals: string[] = [];
  const reserveSymbols: string[] = [];

  const initInputParams: {
    xTokenImpl: string;
    assetType: BigNumberish;
    variableDebtTokenImpl: string;
    underlyingAssetDecimals: BigNumberish;
    interestRateStrategyAddress: string;
    auctionStrategyAddress: string;
    underlyingAsset: string;
    treasury: string;
    incentivesController: string;
    underlyingAssetName: string;
    xTokenName: string;
    xTokenSymbol: string;
    variableDebtTokenName: string;
    variableDebtTokenSymbol: string;
    params: string;
    atomicPricing?: boolean;
  }[] = [];

  let strategyRates: [
    string, // addresses provider
    string,
    string,
    string,
    string
  ];
  const rateStrategies: Record<string, typeof strategyRates> = {};
  const strategyAddresses: Record<string, tEthereumAddress> = {};
  const auctionStrategyAddresses: Record<string, tEthereumAddress> = {};
  const strategyAddressPerAsset: Record<string, string> = {};
  const auctionStrategyAddressPerAsset: Record<string, string> = {};
  const xTokenType: Record<string, string> = {};
  let delegationAwarePTokenImplementationAddress = "";
  let pTokenImplementationAddress = "";
  let nTokenImplementationAddress = "";
  let nTokenMoonBirdImplementationAddress = "";
  let nTokenUniSwapV3ImplementationAddress = "";
  let variableDebtTokenImplementationAddress = "";

  if (!genericVariableDebtTokenAddress) {
    variableDebtTokenImplementationAddress = await (
      await deployGenericVariableDebtToken(pool.address, verify)
    ).address;
    genericVariableDebtTokenAddress = variableDebtTokenImplementationAddress;
  } else {
    variableDebtTokenImplementationAddress = genericVariableDebtTokenAddress;
  }

  if (!genericPTokenImplAddress) {
    const pTokenImplementation = await deployGenericPTokenImpl(
      pool.address,
      verify
    );
    pTokenImplementationAddress = pTokenImplementation.address;
  } else {
    pTokenImplementationAddress = genericPTokenImplAddress;
  }

  if (!genericNTokenImplAddress) {
    const nTokenImplementation = await deployGenericNTokenImpl(
      pool.address,
      false,
      verify
    );
    nTokenImplementationAddress = nTokenImplementation.address;
  } else {
    nTokenImplementationAddress = genericNTokenImplAddress;
  }
  const nTokenMoonBirdImplementation = await deployGenericMoonbirdNTokenImpl(
    pool.address,
    verify
  );

  const nTokenUniSwapV3 = await deployUniswapV3NTokenImpl(pool.address, verify);

  nTokenMoonBirdImplementationAddress = nTokenMoonBirdImplementation.address;

  nTokenUniSwapV3ImplementationAddress = nTokenUniSwapV3.address;

  const delegatedAwareReserves = Object.entries(reservesParams).filter(
    ([, {xTokenImpl}]) => xTokenImpl === eContractid.DelegationAwarePTokenImpl
  ) as [string, IReserveParams][];

  if (delegatedAwareReserves.length > 0) {
    if (delegationAwarePTokenImpl) {
      delegationAwarePTokenImplementationAddress = delegationAwarePTokenImpl;
      await insertContractAddressInDb(
        eContractid.DelegationAwarePTokenImpl,
        delegationAwarePTokenImplementationAddress,
        false
      );
    } else {
      const delegationAwarePTokenImplementation =
        await deployDelegationAwarePTokenImpl(pool.address, verify);
      delegationAwarePTokenImplementationAddress =
        delegationAwarePTokenImplementation.address;
    }
  }

  const reserves = Object.entries(reservesParams).filter(
    ([, {xTokenImpl}]) =>
      xTokenImpl === eContractid.DelegationAwarePTokenImpl ||
      xTokenImpl === eContractid.PTokenImpl ||
      xTokenImpl === eContractid.NTokenImpl ||
      xTokenImpl === eContractid.NTokenBAYCImpl ||
      xTokenImpl === eContractid.NTokenMAYCImpl ||
      xTokenImpl === eContractid.NTokenMoonBirdsImpl ||
      xTokenImpl === eContractid.NTokenUniswapV3Impl ||
      xTokenImpl === eContractid.PTokenStETHImpl ||
      xTokenImpl === eContractid.PTokenATokenImpl ||
      xTokenImpl === eContractid.PTokenSApeImpl
  ) as [string, IReserveParams][];

  for (const [symbol, params] of reserves) {
    if (!tokenAddresses[symbol]) {
      console.log(
        `- Skipping init of ${symbol} due token address is not set at markets config`
      );
      continue;
    }
    const {strategy, auctionStrategy, xTokenImpl, reserveDecimals} = params;
    const {
      optimalUsageRatio,
      baseVariableBorrowRate,
      variableRateSlope1,
      variableRateSlope2,
    } = strategy;
    const {
      maxPriceMultiplier,
      minExpPriceMultiplier,
      minPriceMultiplier,
      stepLinear,
      stepExp,
      tickLength,
    } = auctionStrategy;
    if (!strategyAddresses[strategy.name]) {
      // Strategy does not exist, create a new one
      rateStrategies[strategy.name] = [
        addressProvider.address,
        optimalUsageRatio,
        baseVariableBorrowRate,
        variableRateSlope1,
        variableRateSlope2,
      ];
      if (defaultReserveInterestRateStrategyAddress) {
        strategyAddresses[strategy.name] =
          defaultReserveInterestRateStrategyAddress;
        insertContractAddressInDb(
          strategy.name,
          strategyAddresses[strategy.name],
          false
        );
      } else {
        strategyAddresses[strategy.name] = (
          await deployReserveInterestRateStrategy(
            strategy.name,
            rateStrategies[strategy.name],
            verify
          )
        ).address;
      }
    }
    if (!auctionStrategyAddresses[auctionStrategy.name]) {
      if (auctionStrategy.name == "auctionStrategyZero") {
        auctionStrategyAddresses[auctionStrategy.name] = ZERO_ADDRESS;
      } else if (defaultReserveAuctionStrategyAddress) {
        auctionStrategyAddresses[auctionStrategy.name] =
          defaultReserveAuctionStrategyAddress;
        await insertContractAddressInDb(
          auctionStrategy.name,
          auctionStrategyAddresses[auctionStrategy.name],
          false
        );
      } else {
        // Strategy does not exist, create a new one
        auctionStrategyAddresses[auctionStrategy.name] = (
          await deployReserveAuctionStrategy(
            auctionStrategy.name,
            [
              maxPriceMultiplier,
              minExpPriceMultiplier,
              minPriceMultiplier,
              stepLinear,
              stepExp,
              tickLength,
            ],
            verify
          )
        ).address;
      }
    }

    strategyAddressPerAsset[symbol] = strategyAddresses[strategy.name];
    auctionStrategyAddressPerAsset[symbol] =
      auctionStrategyAddresses[auctionStrategy.name];
    console.log(
      "Strategy address for asset %s: %s",
      symbol,
      strategyAddressPerAsset[symbol]
    );
    console.log(
      "Auction strategy address for asset %s: %s",
      symbol,
      auctionStrategyAddressPerAsset[symbol]
    );

    if (xTokenImpl === eContractid.DelegationAwarePTokenImpl) {
      xTokenType[symbol] = "delegation aware";
    } else if (
      [
        eContractid.NTokenImpl,
        eContractid.NTokenMoonBirdsImpl,
        eContractid.NTokenUniswapV3Impl,
        eContractid.NTokenBAYCImpl,
        eContractid.NTokenMAYCImpl,
      ].includes(xTokenImpl)
    ) {
      xTokenType[symbol] = "nft";
    } else {
      xTokenType[symbol] = "generic";
    }

    reserveInitDecimals.push(reserveDecimals);
    reserveTokens.push(tokenAddresses[symbol]);
    reserveSymbols.push(symbol);
  }

  for (let i = 0; i < reserveSymbols.length; i++) {
    let xTokenToUse: string;
    if (xTokenType[reserveSymbols[i]] === "generic") {
      if (reserveSymbols[i] === ERC20TokenContractId.stETH) {
        xTokenToUse = (await deployPTokenStETH(pool.address, verify)).address;
        variableDebtTokenImplementationAddress = (
          await deployStETHDebtToken(pool.address, verify)
        ).address;
      } else if (reserveSymbols[i] === ERC20TokenContractId.aWETH) {
        xTokenToUse = (await deployPTokenAToken(pool.address, verify)).address;
        variableDebtTokenImplementationAddress = (
          await deployATokenDebtToken(pool.address, verify)
        ).address;
      } else if (reserveSymbols[i] === ERC20TokenContractId.sAPE) {
        xTokenToUse = (await deployPTokenSApe(pool.address, verify)).address;
        variableDebtTokenImplementationAddress =
          genericVariableDebtTokenAddress;
      } else {
        xTokenToUse = pTokenImplementationAddress;
        variableDebtTokenImplementationAddress =
          genericVariableDebtTokenAddress;
      }
    } else if (xTokenType[reserveSymbols[i]] === "nft") {
      if (reserveSymbols[i] === ERC721TokenContractId.MOONBIRD) {
        console.log("IS MOONBIRDS");
        xTokenToUse = nTokenMoonBirdImplementationAddress;
      } else if (reserveSymbols[i] === ERC721TokenContractId.UniswapV3) {
        console.log("IS UniSwapV3");
        xTokenToUse = nTokenUniSwapV3ImplementationAddress;
      } else if (reserveSymbols[i] === ERC721TokenContractId.BAYC) {
        console.log("IS BAYC");
        if (!isLocalTestnet() && !isPublicTestnet()) {
          xTokenToUse = nTokenImplementationAddress;
        } else {
          const apeCoinStaking = await getApeCoinStaking();
          const nTokenBAYC = await deployNTokenBAYCImpl(
            apeCoinStaking.address,
            pool.address,
            verify
          );
          xTokenToUse = nTokenBAYC.address;
        }
      } else if (reserveSymbols[i] === ERC721TokenContractId.MAYC) {
        console.log("IS MAYC");
        if (!isLocalTestnet() && !isPublicTestnet()) {
          xTokenToUse = nTokenImplementationAddress;
        } else {
          const apeCoinStaking = await getApeCoinStaking();
          const nTokenMAYC = await deployNTokenMAYCImpl(
            apeCoinStaking.address,
            pool.address,
            verify
          );
          xTokenToUse = nTokenMAYC.address;
        }
      } else {
        console.log("IS", reserveSymbols[i]);
        xTokenToUse = nTokenImplementationAddress;
      }
    } else {
      xTokenToUse = delegationAwarePTokenImplementationAddress;
    }

    initInputParams.push({
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      xTokenImpl: xTokenToUse!,
      assetType: xTokenType[reserveSymbols[i]] == "nft" ? 1 : 0,
      variableDebtTokenImpl: variableDebtTokenImplementationAddress,
      underlyingAssetDecimals: reserveInitDecimals[i],
      interestRateStrategyAddress: strategyAddressPerAsset[reserveSymbols[i]],
      auctionStrategyAddress: auctionStrategyAddressPerAsset[reserveSymbols[i]],
      underlyingAsset: reserveTokens[i],
      treasury: treasuryAddress,
      incentivesController,
      underlyingAssetName: reserveSymbols[i],
      xTokenName: `${xTokenNamePrefix} ${reserveSymbols[i]}`,
      xTokenSymbol:
        xTokenType[reserveSymbols[i]] === "nft"
          ? `n${symbolPrefix}${reserveSymbols[i]}`
          : `p${symbolPrefix}${reserveSymbols[i]}`,
      variableDebtTokenName: `${variableDebtTokenNamePrefix} ${symbolPrefix}${reserveSymbols[i]}`,
      variableDebtTokenSymbol: `vDebt${symbolPrefix}${reserveSymbols[i]}`,
      params: "0x10",
    });
  }

  // Deploy init reserves per chunks
  const chunkedSymbols = chunk(reserveSymbols, initChunks);
  const chunkedInitInputParams = chunk(initInputParams, initChunks);

  const configurator = await getPoolConfiguratorProxy(
    poolConfiguratorProxyAddress
  );
  //await waitForTx(await addressProvider.setPoolAdmin(admin));

  console.log(
    `- Reserves initialization in ${chunkedInitInputParams.length} txs`
  );
  for (
    let chunkIndex = 0;
    chunkIndex < chunkedInitInputParams.length;
    chunkIndex++
  ) {
    const tx = await waitForTx(
      await configurator.initReserves(
        chunkedInitInputParams[chunkIndex],
        GLOBAL_OVERRIDES
      )
    );

    console.log(
      `  - Reserve ready for: ${chunkedSymbols[chunkIndex].join(", ")}`
    );
    console.log("    * gasUsed", tx.gasUsed.toString());
  }

  return gasUsage; // Deprecated
};

export const configureReservesByHelper = async (
  reservesParams: iMultiPoolsAssets<IReserveParams>,
  tokenAddresses: {[symbol: string]: tEthereumAddress},
  helpers: ProtocolDataProvider,
  admin: tEthereumAddress,
  poolAddressesProviderProxyAddress?: tEthereumAddress,
  aclManagerAddress?: tEthereumAddress,
  reservesSetupHelperAddress?: tEthereumAddress
) => {
  const addressProvider = await getPoolAddressesProvider(
    poolAddressesProviderProxyAddress
  );
  const aclManager = await getACLManager(aclManagerAddress);
  const reservesSetupHelper = await getReservesSetupHelper(
    reservesSetupHelperAddress
  );

  const tokens: string[] = [];
  const symbols: string[] = [];

  const inputParams: {
    asset: string;
    baseLTV: BigNumberish;
    liquidationProtocolFeePercentage: BigNumberish;
    liquidationThreshold: BigNumberish;
    liquidationBonus: BigNumberish;
    reserveFactor: BigNumberish;
    borrowCap: BigNumberish;
    supplyCap: BigNumberish;
    borrowingEnabled: boolean;
  }[] = [];

  for (const [
    assetSymbol,
    {
      baseLTVAsCollateral,
      liquidationBonus,
      liquidationProtocolFeePercentage,
      liquidationThreshold,
      reserveFactor,
      borrowCap,
      supplyCap,
      borrowingEnabled,
    },
  ] of Object.entries(reservesParams) as [string, IReserveParams][]) {
    if (!tokenAddresses[assetSymbol]) {
      console.log(
        `- Skipping init of ${assetSymbol} due token address is not set at markets config`
      );
      continue;
    }
    if (baseLTVAsCollateral === "-1") continue;

    const assetAddressIndex = Object.keys(tokenAddresses).findIndex(
      (value) => value === assetSymbol
    );
    const [, tokenAddress] = (
      Object.entries(tokenAddresses) as [string, string][]
    )[assetAddressIndex];
    const {usageAsCollateralEnabled: alreadyEnabled} =
      await helpers.getReserveConfigurationData(tokenAddress);

    if (alreadyEnabled) {
      console.log(
        `- Reserve ${assetSymbol} is already enabled as collateral, skipping`
      );
      continue;
    }
    // Push data
    console.log(assetSymbol, tokenAddress);
    inputParams.push({
      asset: tokenAddress,
      baseLTV: baseLTVAsCollateral,
      liquidationProtocolFeePercentage,
      liquidationThreshold,
      liquidationBonus,
      reserveFactor,
      borrowCap,
      supplyCap,
      borrowingEnabled: borrowingEnabled,
    });

    tokens.push(tokenAddress);
    symbols.push(assetSymbol);
  }
  if (tokens.length) {
    // Add reservesSetupHelper as temporal admin
    await waitForTx(
      await aclManager.addPoolAdmin(
        reservesSetupHelper.address,
        GLOBAL_OVERRIDES
      )
    );

    // Deploy init per chunks
    const enableChunks = 20;
    const chunkedSymbols = chunk(symbols, enableChunks);
    const chunkedInputParams = chunk(inputParams, enableChunks);
    const poolConfiguratorAddress = await addressProvider.getPoolConfigurator();

    console.log(`- Configure reserves in ${chunkedInputParams.length} txs`);
    for (
      let chunkIndex = 0;
      chunkIndex < chunkedInputParams.length;
      chunkIndex++
    ) {
      await waitForTx(
        await reservesSetupHelper.configureReserves(
          poolConfiguratorAddress,
          chunkedInputParams[chunkIndex],
          GLOBAL_OVERRIDES
        )
      );
      console.log(`  - Init for: ${chunkedSymbols[chunkIndex].join(", ")}`);
    }
    // Remove reservesSetupHelper as admin
    await waitForTx(
      await aclManager.removePoolAdmin(
        reservesSetupHelper.address,
        GLOBAL_OVERRIDES
      )
    );
  }
};
