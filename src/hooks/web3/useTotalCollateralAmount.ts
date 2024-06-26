import { useEffect } from "react";
import { auroria } from "viem/chains";
import { useBlockNumber, useReadContract } from "wagmi";
import { MASTERNODE_ADDRESS } from "constants/index";
import ABI from "constants/abis/masterNode.json";

export const useTotalCollateralAmount = () => {
  const { data: blockNumber } = useBlockNumber({ watch: true });
  const { data: result, refetch } = useReadContract({
    address: MASTERNODE_ADDRESS,
    abi: ABI,
    functionName: "totalCollateralAmount",
    chainId: auroria.id,
  });
  useEffect(() => {
    refetch();
  }, [blockNumber, refetch]);
  try {
    return BigInt((result as any) || 0);
  } catch (error) {
    return BigInt(0);
  }
};
