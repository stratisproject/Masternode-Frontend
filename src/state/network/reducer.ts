import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import { ChainId } from 'web3/chains'

export interface NetworkState {
  siteNetworkId: ChainId
}

export const initialState: NetworkState = {
  siteNetworkId: ChainId.STRATIS,
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

// Create a custom persist config that will always use the initial state
const persistConfig = {
  key: 'network',
  storage,
}

export default persistReducer(persistConfig, networkSlice.reducer)

