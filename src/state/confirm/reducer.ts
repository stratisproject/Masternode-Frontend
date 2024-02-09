import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

export interface ConfirmState {
  showModal: boolean
  confirmed: boolean,
  text: string,
  isClaim: boolean,
}

export const initialState: ConfirmState = {
  showModal: false,
  confirmed: false,
  text: '',
  isClaim: false,
}

const confirmSlice = createSlice({
  name: 'confirm',
  initialState,
  reducers: {
    setShow(state, action: PayloadAction<{ isClaim: boolean, text: string}>) {
      state.showModal = true
      state.text = action.payload.text
      state.isClaim = action.payload.isClaim
    },
    setHide(state) {
      state.showModal = false
    },
    setContent(state, action: PayloadAction<string>) {
      state.text = action.payload
    },
    setResponse(state, action: PayloadAction<boolean>) {
      state.showModal = false
      state.confirmed = action.payload
    },
  },
})

export const {
  setShow,
  setResponse,
  setContent,
  setHide,
} = confirmSlice.actions

export default persistReducer({
  key: 'confirm',
  storage,
}, confirmSlice.reducer)

