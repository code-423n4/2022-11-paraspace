import {waitForTx} from "../../../helpers/misc-utils";
import {deployUniswapV3NTokenImpl} from "../../../helpers/contracts-deployments";
import {
  getPoolAddressesProvider,
  getPoolConfiguratorProxy,
  getProtocolDataProvider,
  getNToken,
} from "../../../helpers/contracts-getters";
import {XTokenType} from "../../../helpers/types";

import dotenv from "dotenv";
import {ETHERSCAN_VERIFICATION} from "../../../helpers/hardhat-constants";

dotenv.config();

export const upgradeNTokenUniswapV3 = async () => {
  const addressesProvider = await getPoolAddressesProvider();
  const poolAddress = await addressesProvider.getPool();
  const poolConfiguratorProxy = await getPoolConfiguratorProxy(
    await addressesProvider.getPoolConfigurator()
  );
  const protocolDataProvider = await getProtocolDataProvider();
  const allTokens = await protocolDataProvider.getAllXTokens();

  const nTokenImplementation = await deployUniswapV3NTokenImpl(
    poolAddress,
    ETHERSCAN_VERIFICATION
  );

  for (let i = 0; i < allTokens.length; i++) {
    const token = allTokens[i];
    const nToken = await getNToken(token.tokenAddress);
    if ((await nToken.getXTokenType()) == XTokenType.NTokenUniswapV3) {
      console.log("upgrading implementation for " + token.symbol);

      const asset = await nToken.UNDERLYING_ASSET_ADDRESS();
      const incentivesController = await nToken.getIncentivesController();
      const name = await nToken.name();
      const symbol = await nToken.symbol();
      await waitForTx(
        await poolConfiguratorProxy.updateNToken({
          asset: asset,
          incentivesController: incentivesController,
          name: name,
          symbol: symbol,
          implementation: nTokenImplementation.address,
          params: "0x10",
        })
      );

      console.log("upgrade implementation for " + token.symbol + "finished.");
    }
  }

  console.log("upgrade all NTokenUniswapV3 implementation finished.");
};
