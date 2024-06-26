import { useEffect } from "react";
import { auroria } from "viem/chains";
import { useBlockNumber, useReadContract } from "wagmi";
import { MASTERNODE_ADDRESS } from "constants/index";
import ABI from "constants/abis/masterNode.json";

export const useTotalBlockShares = () => {
  const { data: blockNumber } = useBlockNumber({ watch: true });
  const { data: val, refetch: refetchTotalBlockShares } = useReadContract({
    address: MASTERNODE_ADDRESS,
    abi: ABI,
    functionName: "totalBlockShares",
    chainId: auroria.id,
  });

  const { data: totalRegistrations, refetch: refetchTotalRegisterations } = useReadContract({
    address: MASTERNODE_ADDRESS,
    abi: ABI,
    functionName: "totalRegistrations",
    chainId: auroria.id,
  });

  const { data: lastBlockShareUpdate, refetch: refetchLastBlockShareUpdates } = useReadContract({
    address: MASTERNODE_ADDRESS,
    abi: ABI,
    functionName: "lastBlock",
    chainId: auroria.id,
  });

  useEffect(() => {
    refetchTotalBlockShares();
    refetchTotalRegisterations();
    refetchLastBlockShareUpdates();
  }, [blockNumber, refetchLastBlockShareUpdates, refetchTotalBlockShares, refetchTotalRegisterations]);
  try {
    if (!blockNumber) return BigInt(0);
    return BigInt(val as any) + (blockNumber - BigInt(lastBlockShareUpdate as any)) * BigInt(totalRegistrations as any);
  } catch (error) {
    return BigInt(0);
  }
};
