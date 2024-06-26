import { useCallback } from "react";
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { useUserRegisterationStatus } from "./useUserRegisterationStatus";
import { RegistrationStatus } from "types";
import ABI from "constants/abis/masterNode.json";
import { MASTERNODE_ADDRESS } from "constants/index";

export function useStartWithdrawal() {
  const { address, chain } = useAccount();
  const status = useUserRegisterationStatus();

  const { data: hash, isPending, writeContract } = useWriteContract();
  const { isLoading } = useWaitForTransactionReceipt({ hash });

  const startWithdrawal = useCallback(async () => {
    if (!address || status !== RegistrationStatus.REGISTERED || !chain) {
      return;
    }

    writeContract({ abi: ABI, address: MASTERNODE_ADDRESS, functionName: "startWithdrawal"});
  }, [address, status, chain, writeContract]);

  return { pending: isPending || isLoading, startWithdrawal };
}
