import { useEffect } from "react";
import { auroria } from "viem/chains";
import { useAccount, useBalance, useBlockNumber } from "wagmi";

export const useUserBalance = () => {
  const { address } = useAccount();
  const { data: blockNumber } = useBlockNumber({ watch: true });
  const { data: result, refetch } = useBalance({ address, chainId: auroria.id });
  useEffect(() => {
    refetch();
  }, [blockNumber, refetch]);
  try {
    return BigInt((result?.value as any) || 0);
  } catch (error) {
    return BigInt(0);
  }
};
