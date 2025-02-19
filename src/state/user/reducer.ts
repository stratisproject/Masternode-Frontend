import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AddressZero } from '@ethersproject/constants'

import { RegistrationStatus, UserType } from 'types'

export interface UserState {
  balance: string
  accountBalance: string
  lssTokenBalance: string
  type: UserType
  registrationStatus: RegistrationStatus
  registerToken: string
  lastClaimedBlock: number
  lastDividends: string
  sinceLastClaim: number
  totalSeconds: number
}

export const initialState: UserState = {
  balance: '0',
  accountBalance: '0',
  lssTokenBalance: '0',
  type: UserType.UNKNOWN,
  registrationStatus: RegistrationStatus.UNREGISTERED,
  registerToken: AddressZero,
  lastClaimedBlock: 0,
  lastDividends: '0',
  sinceLastClaim: 0,
  totalSeconds: 0,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setBalance(state, action: PayloadAction<string>) {
      state.balance = action.payload
    },
    setAccountBalance(state, action: PayloadAction<string>) {
      state.accountBalance = action.payload
    },
    setLSSTokenBalance(state, action: PayloadAction<string>) {
      state.lssTokenBalance = action.payload
    },
    setType(state, action: PayloadAction<UserType>) {
      state.type = action.payload
    },
    setRegistrationStatus(state, action: PayloadAction<RegistrationStatus>) {
      state.registrationStatus = action.payload
    },
    setRegisterToken(state, action: PayloadAction<string>) {
      state.registerToken = action.payload
    },
    setLastClaimedBlock(state, action: PayloadAction<number>) {
      state.lastClaimedBlock = action.payload
    },
    setLastDividends(state, action: PayloadAction<string>) {
      state.lastDividends = action.payload
    },
    setSinceLastClaim(state, action: PayloadAction<number>) {
      state.sinceLastClaim = action.payload
    },
    setTotalSeconds(state, action: PayloadAction<number>) {
      state.totalSeconds = action.payload
    },
    resetState(state) {
      state.balance = initialState.balance
      state.accountBalance = initialState.accountBalance
      state.lssTokenBalance = initialState.lssTokenBalance
      state.type = initialState.type
      state.registrationStatus = initialState.registrationStatus
      state.registerToken = initialState.registerToken
      state.lastClaimedBlock = initialState.lastClaimedBlock
      state.lastDividends = initialState.lastDividends
      state.sinceLastClaim = initialState.sinceLastClaim
      state.totalSeconds = initialState.totalSeconds
    },
  },
})

export const {
  setBalance,
  setAccountBalance,
  setLSSTokenBalance,
  setType,
  setRegistrationStatus,
  setRegisterToken,
  setLastClaimedBlock,
  setLastDividends,
  setSinceLastClaim,
  setTotalSeconds,
  resetState,
} = userSlice.actions

export default userSlice.reducer

