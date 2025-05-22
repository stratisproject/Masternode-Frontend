import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RegistrationStatus, UserType } from 'types'

export interface UserState {
  balance: string
  type: UserType
  registrationStatus: RegistrationStatus
  lastClaimedBlock: number
  sinceLastClaim: number
  totalSeconds: number
  lastDividends: string
}

export const initialState: UserState = {
  balance: '0',
  type: UserType.UNKNOWN,
  registrationStatus: RegistrationStatus.UNREGISTERED,
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
    setType(state, action: PayloadAction<UserType>) {
      state.type = action.payload
    },
    setRegistrationStatus(state, action: PayloadAction<RegistrationStatus>) {
      state.registrationStatus = action.payload
    },
    setLastClaimedBlock(state, action: PayloadAction<number>) {
      state.lastClaimedBlock = action.payload
    },
    setSinceLastClaim(state, action: PayloadAction<number>) {
      state.sinceLastClaim = action.payload
    },
    setTotalSeconds(state, action: PayloadAction<number>) {
      state.totalSeconds = action.payload
    },
    setLastDividends(state, action: PayloadAction<string>) {
      state.lastDividends = action.payload
    },
    resetState(state) {
      state.balance = initialState.balance
      state.type = initialState.type
      state.registrationStatus = initialState.registrationStatus
      state.lastClaimedBlock = initialState.lastClaimedBlock
      state.sinceLastClaim = initialState.sinceLastClaim
      state.totalSeconds = initialState.totalSeconds
      state.lastDividends = initialState.lastDividends
    },
  },
})

export const {
  setBalance,
  setType,
  setRegistrationStatus,
  setLastClaimedBlock,
  setSinceLastClaim,
  setTotalSeconds,
  setLastDividends,
  resetState,
} = userSlice.actions

export default userSlice.reducer

