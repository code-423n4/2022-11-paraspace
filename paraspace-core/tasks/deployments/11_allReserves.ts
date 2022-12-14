import {task} from "hardhat/config";
import {ETHERSCAN_VERIFICATION} from "../../deploy/helpers/hardhat-constants";

task("deploy:all-reserves", "Deploy all reserves").setAction(async (_, DRE) => {
  await DRE.run("set-DRE");
  const {step_11} = await import(
    "../../deploy/tasks/deployments/full-deployment/steps/11_allReserves"
  );
  await step_11(ETHERSCAN_VERIFICATION);
});
