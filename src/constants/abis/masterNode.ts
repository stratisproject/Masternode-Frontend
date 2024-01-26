import { Interface } from '@ethersproject/abi'

import MASTERNODE_ABI from './masterNode.json'

export default MASTERNODE_ABI

export const MASTERNODE_INTERFACE = new Interface(MASTERNODE_ABI)
