import { ChainId } from 'web3/chains'

export const BLOCK_TIME_SECONDS = 15
export const DEFAULT_OWNER = '0xbba56672A4c466500fD8C65D55AE618c776b1739'
export const MULTICALL3_ADDRESS = '0xcA11bde05977b3631167028862bE2a173976CA11'

export const MASTERNODE_ADDRESSES = {
  [ChainId.STRATIS]: '0x0000000000000000000000000000000000001002',
  [ChainId.AURORIA]: '0xB279CbA50fb520d96C2f310661138d432b34F976',
}

export const MSTRAX_TOKEN_ADDRESSES = {
  [ChainId.STRATIS]: '',
  [ChainId.AURORIA]: '0xd030ed4Ba87624D4025FBf62C342De160b59a240',
}
