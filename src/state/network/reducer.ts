import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import { ChainId } from 'web3/chains'

export interface NetworkState {
  siteNetworkId: ChainId
}

export const initialState: NetworkState = {
  siteNetworkId: ChainId.AURORIA,
}

const networkSlice = createSlice({
  name: 'network',
  initialState,
  reducers: {
    setSiteNetworkId(state, action: PayloadAction<ChainId>) {
      state.siteNetworkId = action.payload
    },
  },
})

export const {
  setSiteNetworkId,
} = networkSlice.actions

export default persistReducer({
  key: 'network',
  storage,
}, networkSlice.reducer)

