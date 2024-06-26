import { useCallback } from "react";
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { useUserBalance } from "./useUserBalance";
import { useUserType } from "./useUserType";
import { useUserRegisterationStatus } from "./useUserRegisterationStatus";
import { useUserCollateral } from "./useUserCollateral";
import { RegistrationStatus, UserType } from "types";
import ABI from "constants/abis/masterNode.json";
import { MASTERNODE_ADDRESS } from "constants/index";

export function useRegisterUser() {
  const { address, chain } = useAccount();
  const balance = useUserBalance();
  const userType = useUserType();
  const status = useUserRegisterationStatus();
  const collateralAmount = useUserCollateral();

  const { data: hash, isPending, writeContract } = useWriteContract();
  const { isLoading } = useWaitForTransactionReceipt({ hash });

  const registerUser = useCallback(async () => {
    if (!address || userType === UserType.UNKNOWN || status !== RegistrationStatus.UNREGISTERED || !chain) {
      return;
    }

    if (balance < collateralAmount) {
      console.log("Not enough balance");
      return;
    }
    writeContract({ abi: ABI, address: MASTERNODE_ADDRESS, functionName: "register", value: collateralAmount });
  }, [address, userType, status, chain, balance, collateralAmount, writeContract]);

  return { pending: isPending || isLoading, registerUser };
}
