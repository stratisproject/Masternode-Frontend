import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AddressZero } from '@ethersproject/constants'

export interface StatsState {
  owner: string
  contractBalance: string
  collateralAmount: string
  collateralAmountLegacy: string
  withdrawalDelay: number
  totalCollateralAmount: string
  totalTokensBalance: string
  totalDividends: string
  totalRegistrations: number
  lastBalance: string
  withdrawingCollateralAmount: string
  isLSSTokenSupported: boolean
}

export const initialState: StatsState = {
  owner: AddressZero,
  contractBalance: '0',
  collateralAmount: '0',
  collateralAmountLegacy: '0',
  withdrawalDelay: 0,
  totalCollateralAmount: '0',
  totalTokensBalance: '0',
  totalDividends: '0',
  totalRegistrations: 0,
  lastBalance: '0',
  withdrawingCollateralAmount: '0',
  isLSSTokenSupported: false,
}

const statsSlice = createSlice({
  name: 'stats',
  initialState,
  reducers: {
    setOwner(state, action: PayloadAction<string>) {
      state.owner = action.payload.toLowerCase()
    },
    setContractBalance(state, action: PayloadAction<string>) {
      state.contractBalance = action.payload
    },
    setCollateralAmount(state, action: PayloadAction<string>) {
      state.collateralAmount = action.payload
    },
    setCollateralAmountLegacy(state, action: PayloadAction<string>) {
      state.collateralAmountLegacy = action.payload
    },
    setWithdrawalDelay(state, action: PayloadAction<number>) {
      state.withdrawalDelay = action.payload
    },
    setTotalCollateralAmount(state, action: PayloadAction<string>) {
      state.totalCollateralAmount = action.payload
    },
    setTotalTokensBalance(state, action: PayloadAction<string>) {
      state.totalTokensBalance = action.payload
    },
    setTotalDividends(state, action: PayloadAction<string>) {
      state.totalDividends = action.payload
    },
    setTotalRegistrations(state, action: PayloadAction<number>) {
      state.totalRegistrations = action.payload
    },
    setLastBalance(state, action: PayloadAction<string>) {
      state.lastBalance = action.payload
    },
    setWithdrawingCollateralAmount(state, action: PayloadAction<string>) {
      state.withdrawingCollateralAmount = action.payload
    },
    setIsLSSTokenSupported(state, action: PayloadAction<boolean>) {
      state.isLSSTokenSupported = action.payload
    },
  },
})

export const {
  setOwner,
  setContractBalance,
  setCollateralAmount,
  setCollateralAmountLegacy,
  setWithdrawalDelay,
  setTotalCollateralAmount,
  setTotalTokensBalance,
  setTotalDividends,
  setTotalRegistrations,
  setLastBalance,
  setWithdrawingCollateralAmount,
  setIsLSSTokenSupported,
} = statsSlice.actions

export default statsSlice.reducer

