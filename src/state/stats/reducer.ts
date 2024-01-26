import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface StatsState {
  contractBalance: string
  totalCollateralAmount: string
  totalRegistrations: number
  totalBlockShares: number
}

export const initialState: StatsState = {
  contractBalance: '0',
  totalCollateralAmount: '0',
  totalRegistrations: 0,
  totalBlockShares: 0,
}

const statsSlice = createSlice({
  name: 'stats',
  initialState,
  reducers: {
    setContractBalance(state, action: PayloadAction<string>) {
      state.contractBalance = action.payload
    },
    setTotalCollateralAmount(state, action: PayloadAction<string>) {
      state.totalCollateralAmount = action.payload
    },
    setTotalRegistrations(state, action: PayloadAction<number>) {
      state.totalRegistrations = action.payload
    },
    setTotalBlockShares(state, action: PayloadAction<number>) {
      state.totalBlockShares = action.payload
    },
  },
})

export const {
  setContractBalance,
  setTotalCollateralAmount,
  setTotalRegistrations,
  setTotalBlockShares,
} = statsSlice.actions

export default statsSlice.reducer

