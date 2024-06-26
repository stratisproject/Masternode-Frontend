import { useEffect } from "react";
import { auroria } from "viem/chains";
import { useAccount, useBlockNumber, useReadContract } from "wagmi";
import { MASTERNODE_ADDRESS } from "constants/index";
import ABI from "constants/abis/masterNode.json";
import { UserType } from "types";

export const useUserType = () => {
  const { address } = useAccount();
  const { data: blockNumber } = useBlockNumber({ watch: true });
  const { data: islegacy10K, refetch: refetchIs10K } = useReadContract({
    address: MASTERNODE_ADDRESS,
    abi: ABI,
    functionName: "legacy10K",
    chainId: auroria.id,
    args: [address],
  });
  const { data: islegacy50K, refetch: refetchIs50K } = useReadContract({
    address: MASTERNODE_ADDRESS,
    abi: ABI,
    functionName: "legacy50K",
    chainId: auroria.id,
    args: [address],
  });

  useEffect(() => {
    refetchIs10K();
    refetchIs50K();
  }, [blockNumber, refetchIs10K, refetchIs50K]);

  try {
    if (!address) return UserType.UNKNOWN;
    if (islegacy10K) return UserType.LEGACY_10K;
    if (islegacy50K) return UserType.LEGACY_50K;
    return UserType.REGULAR;
  } catch (error) {
    return UserType.UNKNOWN;
  }
};
