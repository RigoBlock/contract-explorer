import * as CONST from './const'
import * as abis from '../abi/index'
import BigNumber from 'bignumber.js'
import Web3 from 'web3'

/**
 * A unit amount is defined as the amount of a token above the specified decimal places (integer part).
 * E.g: If a currency has 18 decimal places, 1e18 or one quintillion of the currency is equivalent
 * to 1 unit.
 * @param   amount      The amount in baseUnits that you would like converted to units.
 * @param   decimals    The number of decimal places the unit amount has.
 * @return  The amount in units.
 */
export function toUnitAmount(amount, decimals) {
  const aUnit = new BigNumber(10).pow(decimals)
  const unit = new BigNumber(amount).dividedBy(aUnit)
  return unit
}

/**
 * A baseUnit is defined as the smallest denomination of a token. An amount expressed in baseUnits
 * is the amount expressed in the smallest denomination.
 * E.g: 1 unit of a token with 18 decimal places is expressed in baseUnits as 1000000000000000000
 * @param   amount      The amount of units that you would like converted to baseUnits.
 * @param   decimals    The number of decimal places the unit amount has.
 * @return  The amount in baseUnits.
 */
export function toBaseUnitAmount(amount, decimals) {
  const unit = new BigNumber(10).pow(decimals)
  const baseUnitAmount = amount.times(unit)
  const hasDecimals = baseUnitAmount.decimalPlaces() !== 0
  if (hasDecimals) {
    throw new Error(
      `Invalid unit amount: ${amount.toString()} - Too many decimal places`
    )
  }
  return baseUnitAmount
}
/**
 * Requests are proxied through the fund smart contract. The exchange has to be approved.
 *
 * @param {*} managerAccountAddress   The address of the owner of the fund
 * @param {*} dragoAddress            The address of the fund.
 * @param {*} exchangeContractAddress The address of the exchange (Ethfinex for example)
 * @param {*} tokenAddress            The address of the token to be un-locked.
 * @param {*} tokenWrapper            The address of the token wrapper.
 * @param {*} toBeUnwrapped           The amount in base units to be unwrapped. A baseUnit is defined as the smallest denomination of a token.
 * @returns                           A promise resolving the smart contract method called.
 */
export const operateOnExchangeEFXUnlock = async (
  managerAccountAddress,
  dragoAddress,
  exchangeContractAddress,
  tokenAddress,
  tokenWrapper,
  toBeUnwrapped
) => {
  if (!managerAccountAddress) {
    throw new Error('accountAddress needs to be provided')
  }
  if (!dragoAddress) {
    throw new Error('dragoAddress needs to be provided')
  }
  if (!exchangeContractAddress) {
    throw new Error('exchangeContractAddress needs to be provided')
  }
  if (!tokenWrapper) {
    throw new Error('tokenWrapper needs to be provided')
  }
  if (!toBeUnwrapped) {
    throw new Error('toBeUnWrapped needs to be provided')
  }

  console.log(`managerAccountAddress ${managerAccountAddress}`)
  console.log(`dragoAddress ${dragoAddress}`)
  console.log(`exchangeContractAddres ${exchangeContractAddress}`)
  console.log(`tokenAddress ${tokenAddress}`)
  console.log(`tokenWrapper ${tokenWrapper}`)
  console.log(`toBeUnWrapped ${toBeUnwrapped}`)
  const web3 = new Web3(window.web3.currentProvider)
  const contract = new web3.eth.Contract(abis.drago, dragoAddress)
  let options = {
    from: managerAccountAddress
  }

  if (tokenAddress === '0x0') {
    tokenAddress = null
  }
  const contractMethod = {
    name: 'unwrap',
    type: 'function',
    inputs: [
      {
        type: 'address',
        name: 'token'
      },
      {
        type: 'address',
        name: 'wrapper'
      },
      {
        type: 'uint256',
        name: 'value'
      },
      {
        type: 'uint8',
        name: 'v'
      },
      {
        type: 'bytes32',
        name: 'r'
      },
      {
        type: 'bytes32',
        name: 's'
      },
      {
        type: 'uint256',
        name: 'signatureValidUntilBlock'
      }
    ]
  }
  const v = 1
  const r = '0xfa39c1a29cab1aa241b62c2fd067a6602a9893c2afe09aaea371609e11cbd92d' // mock bytes32
  const s = '0xfa39c1a29cab1aa241b62c2fd067a6602a9893c2afe09aaea371609e11cbd92d' // mock bytes32
  const validUntil = 1
  const encodedABI = await web3.eth.abi.encodeFunctionCall(contractMethod, [
    tokenAddress,
    tokenWrapper,
    toBeUnwrapped,
    v,
    r,
    s,
    validUntil
  ])
  console.log(encodedABI)
  return contract.methods
    .operateOnExchange(exchangeContractAddress, encodedABI)
    .estimateGas(options)
    .then(gasEstimate => {
      console.log(gasEstimate)
      options.gas = gasEstimate
    })
    .then(() => {
      return contract.methods
        .operateOnExchange(exchangeContractAddress, encodedABI)
        .send(options)
    })
}
/**
 *  Requests are proxied through the fund smart contract. The exchange has to be approved.
 *
 * @param {*} managerAccountAddress     The address of the owner of the fund
 * @param {*} dragoAddress              The address of the fund.
 * @param {*} exchangeContractAddress   The address of the exchange (Ethfinex for example)
 * @param {*} tokenAddress              The address of the token to be un-locked.
 * @param {*} tokenWrapper              The address of the token wrapper.
 * @param {*} toBeWrapped               The amount in base units to be unwrapped. A baseUnit is defined as the smallest denomination of a token.
 * @param {*} time                      Lock time (1 for 1h)
 * @param {*} isOldERC20                True for non standard ERC20 tokens su as USDT.
 * @returns                             A promise resolving the smart contract method called.
 */
export const operateOnExchangeEFXLock = async (
  managerAccountAddress,
  dragoAddress,
  exchangeContractAddress,
  tokenAddress,
  tokenWrapper,
  toBeWrapped,
  time,
  isOldERC20
) => {
  if (!managerAccountAddress) {
    throw new Error('accountAddress needs to be provided')
  }
  if (!dragoAddress) {
    throw new Error('dragoAddress needs to be provided')
  }
  if (!exchangeContractAddress) {
    throw new Error('exchangeContractAddress needs to be provided')
  }
  // if (!tokenAddress) {
  //   throw new Error('tokenAddress needs to be provided')
  // }
  if (!tokenWrapper) {
    throw new Error('tokenWrapper needs to be provided')
  }
  if (!toBeWrapped) {
    throw new Error('toBeWrapped needs to be provided')
  }
  if (!time) {
    throw new Error('time need to be provided')
  }
  if (typeof isOldERC20 === 'undefined') {
    throw new Error('isOldERC20 need to be provided')
  }
  if (tokenAddress === '0x0') {
    tokenAddress = null
  }
  console.log(`managerAccountAddress ${managerAccountAddress}`)
  console.log(`dragoAddress ${dragoAddress}`)
  console.log(`exchangeContractAddres ${exchangeContractAddress}`)
  console.log(`tokenAddress ${tokenAddress}`)
  console.log(`tokenWrapper ${tokenWrapper}`)
  console.log(`toBeWrapped ${toBeWrapped}`)
  console.log(`time ${time}`)
  console.log(`isOldERC20 ${isOldERC20}`)

  const web3 = new Web3(window.web3.currentProvider)
  const contract = new web3.eth.Contract(abis.drago, dragoAddress)
  let options = {
    from: managerAccountAddress
  }
  const contractMethod = {
    name: 'wrapToEfx',
    type: 'function',
    inputs: [
      {
        type: 'address',
        name: 'token'
      },
      {
        type: 'address',
        name: 'wrapper'
      },
      {
        type: 'uint256',
        name: 'value'
      },
      {
        type: 'uint256',
        name: 'forTime'
      },
      {
        type: 'bool',
        name: 'erc20Old'
      }
    ]
  }
  const encodedABI = await web3.eth.abi.encodeFunctionCall(contractMethod, [
    tokenAddress,
    tokenWrapper,
    toBeWrapped,
    time,
    isOldERC20
  ])
  console.log(encodedABI)
  return contract.methods
    .operateOnExchange(exchangeContractAddress, encodedABI)
    .estimateGas(options)
    .then(gasEstimate => {
      console.log(gasEstimate)
      options.gas = gasEstimate
    })
    .then(() => {
      return contract.methods
        .operateOnExchange(exchangeContractAddress, encodedABI)
        .send(options)
    })
}

export const getWrapperBalance = async (wrapperAddress, dragoAddress, web3) => {
  const wrapperContract = new web3.eth.Contract(abis.wrapper, wrapperAddress)
  return await wrapperContract.methods.balanceOf(dragoAddress).call()
}

export const getTokenBalance = async (tokenAddress, dragoAddress, web3) => {
  if (tokenAddress === '0x0') {
    return await new web3.eth.getBalance(dragoAddress)
  }
  const tokenContract = new web3.eth.Contract(abis.erc20, tokenAddress)
  return await tokenContract.methods.balanceOf(dragoAddress).call()
}
/**
 * Returns a array of funds belonging to a specific address
 *
 *
 * @param {*} managerAddress  The address of the owner of the fund
 * @param {*} networkId       Ethereum netword id
 * @returns                   Promise resolving an array of fund addresses
 */
export const getFundsAddresses = (managerAddress, networkId) => {
  const web3 = new Web3(window.web3.currentProvider)
  const contract = new web3.eth.Contract(
    abis.dragofactory,
    CONST.contracts[networkId].dragoFactory
  )
  let options = {}
  return contract.methods
    .getDragosByAddress(managerAddress)
    .estimateGas()
    .then(gasEstimate => {
      options.gas = gasEstimate
    })
    .then(() => {
      return contract.methods.getDragosByAddress(managerAddress).call(options)
    })
    .catch(err => {
      console.warn(err)
    })
}
/**
 *  Calls the followng method on the fund smart contract:
 *     function fromAddress(address _drago)
 *       external view
 *      returns (
 *           uint256 id,
 *           string name,
 *           string symbol,
 *           uint256 dragoId,
 *           address owner,
 *           address group
 *         )
 *
 * @param {*} fundAddress The address of the owner of the fund
 * @param {*} networkId   Ethereum netword id
 * @returns               Array of fund data.
 */
export const getFundDetails = (fundAddress, networkId) => {
  const web3 = new Web3(window.web3.currentProvider)
  const contract = new web3.eth.Contract(
    abis.dragoregistry,
    CONST.contracts[networkId].dragoRegistry
  )
  let options = {}
  return contract.methods
    .fromAddress(fundAddress)
    .estimateGas()
    .then(gasEstimate => {
      options.gas = gasEstimate
    })
    .then(() => {
      return contract.methods.fromAddress(fundAddress).call(options)
    })
    .then(details => {
      return {
        address: fundAddress,
        details
      }
    })
    .catch(err => {
      console.warn(err)
    })
}
