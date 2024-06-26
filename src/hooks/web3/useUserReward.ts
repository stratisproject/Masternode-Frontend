import { useUserRegisterationStatus } from "./useUserRegisterationStatus";
import { useContractBalance } from "./useContractBalance";
import { useTotalCollateralAmount } from "./useTotalCollateralAmount";
import { useTotalBlockShares } from "./useTotalBlockShares";
import { useUserSinceLastClaim } from "./useUserSinceLastClaim";
import { RegistrationStatus } from "types";

export const useUserReward = () => {
  const userStatus = useUserRegisterationStatus();
  const sinceLastClaim = useUserSinceLastClaim();
  const contractBalance = useContractBalance();
  const totalCollateralAmount = useTotalCollateralAmount();
  const totalBlockShares = useTotalBlockShares();

  try {
    if (userStatus !== RegistrationStatus.REGISTERED || totalBlockShares === BigInt(0) || sinceLastClaim === 0) {
      return BigInt(0);
    }
    const value = ((contractBalance - totalCollateralAmount) * sinceLastClaim) / totalBlockShares;
    return (value || 0) as number;
  } catch (error) {
    return 0;
  }
};
