import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import { ConnectionType } from 'web3/connection'

export interface WalletState {
  selectedWallet?: ConnectionType,
  warningModal?: boolean,
}

export const initialState: WalletState = {
  selectedWallet: undefined,
  warningModal: false,
}

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    updateSelectedWallet(state, action: PayloadAction<ConnectionType | undefined>) {
      state.selectedWallet = action.payload
    },
    updateIsWarningModalOpen(state, action:PayloadAction<boolean | undefined>) {
      state.warningModal = action.payload
    },
  },
})

export const {
  updateSelectedWallet,
  updateIsWarningModalOpen,
} = walletSlice.actions

export default persistReducer({
  key: 'wallet',
  storage,
}, walletSlice.reducer)

