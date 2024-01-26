export const getIsInjected = () => Boolean(globalThis.window?.ethereum)

type NonMetaMaskFlag = 'isRabby' | 'isBraveWallet' | 'isTrustWallet' | 'isLedgerConnect'
const allNonMetaMaskFlags: NonMetaMaskFlag[] = ['isRabby', 'isBraveWallet', 'isTrustWallet', 'isLedgerConnect']
export const getIsMetaMaskWallet = () => Boolean(globalThis.window?.ethereum?.isMetaMask && !allNonMetaMaskFlags.some(flag => globalThis.window?.ethereum?.[flag]))

export const getIsCoinbaseWallet = () => Boolean(globalThis.window?.ethereum?.isCoinbaseWallet)

export enum ErrorCode {
  USER_REJECTED_REQUEST = 4001,
  UNAUTHORIZED = 4100,
  UNSUPPORTED_METHOD = 4200,
  DISCONNECTED = 4900,
  CHAIN_DISCONNECTED = 4901,

  CHAIN_NOT_ADDED = 4902,
  MM_ALREADY_PENDING = -32002,

  WC_MODAL_CLOSED = 'Error: User closed modal',
  CB_REJECTED_REQUEST = 'Error: User denied account authorization',
}
