import { useEffect } from 'react'
import { useChainId } from 'wagmi'

import { useAppDispatch } from 'state'
import { updateSelectedWallet } from 'state/wallet/reducer'
import { useSelectedWallet } from 'state/wallet/hooks'

export default function useEagerlyConnect() {
  const dispatch = useAppDispatch()
  const selectedWallet = useSelectedWallet()
  const chainId = useChainId()

  useEffect(() => {
    // With wagmi, we don't need to manually connect to connectors
    // The WagmiProvider handles this automatically
    if (selectedWallet && chainId) {
      // Just update the selected wallet in our state
      dispatch(updateSelectedWallet(selectedWallet))
    }
  }, [selectedWallet, chainId, dispatch])
}
