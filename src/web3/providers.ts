import { deepCopy } from '@ethersproject/properties'
import { StaticJsonRpcProvider } from '@ethersproject/providers'
import { isPlain } from '@reduxjs/toolkit'

import { ChainId, CHAINS } from './chains'
import { AVERAGE_L1_BLOCK_TIME } from './chainInfo'

class AppJsonRpcProvider extends StaticJsonRpcProvider {
  private _blockCache = new Map<string, Promise<any>>()
  get blockCache() {
    if (!this._blockCache.size) {
      this.once('block', () => this._blockCache.clear())
    }
    return this._blockCache
  }

  constructor(chainId: ChainId) {
    super(CHAINS[chainId].urls[0], { chainId, name: CHAINS[chainId].name })

    this.pollingInterval = AVERAGE_L1_BLOCK_TIME
  }

  send(method: string, params: Array<any>): Promise<any> {
    if (method !== 'eth_call') {
      return super.send(method, params)
    }

    if (!isPlain(params)) {
      return super.send(method, params)
    }

    const key = `call:${JSON.stringify(params)}`
    const cached = this.blockCache.get(key)
    if (cached) {
      this.emit('debug', {
        action: 'request',
        request: deepCopy({ method, params, id: 'cache' }),
        provider: this,
      })
      return cached
    }

    const result = super.send(method, params)
    this.blockCache.set(key, result)
    return result
  }
}

export const RPC_PROVIDERS: { [key in ChainId]: StaticJsonRpcProvider } = {
  [ChainId.STRATIS]: new AppJsonRpcProvider(ChainId.STRATIS),
  [ChainId.AURORIA]: new AppJsonRpcProvider(ChainId.AURORIA),
}