import { useEffect } from "react";
import { auroria } from "viem/chains";
import { useAccount, useBlockNumber, useReadContract } from "wagmi";
import { MASTERNODE_ADDRESS } from "constants/index";
import ABI from "constants/abis/masterNode.json";
import { RegistrationStatus } from "types";

export const useUserRegisterationStatus = () => {
  const { address } = useAccount();
  const { data: blockNumber } = useBlockNumber({ watch: true });
  const { data, refetch } = useReadContract({
    address: MASTERNODE_ADDRESS,
    abi: ABI,
    functionName: "registrationStatus",
    chainId: auroria.id,
    args: [address],
  });

  useEffect(() => {
    refetch();
  }, [blockNumber, refetch]);

  try {
    if (!address) return RegistrationStatus.UNREGISTERED;
    return data;
  } catch (error) {
    return RegistrationStatus.UNREGISTERED;
  }
};
