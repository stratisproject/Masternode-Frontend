import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RegistrationStatus, UserType } from 'types'

export interface UserState {
  balance: string
  rewards: string
  type: UserType
  registrationStatus: RegistrationStatus
  lastClaimedBlock: number
  blockShares: number
  sinceLastClaim: number
  totalSeconds: number
}

export const initialState: UserState = {
  balance: '0',
  rewards: '0',
  type: UserType.UNKNOWN,
  registrationStatus: RegistrationStatus.UNREGISTERED,
  lastClaimedBlock: 0,
  blockShares: 0,
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
    setRewards(state, action: PayloadAction<string>) {
      state.rewards = action.payload
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
    setBlockShares(state, action: PayloadAction<number>) {
      state.blockShares = action.payload
    },
    setTotalSeconds(state, action: PayloadAction<number>) {
      state.totalSeconds = action.payload
    },
  },
})

export const {
  setBalance,
  setRewards,
  setType,
  setRegistrationStatus,
  setBlockShares,
  setLastClaimedBlock,
  setSinceLastClaim,
  setTotalSeconds,
} = userSlice.actions

export default userSlice.reducer

