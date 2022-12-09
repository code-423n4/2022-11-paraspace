import {Overrides} from "@ethersproject/contracts";
import dotenv from "dotenv";
import {ethers} from "ethers";

dotenv.config();

export const HARDHAT_CHAINID = 31337;
export const GOERLI_CHAINID = 5;
export const FORK_CHAINID = 522;
export const MAINNET_CHAINID = 1;
export const PARALLEL_CHAINID = 1592;

export const INFURA_KEY = process.env.INFURA_KEY || "";
export const ALCHEMY_KEY = process.env.ALCHEMY_KEY || "";

export const TENDERLY_FORK_ID = process.env.TENDERLY_FORK_ID || "";
export const TENDERLY_HEAD_ID = process.env.TENDERLY_HEAD_ID || "";
export const TENDERLY = process.env.TENDERLY === "true";
export const TENDERLY_PROJECT = process.env.TENDERLY_PROJECT || "";
export const TENDERLY_USERNAME = process.env.TENDERLY_USERNAME || "";

export const DEFENDER = process.env.DEFENDER === "true";
export const DEFENDER_API_KEY = process.env.DEFENDER_API_KEY || "";
export const DEFENDER_SECRET_KEY = process.env.DEFENDER_SECRET_KEY || "";

export const FORK = process.env.FORK || "";
export const FORK_BLOCK_NUMBER = process.env.FORK_BLOCK_NUMBER
  ? parseInt(process.env.FORK_BLOCK_NUMBER)
  : 0;

export const DEFAULT_BLOCK_GAS_LIMIT = 30000000;
export const HARDFORK = "london";
export const MOCHA_JOBS = parseInt(process.env.MOCHA_JOBS || "4");

export const REPORT_GAS = process.env.REPORT_GAS == "true" ? true : false;

export const DB_PATH = process.env.DB_PATH ?? ":memory:";

export const ETHERSCAN_KEY = process.env.ETHERSCAN_KEY || "";
export const ETHERSCAN_VERIFICATION =
  process.env.ETHERSCAN_VERIFICATION === "true" ? true : false;
export const ETHERSCAN_VERIFICATION_CONTRACTS =
  process.env.ETHERSCAN_VERIFICATION_CONTRACTS?.trim().split(/\s?,\s?/);
export const ETHERSCAN_VERIFICATION_JOBS = parseInt(
  process.env.ETHERSCAN_VERIFICATION_JOBS || "1"
);
export const ETHERSCAN_VERIFICATION_MAX_RETRIES = parseInt(
  process.env.ETHERSCAN_VERIFICATION_MAX_RETRIES || "3"
);

export const DEPLOY_START = parseInt(process.env.DEPLOY_START || "0");
export const DEPLOY_END = parseInt(process.env.DEPLOY_END || "21");

export const DEPLOYER_MNEMONIC =
  process.env.DEPLOYER_MNEMONIC ||
  "bottom drive obey lake curtain smoke basket hold race lonely fit walk";

export const BLOCKSCOUT_DISABLE_INDEXER =
  process.env.BLOCKSCOUT_DISABLE_INDEXER == "false" ? false : true;

export const GLOBAL_OVERRIDES: Overrides = {
  maxFeePerGas: ethers.utils.parseUnits("90", "gwei"),
  maxPriorityFeePerGas: ethers.utils.parseUnits("3", "gwei"),
  gasLimit: 12_450_000,
  type: 2,
};
