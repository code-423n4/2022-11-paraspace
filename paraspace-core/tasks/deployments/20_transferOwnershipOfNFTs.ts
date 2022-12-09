import {task} from "hardhat/config";
import {ETHERSCAN_VERIFICATION} from "../../deploy/helpers/hardhat-constants";

task("transfer:nfts", "Transfer ownership of NFT's to deployer").setAction(
  async (_, DRE) => {
    await DRE.run("set-DRE");
    const {step_20} = await import(
      "../../deploy/tasks/deployments/full-deployment/steps/20_transferOwnershipOfNFTs"
    );
    await step_20(ETHERSCAN_VERIFICATION);
  }
);
