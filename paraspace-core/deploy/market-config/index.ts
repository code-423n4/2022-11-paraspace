import {eEthereumNetwork, IParaSpaceConfiguration} from "../helpers/types";
import {MocksConfig} from "./mocks";
import {MainnetOracleConfig, TestnetOracleConfig} from "./oracle";
import {
  strategyDAI,
  strategyUSDC,
  strategyUSDT,
  strategyWETH,
  strategyBAYC,
  strategyWPunks,
  strategyAPE,
  strategyWBTC,
  strategySTETH,
  strategyMAYC,
  strategyDoodles,
  strategyAWETH,
  strategyCETH,
  strategyPUNK,
  strategyMoonbird,
  strategyAzuki,
  strategyOthr,
  strategyUniswapV3,
  strategyClonex,
  strategyMeebits,
  strategySAPE,
} from "./reservesConfigs";

export const CommonConfig: Pick<
  IParaSpaceConfiguration,
  | "MarketId"
  | "PTokenNamePrefix"
  | "VariableDebtTokenNamePrefix"
  | "SymbolPrefix"
  | "ProviderId"
  | "AuctionRecoveryHealthFactor"
  | "ParaSpaceAdmin"
  | "EmergencyAdmins"
  | "RiskAdmin"
  | "GatewayAdmin"
  | "ParaSpaceAdminIndex"
  | "EmergencyAdminIndex"
  | "RiskAdminIndex"
  | "GatewayAdminIndex"
  | "Mocks"
  | "Oracle"
> = {
  MarketId: "ParaSpaceMM",
  PTokenNamePrefix: "ParaSpace Derivative Token",
  VariableDebtTokenNamePrefix: "ParaSpace Variable Debt Token",
  SymbolPrefix: "",
  ProviderId: 1,
  AuctionRecoveryHealthFactor: "1500000000000000000",
  // ACL CONFIGURATION
  ParaSpaceAdmin: undefined,
  EmergencyAdmins: [],
  RiskAdmin: undefined,
  GatewayAdmin: undefined,
  ParaSpaceAdminIndex: 4, // ACL Admin, Pool Admin, Asset Listing Admin
  EmergencyAdminIndex: 3, // Emergency Admin, >1 is a must to make tests pass
  RiskAdminIndex: 2, // Risk Admin, >1 is a must to make tests pass
  GatewayAdminIndex: 1, // Gateway Admin, for polkadot evm only 5 accounts initialized
  // MOCKS
  Mocks: MocksConfig,
  // Oracle
  Oracle: TestnetOracleConfig,
};

export const HardhatParaSpaceConfig: IParaSpaceConfiguration = {
  // BASIC INFO
  ...CommonConfig,
  ParaSpaceTeam: "0xc783df8a850f42e7F7e57013759C285caa701eB6",
  Treasury: "0xc783df8a850f42e7F7e57013759C285caa701eB6",
  Tokens: {
    sAPE: "0x0000000000000000000000000000000000000001",
  },
  BendDAO: {},
  Uniswap: {},
  Marketplace: {},
  Chainlink: {},
  // RESERVE ASSETS - CONFIG, ASSETS, BORROW RATES,
  ReservesConfig: {
    DAI: strategyDAI,
    USDC: strategyUSDC,
    USDT: strategyUSDT,
    WETH: strategyWETH,
    APE: strategyAPE,
    sAPE: strategySAPE,
    WBTC: strategyWBTC,
    stETH: strategySTETH,
    aWETH: strategyAWETH,
    cETH: strategyCETH,
    PUNK: strategyPUNK,
    DOODLE: strategyDoodles,
    BAYC: strategyBAYC,
    MAYC: strategyMAYC,
    WPUNKS: strategyWPunks,
    MOONBIRD: strategyMoonbird,
    MEEBITS: strategyMeebits,
    AZUKI: strategyAzuki,
    OTHR: strategyOthr,
    CLONEX: strategyClonex,
    UniswapV3: strategyUniswapV3,
  },
};

export const GoerliParaSpaceConfig: IParaSpaceConfiguration = {
  // BASIC INFO
  ...CommonConfig,
  ParaSpaceTeam: "0x018281853eCC543Aa251732e8FDaa7323247eBeB",
  Treasury: "0x018281853eCC543Aa251732e8FDaa7323247eBeB",
  ParaSpaceAdmin: "0x018281853eCC543Aa251732e8FDaa7323247eBeB",
  EmergencyAdmins: ["0x018281853eCC543Aa251732e8FDaa7323247eBeB"],
  RiskAdmin: "0x018281853eCC543Aa251732e8FDaa7323247eBeB",
  GatewayAdmin: "0x018281853eCC543Aa251732e8FDaa7323247eBeB",
  Tokens: {
    sAPE: "0x0000000000000000000000000000000000000001",
    WETH: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
    UniswapV3: "0xC36442b4a4522E871399CD717aBDD847Ab11FE88",
  },
  BendDAO: {},
  Uniswap: {
    V2Factory: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f",
    V2Router: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
    V3Factory: "0x1F98431c8aD98523631AE4a59f267346ea31F984",
    V3NFTPositionManager: "0xC36442b4a4522E871399CD717aBDD847Ab11FE88",
  },
  Marketplace: {
    Seaport: "0x00000000006c3852cbEf3e08E8dF289169EdE581",
  },
  Chainlink: {
    WETH: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e",
    BAYC: "0xB677bfBc9B09a3469695f40477d05bc9BcB15F50",
    MAYC: "0xCbDcc8788019226d09FcCEb4C727C48A062D8124",
    CLONEX: "0xE42f272EdF974e9c70a6d38dCb47CAB2A28CED3F",
    WPUNKS: "0x5c13b249846540F81c093Bc342b5d963a7518145",
    DOODLE: "0xEDA76D1C345AcA04c6910f5824EC337C8a8F36d2",
    AZUKI: "0x9F6d70CDf08d893f0063742b51d3E9D1e18b7f74",
  },
  // RESERVE ASSETS - CONFIG, ASSETS, BORROW RATES,
  ReservesConfig: {
    DAI: strategyDAI,
    USDC: strategyUSDC,
    USDT: strategyUSDT,
    WETH: strategyWETH,
    APE: strategyAPE,
    sAPE: strategySAPE,
    WBTC: strategyWBTC,
    stETH: strategySTETH,
    aWETH: strategyAWETH,
    cETH: strategyCETH,
    PUNK: strategyPUNK,
    DOODLE: strategyDoodles,
    BAYC: strategyBAYC,
    MAYC: strategyMAYC,
    WPUNKS: strategyWPunks,
    MOONBIRD: strategyMoonbird,
    MEEBITS: strategyMeebits,
    AZUKI: strategyAzuki,
    OTHR: strategyOthr,
    CLONEX: strategyClonex,
    UniswapV3: strategyUniswapV3,
  },
};

export const MainnetParaSpaceConfig: IParaSpaceConfiguration = {
  // BASIC INFO
  ...CommonConfig,
  ParaSpaceAdmin: "0x17816E9A858b161c3E37016D139cf618056CaCD4",
  EmergencyAdmins: [
    "0x17816E9A858b161c3E37016D139cf618056CaCD4",
    "0x69FAD68De47D5666Ad668C7D682dDb8FD6322949",
    "0xD65Fee206a4ea89eBBcF4694E745C597AB6F8325",
    "0x755C1bd877788739dD002B98B093c4852AbfA6c4",
    "0x3A6c796edffc057d789F7d4ffAd438B1D48f3075",
    "0x2f2d07d60ea7330DD2314f4413CCbB2dC25276EF",
    "0x001e2bcC5c1BfC3131d33Ba074B12c2F1237FB04",
  ],
  RiskAdmin: "0x17816E9A858b161c3E37016D139cf618056CaCD4",
  GatewayAdmin: "0x17816E9A858b161c3E37016D139cf618056CaCD4",
  ParaSpaceTeam: "0x17816E9A858b161c3E37016D139cf618056CaCD4",
  Treasury: "0x17816E9A858b161c3E37016D139cf618056CaCD4",
  Tokens: {
    sAPE: "0x0000000000000000000000000000000000000001",
    WETH: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    USDC: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    DAI: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    USDT: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    WBTC: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
    APE: "0x4d224452801ACEd8B2F0aebE155379bb5D594381",
    BAYC: "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D",
    MAYC: "0x60E4d786628Fea6478F785A6d7e704777c86a7c6",
    PUNKS: "0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB",
    WPUNKS: "0xb7F7F6C52F2e2fdb1963Eab30438024864c313F6",
    DOODLE: "0x8a90CAb2b38dba80c64b7734e58Ee1dB38B8992e",
    MOONBIRD: "0x23581767a106ae21c074b2276d25e5c3e136a68b",
    MEEBITS: "0x7bd29408f11d2bfc23c34f18275bbf23bb716bc7",
    AZUKI: "0xed5af388653567af2f388e6224dc7c4b3241c544",
    OTHR: "0x34d85c9cdeb23fa97cb08333b511ac86e1c4e258",
    CLONEX: "0x49cf6f5d44e70224e2e23fdcdd2c053f30ada28b",
    // UniswapV3: "0xC36442b4a4522E871399CD717aBDD847Ab11FE88",
  },
  BendDAO: {
    Oracle: "0x7c2a19e54e48718f6c60908a9cff3396e4ea1eba",
  },
  Uniswap: {
    V2Factory: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f",
    V2Router: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
    V3Factory: "0x1F98431c8aD98523631AE4a59f267346ea31F984",
    V3NFTPositionManager: "0xC36442b4a4522E871399CD717aBDD847Ab11FE88",
  },
  Marketplace: {
    Seaport: "0x00000000006c3852cbEf3e08E8dF289169EdE581",
  },
  Chainlink: {
    WETH: "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419",
    DAI: "0x773616E4d11A78F511299002da57A0a94577F1f4",
    USDC: "0x986b5E1e1755e3C2440e960477f25201B0a8bbD4",
    USDT: "0xEe9F2375b4bdF6387aa8265dD4FB8F16512A1d46",
    WBTC: "0xdeb288F737066589598e9214E782fa5A8eD689e8",
    APE: "0xc7de7f4d4C9c991fF62a07D18b3E31e349833A18",
    sAPE: "0xc7de7f4d4C9c991fF62a07D18b3E31e349833A18",
  },
  ReservesConfig: {
    DAI: strategyDAI,
    USDC: strategyUSDC,
    USDT: strategyUSDT,
    WETH: strategyWETH,
    APE: strategyAPE,
    sAPE: strategySAPE,
    WBTC: strategyWBTC,
    DOODLE: strategyDoodles,
    BAYC: strategyBAYC,
    MAYC: strategyMAYC,
    WPUNKS: strategyWPunks,
    MOONBIRD: strategyMoonbird,
    MEEBITS: strategyMeebits,
    AZUKI: strategyAzuki,
    OTHR: strategyOthr,
    CLONEX: strategyClonex,
    // UniswapV3: strategyUniswapV3,
  },
  Mocks: undefined,
  Oracle: MainnetOracleConfig,
};

export const ParaSpaceConfigs: Partial<
  Record<eEthereumNetwork, IParaSpaceConfiguration>
> = {
  [eEthereumNetwork.hardhat]: HardhatParaSpaceConfig,
  [eEthereumNetwork.localhost]: HardhatParaSpaceConfig,
  [eEthereumNetwork.goerli]: GoerliParaSpaceConfig,
  [eEthereumNetwork.mainnet]: MainnetParaSpaceConfig,
};
