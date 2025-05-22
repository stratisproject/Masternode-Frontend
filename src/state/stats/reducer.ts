import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface StatsState {
  contractBalance: string
  totalCollateralAmount: string
  totalRegistrations: number
  totalDividends: string
  lastBalance: string
  withdrawingCollateralAmount: string

  // This parameter shows total amount of ERC20 tokens in MN contract
  // and currently it exists only on Auroria. For mainnet this amount will be 0
  totalTokensBalance: string
}

export const initialState: StatsState = {
  contractBalance: '0',
  totalCollateralAmount: '0',
  totalRegistrations: 0,
  totalTokensBalance: '0',
  totalDividends: '0',
  lastBalance: '0',
  withdrawingCollateralAmount: '0',
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
    setTotalTokensBalance(state, action: PayloadAction<string>) {
      state.totalTokensBalance = action.payload
    },
    setTotalDividends(state, action: PayloadAction<string>) {
      state.totalDividends = action.payload
    },
    setLastBalance(state, action: PayloadAction<string>) {
      state.lastBalance = action.payload
    },
    setWithdrawingCollateralAmount(state, action: PayloadAction<string>) {
      state.withdrawingCollateralAmount = action.payload
    },
  },
})

export const {
  setContractBalance,
  setTotalCollateralAmount,
  setTotalRegistrations,
  setTotalTokensBalance,
  setTotalDividends,
  setLastBalance,
  setWithdrawingCollateralAmount,
} = statsSlice.actions

export default statsSlice.reducer

