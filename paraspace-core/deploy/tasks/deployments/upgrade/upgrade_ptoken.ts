import {waitForTx} from "../../../helpers/misc-utils";
import {deployGenericPTokenImpl} from "../../../helpers/contracts-deployments";
import {
  getPoolAddressesProvider,
  getPoolConfiguratorProxy,
  getProtocolDataProvider,
  getPToken,
} from "../../../helpers/contracts-getters";
import {XTokenType} from "../../../helpers/types";

import dotenv from "dotenv";
import {ETHERSCAN_VERIFICATION} from "../../../helpers/hardhat-constants";

dotenv.config();

export const upgradePToken = async () => {
  const addressesProvider = await getPoolAddressesProvider();
  const poolAddress = await addressesProvider.getPool();
  const poolConfiguratorProxy = await getPoolConfiguratorProxy(
    await addressesProvider.getPoolConfigurator()
  );
  const protocolDataProvider = await getProtocolDataProvider();
  const allTokens = await protocolDataProvider.getAllXTokens();

  const pTokenImplementation = await deployGenericPTokenImpl(
    poolAddress,
    ETHERSCAN_VERIFICATION
  );

  for (let i = 0; i < allTokens.length; i++) {
    const token = allTokens[i];
    const pToken = await getPToken(token.tokenAddress);
    if ((await pToken.getXTokenType()) == XTokenType.PToken) {
      console.log("upgrading implementation for " + token.symbol);

      const asset = await pToken.UNDERLYING_ASSET_ADDRESS();
      const treasury = await pToken.RESERVE_TREASURY_ADDRESS();
      const incentivesController = await pToken.getIncentivesController();
      const name = await pToken.name();
      const symbol = await pToken.symbol();
      await waitForTx(
        await poolConfiguratorProxy.updatePToken({
          asset: asset,
          treasury: treasury,
          incentivesController: incentivesController,
          name: name,
          symbol: symbol,
          implementation: pTokenImplementation.address,
          params: "0x10",
        })
      );

      console.log("upgrade implementation for " + token.symbol + "finished.");
    }
  }

  console.log("upgrade all ptoken implementation finished.");
};
