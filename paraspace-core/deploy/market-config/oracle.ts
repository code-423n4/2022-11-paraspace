import {IOracleConfig} from "../helpers/types";

export const MainnetOracleConfig: IOracleConfig = {
  ExpirationPeriod: 1800,
  DeviationRate: 300,
  Nodes: [],
};

export const TestnetOracleConfig: IOracleConfig = {
  ExpirationPeriod: 600,
  DeviationRate: 1000,
  Nodes: [],
};
