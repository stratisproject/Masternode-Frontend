import { parseEther } from 'ethers/lib/utils'

// TODO: Revert to original values for mainnet or relaunched testnet (also need to replace ./abis/masterNode.json)
export const MASTERNODE_ADDRESS = '0xC8A7aD113db705f35662E46EbA9D35E7Dc363f85' // 0x0000000000000000000000000000000000001002
export const COLLATERAL_AMOUNT = parseEther('1000') // 1000000
export const COLLATERAL_AMOUNT_LEGACY = parseEther('100') // 100000
export const WITHDRAWAL_DELAY = 20 // 100800
