import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import { ConnectionType } from 'web3/connection'

export interface WalletState {
  selectedWallet?: ConnectionType
}

export const initialState: WalletState = {
  selectedWallet: undefined,
}

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    updateSelectedWallet(state, action: PayloadAction<ConnectionType | undefined>) {
      state.selectedWallet = action.payload
    },
  },
})

export const {
  updateSelectedWallet,
} = walletSlice.actions

export default persistReducer({
  key: 'wallet',
  storage,
}, walletSlice.reducer)

