// Copyright 2017 Rigo Investment Sarl.
// This file is part of RigoBlock.

import Api from '@parity/api'
import Web3 from 'web3'
import {
  INFURA,
  KOVAN,
  PROD,
  WS
} from './const'

class Endpoint {

  constructor(endpointInfo, networkInfo = KOVAN, prod = PROD, ws = WS) {
    if (!endpointInfo) {
      throw new Error('endpointInfo connection data needs to be provided to Endpoint')
    }
    if (!networkInfo) {
      throw new Error('network name needs to be provided to Endpoint')
    }
    this._timeout = 5000
    this._endpoint = endpointInfo
    this._network = networkInfo
    this._prod = prod
    console.log(networkInfo)
    // Infura does not support WebSocket on Kovan network yet. Disabling.
    this._onWs = this._network.name === INFURA ? false : ws
    // Setting production or development endpoints
    if (prod) {
      this._https = endpointInfo.https[this._network.name].prod
      this._wss = endpointInfo.wss[this._network.name].prod
    } else {
      this._https = endpointInfo.https[this._network.name].dev
      this._wss = endpointInfo.wss[this._network.name].dev
    }
  }

  get timeout() {
    return this._timeout;
  }

  set timeout(timeout) {
    this._timeout = timeout
  }

  _checkLocal = () => {
    // Checking if app is running inside Parity UI. If positive, connect to localhost.
    if (typeof window.parity !== 'undefined') {
      console.log('Found Parity!')
      return true
    }
    return false
  }

  _checkWeb3 = () => {
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof window.web3 !== 'undefined') {
      console.log('Found MetaMask!')
      window.web3 = new Web3(window.web3.currentProvider)
      window.web3._rb = {}
      window.web3._rb.network = this._network
    } else {
      console.log('No web3? You should consider trying MetaMask!')
    }
  }

  connect = () => {
    this._checkWeb3()
    if (this._checkLocal()) {
      console.log(`Endpoint: local`)
      window.parity.api._rb = {}
      window.parity.api._rb.network = this._network
      return window.parity.api
    }
    if (this._onWs) {
      var api
      try {
        console.log("Network: ", this._network.name)
        console.log("Connecting to: ", this._wss)
        const transport = new Api.Provider.WsSecure(this._wss)
        api = new Api(transport)
        api._rb = {}
        api._rb.network = this._network
        return api
      } catch (error) {
        console.warn('Connection error: ', error)
        return error
      }
    } else {
      try {
        console.log("Network: ", this._network.name)
        console.log("Connecting to: ", this._https)
        const transport = new Api.Provider.Http(this._https, this._timeout)
        api = new Api(transport)
        api._rb = {}
        api._rb.network = this._network
        return api
      } catch (error) {
        console.warn('Connection error: ', error)
        return error
      }
    }
  }
}

export default Endpoint;