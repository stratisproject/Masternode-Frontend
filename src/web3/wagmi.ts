import { Contract } from 'ethers'
import { JsonRpcProvider } from '@ethersproject/providers'
import { PublicClient, WalletClient } from 'viem'
import { getAddress } from 'viem'

export function getWagmiContract(
  address: string,
  abi: any,
  publicClient: PublicClient,
  walletClient?: WalletClient,
): Contract {
  if (!address || !getAddress(address)) {
    throw new Error(`Invalid 'address' parameter: '${address}'.`)
  }

  // Create an ethers provider using the public client's transport
  const provider = new JsonRpcProvider((publicClient.transport as any).url)

  if (!walletClient?.account) {
    return new Contract(address, abi, provider)
  }

  // If we have a wallet client, create a signer
  const signer = provider.getSigner(walletClient.account.address)
  return new Contract(address, abi, signer)
}