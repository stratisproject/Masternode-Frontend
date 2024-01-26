import { useAppSelector } from 'state'

export function useSelectedWallet() {
  return useAppSelector(state => state.wallet.selectedWallet)
}