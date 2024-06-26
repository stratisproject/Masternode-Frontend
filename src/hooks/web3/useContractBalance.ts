import { useEffect } from "react";
import { auroria } from "viem/chains";
import { useBalance, useBlockNumber } from "wagmi";
import { MASTERNODE_ADDRESS } from "constants/index";

export const useContractBalance = () => {
  const { data: blockNumber } = useBlockNumber({ watch: true });
  const { data: result, refetch } = useBalance({ address: MASTERNODE_ADDRESS, chainId: auroria.id });
  useEffect(() => {
    refetch();
  }, [blockNumber, refetch]);
  try {
    return BigInt(result?.value || 0);
  } catch (error) {
    return BigInt(0);
  }
};
