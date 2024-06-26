import { useEffect } from "react";
import { auroria } from "viem/chains";
import { useAccount, useBlockNumber, useReadContract } from "wagmi";
import { MASTERNODE_ADDRESS } from "constants/index";
import ABI from "constants/abis/masterNode.json";

export const useUserBlockShares = () => {
  const { address } = useAccount();
  const { data: blockNumber } = useBlockNumber({ watch: true });
  const { data: result, refetch } = useReadContract({
    address: MASTERNODE_ADDRESS,
    abi: ABI,
    functionName: "checkBlockShares",
    chainId: auroria.id,
    args: [address],
  });
  useEffect(() => {
    refetch();
  }, [blockNumber, refetch]);
  try {
    return (result || 0) as number;
  } catch (error) {
    return 0;
  }
};
