import { useUserType } from "./useUserType";
import { UserType } from "types";
import { COLLATERAL_AMOUNT_10K, COLLATERAL_AMOUNT, COLLATERAL_AMOUNT_50K } from "constants/index";

export function useUserCollateral() {
  const type = useUserType();
  if (type === UserType.LEGACY_10K) {
    return COLLATERAL_AMOUNT_10K;
  } else if (type === UserType.LEGACY_50K) {
    return COLLATERAL_AMOUNT_50K;
  } else if (type === UserType.REGULAR) {
    return COLLATERAL_AMOUNT;
  }

  return BigInt(0);
}
