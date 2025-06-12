import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AddressZero } from '@ethersproject/constants'

import { RegistrationStatus, UserType } from 'types'

export interface UserState {
  balance: string
  accountBalance: string
  mSTRAXBalance: string
  type: UserType
  registrationStatus: RegistrationStatus
  registerToken: string
  lastClaimedBlock: number
  sinceLastClaim: number
  totalSeconds: number
  lastDividends: string
}

export const initialState: UserState = {
  balance: '0',
  accountBalance: '0',
  mSTRAXBalance: '0',
  type: UserType.UNKNOWN,
  registrationStatus: RegistrationStatus.UNREGISTERED,
  registerToken: AddressZero,
  lastClaimedBlock: 0,
  sinceLastClaim: 0,
  totalSeconds: 0,
  lastDividends: '0',
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
    setMSTRAXBalance(state, action: PayloadAction<string>) {
      state.mSTRAXBalance = action.payload
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
      state.mSTRAXBalance = initialState.mSTRAXBalance
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
  setMSTRAXBalance,
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

