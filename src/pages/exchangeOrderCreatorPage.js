import * as abis from '../abi'
import {
  RB_0X_EXCHANGE_ADDRESS_KV,
  RB_EFX_EXCHANGE_ADDRESS_RP,
  RB_EFX_TOKEN_TRANSFER_PROXY_ADDRESS_RP,
  RB_TOKEN_TRANSFER_PROXY_ADDRESS_KV
} from '../_utils/const'

//import { ZeroEx } from '0x.js'
import {
    assetDataUtils,
    BigNumber,
    ContractWrappers,
    generatePseudoRandomSalt,
    //Order,
    orderHashUtils,
    signatureUtils,
    //SignerType
} from '0x.js'
import { Web3Wrapper } from '@0x/web3-wrapper'
import { MetamaskSubprovider } from '@0x/subproviders'
//import { ECSignature, SignatureType, SignedOrder, ValidatorSignature } from '@0x/types';
import { SignatureType } from '@0x/types';

// import ExchangeSelect from '../elements/exchangeSelect'
import Grid from '@material-ui/core/Grid'
import OrderInputFields from '../elements/orderInputFields'
import Paper from '@material-ui/core/Paper'
import PropTypes from 'prop-types'
import React from 'react'
import ReactJson from 'react-json-view'
// import TokenSelect from '../elements/tokenSelect'
import Typography from '@material-ui/core/Typography'
import Web3 from 'web3'
import serializeError from 'serialize-error'

class ExchangeOrderCreatorPage extends React.Component {
  constructor(props, context) {
    super(props, context)
    const KOVAN_NETWORK_ID = 42
    // const DECIMALS = 18
    const ZeroExConfig = {
      networkId: KOVAN_NETWORK_ID
      // exchangeContractAddress: this.state.fundProxyAddress
    }

    const makerAssetAddress= '0x0000000000000000000000000000000000000000' // make dynamic
    const takerAssetAddress= '0x0000000000000000000000000000000000000000'// make dynamic

    const order = {
      makerAddress: '0x0000000000000000000000000000000000000000', // '0x456c3C14aAe3A2d361E6B2879Bfc0Bae15E30c38'.toLowerCase(),
      takerAddress: '0x0000000000000000000000000000000000000000'.toLowerCase(), // in ethfinex taker is 0x0
      feeRecipientAddress: ''.toLowerCase(), // in case of ethfinex it is ethfinex
      senderAddress: '0x0000000000000000000000000000000000000000'.toLowerCase(), // selectedExchange.hotWallet.toLowerCase(),

      makerAssetAmount: Web3Wrapper.toBaseUnitAmount(new BigNumber(5), 18), // Base 18 decimals // prev web3.utils.toBN('0'),
      takerAssetAmount: Web3Wrapper.toBaseUnitAmount(new BigNumber(5), 18), // Base 18 decimals
      makerFee: Web3Wrapper.toBaseUnitAmount(new BigNumber(5), 18),
      takerFee: Web3Wrapper.toBaseUnitAmount(new BigNumber(5), 18),

      expirationTimeSeconds: new BigNumber(
        Date.now() + 86400000 * 365
      ).toFixed(), // Valid for up to an hour if 3600000,
      salt: generatePseudoRandomSalt(), // .toFixed(),

      makerAssetData: assetDataUtils.encodeERC20AssetData(makerAssetAddress.toLowerCase()),
      takerAssetData: assetDataUtils.encodeERC20AssetData(takerAssetAddress.toLowerCase()),

      exchangeAddress: ''.toLowerCase(),
    }

    // const order = JSON.parse(
    //   `
    //   {
    //     "maker": "",
    //     "taker": "0xd360bBb7378725eAC80a474572feaB371CE4B1Af",
    //     "feeRecipient": "0xd360bBb7378725eAC80a474572feaB371CE4B1Af",
    //     "makerTokenAddress": "",
    //     "takerTokenAddress": "",
    //     "exchangeContractAddress": "0x8965a813fb43a141d7741320cd16cc1898af97fb",
    //     "salt": "47645531054892401359967946945272893750943820141091654528528947855572347379873",
    //     "makerFee": "0",
    //     "takerFee": "0",
    //     "makerTokenAmount": "10000",
    //     "takerTokenAmount": "10000",
    //     "expirationUnixTimestampSec": "1567376665000"
    //   }
    // `
    // )
    // const order = {}
    this.state = {
      //zeroEx: zeroEx,
      json_object: {},
      order: order,
      orderHash: '',
      signedOrderStatus: 'succeed',
      exchangeSelected:
        context.networkInfo.id === 42 ? 'RigoBlockEthfinex' : 'RigoBlockZeroX',
      walletAddress: '',
      exchangeList: {
        3: {
          zeroEx: {
            needLocking: false,
            needAllowance: true,
            name: 'ZeroEx',
            exchangeContractAddress:
              '0x479cc461fecd078f766ecc58533d6f69580cf3ac',
            networkId: 3,
          },
          RigoBlockEthfinex: {
            needLocking: true,
            needAllowance: false,
            exchangeContractAddress: RB_EFX_EXCHANGE_ADDRESS_RP,
            networkId: 3,
            name: 'RigoBlockEthfinex',
            tokenTransferProxyContractAddress: RB_EFX_TOKEN_TRANSFER_PROXY_ADDRESS_RP
          }
        },

        // TODO: amend according to 0xv2 addresses and ethfinex schema
        42: {
          zeroEx: {
            needLocking: false,
            needAllowance: true,
            networkId: 42
          },
          RigoBlockZeroX: {
            needLocking: false,
            needAllowance: true,
            exchangeContractAddress: RB_0X_EXCHANGE_ADDRESS_KV,
            networkId: 42,
            name: 'RigoBlockZeroX',
            tokenTransferProxyContractAddress: RB_TOKEN_TRANSFER_PROXY_ADDRESS_KV
          }
        }
      }
    }
  }

  static contextTypes = {
    web3: PropTypes.object.isRequired,
    networkInfo: PropTypes.object.isRequired
  }

  componentDidMount() {
    //const { zeroEx } = this.state
    const { order } = this.state
    // Initialize the Web3Wrapper, this provides helper functions around fetching
    // account information, balances, general contract logs
    //const web3Wrapper = new Web3Wrapper(window.web3.provider, { networkId: 42 })
    const makerAddress = '0x0000000000000000000000000000000000000000' // for debugging
    //const [maker, taker, sender] = web3Wrapper.getAvailableAddressesAsync()
    this.setState({
      order: { ...order, maker: makerAddress }, //result[0]
      walletAddress: makerAddress //result[0]
    })
  }

  onOrderChange = order => {
    this.setState({
      order: order
    })
  }

  async signOrder() {
    const { order, zeroEx } = this.state
    // let ecSignatureError = false
    let hashError = false
    const getHash = () => {
      try {
        const hash = orderHashUtils.getOrderHashHex(order)
        return hash
      } catch (error) {
        console.warn(error)
        hashError = serializeError(error)
        return ''
      }
    }

    const orderHash = getHash()

    if (orderHash !== '') {
      const signerAddress = await zeroEx.getAvailableAddressesAsync()

      // Signing orderHash -> ecSignature
      const shouldAddPersonalMessagePrefix = true

      const ecSignature = await zeroEx
        .signOrderHashAsync(
          orderHash,
          signerAddress[0],
          shouldAddPersonalMessagePrefix
        )
        .catch(error => {
          console.warn(error)
        })
      // Append signature to order
      const signedOrder = {
        ...order,
        ecSignature
      }
      this.setState({
        signedOrder: signedOrder,
        orderHash: orderHash,
        signedOrderStatus: 'succeed',
        hashError: false
      })
    } else {
      this.setState({
        hashError: hashError
      })
    }
  }

  onSignOrder = () => {
    this.signOrder()
  }

  onSetAllowance = async () => {
    const { order } = this.state
    const ZeroExConfig = {
      ...this.state.exchangeList[this.state.exchangeSelected]
    }
    /*
    const ZeroExConfig = {
      networkId: 42
      // exchangeContractAddress: this._network.id
    }
    */
    console.log(ZeroExConfig)
    const contractWrappers = new ContractWrappers(window.web3.provider, ZeroExConfig, { networkId: 42 }) // networkId: NETWORK_CONFIGS.networkId
    // Initialize the Web3Wrapper, this provides helper functions around fetching
    // account information, balances, general contract logs
    const web3Wrapper = new Web3Wrapper(window.web3.provider, ZeroExConfig)
    const [maker, taker, sender] = await web3Wrapper.getAvailableAddressesAsync()

    console.log(`Maker: ${order.makerAddress}`)
    if (order.maker.toLowerCase() === this.state.walletAddress.toLowerCase()) {
      console.log('Setting allowance for MM account')
      //let web3 = new Web3(window.web3.currentProvider)
      //let zeroEx = new ZeroEx(web3.currentProvider, ZeroExConfig)
      const setMakerAllowTxHash = await contractWrappers.erc20Token.setUnlimitedProxyAllowanceAsync(
        order.makerAssetAddress,
        order.makerAddress
      )
      /*let txReceipt = await web3Wrapper.awaitTransactionMinedAsync(
        setMakerAllowTxHash
      )
      console.log(txReceipt)*/
    } else {
      console.log('Setting allowance for the fund')
      const options = {
        from: this.state.walletAddress
      }
      let web3 = new Web3(window.web3.currentProvider)
      const dragoContract = new web3.eth.Contract(
        abis.drago,
        order.maker.toLowerCase()
      )
      console.log(
        `tokenTransferProxy: ${ZeroExConfig.tokenTransferProxyContractAddress}`
      )
      console.log(`TokenAddress: ${order.makerTokenAddress}`)
      console.log(`Manager: ${this.state.walletAddress}`)
      console.log(`Fund: ${order.makerAddress}`)
      dragoContract.methods
        .setInfiniteAllowance(
          ZeroExConfig.tokenTransferProxyContractAddress,
          order.makerAssetAddress
        )
        .estimateGas(options)
        .then(gasEstimate => {
          console.log(gasEstimate)
          options.gas = gasEstimate
        })
        .then(() => {
          dragoContract.methods
            .setInfiniteAllowance(
              ZeroExConfig.tokenTransferProxyContractAddress,
              order.makerAssetAddress
            )
            .send(options)
            .then(result => {
              console.log(result)
            })
        })
    }
  }

  onExchangeSelect = exchangeSelected => {
    this.setState({
      exchangeSelected
    })
  }

  render() {
    const paperStyle = {
      padding: 10
    }
    // const { networkInfo } = this.context
    return (
      <Grid container spacing={8}>
        <Grid item xs={12}>
          <br />
          <Typography variant="h5">ORDER</Typography>
          <Paper style={paperStyle} elevation={2}>
            <OrderInputFields
              order={this.state.order}
              onOrderChange={this.onOrderChange}
              onSignOrder={this.onSignOrder}
            />
            <br />
            <br />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h5">ORDER HASH</Typography>
          {this.state.hashError ? (
            <ReactJson
              src={this.state.hashError}
              style={{ padding: '5px' }}
              theme="codeschool"
              indentWidth="2"
              collapsed="2"
            />
          ) : (
            this.state.orderHash
          )}
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h5">ORDER OBJECT</Typography>
          <ReactJson
            src={this.state.signedOrder}
            style={{ padding: '5px' }}
            theme="codeschool"
            indentWidth="2"
            collapsed="2"
          />
        </Grid>
      </Grid>
    )
  }
}

export default ExchangeOrderCreatorPage
