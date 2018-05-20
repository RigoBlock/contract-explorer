import React from 'react';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';
import PropTypes from 'prop-types';
import { BigNumber } from '@0xproject/utils';
import ReactJson from 'react-json-view'
import Paper from 'material-ui/Paper';
import {
  FUND_PROXY_ADDRESS,
  RB_EXCHANGE_ADDRESS,
  RB_TOKEN_TRANSFER_PROXY_ADDRESS
} from '../_utils/const'

// 0x stuff
// import * as Web3ProviderEngine from 'web3-provider-engine/dist/es5';
// import * as RPCSubprovider from 'web3-provider-engine/dist/es5/subproviders/rpc';
// import { InjectedWeb3Subprovider } from '@0xproject/subproviders';
import { ZeroEx } from '0x.js';
import Web3 from 'web3';
import serializeError from 'serialize-error';

import OrderInputFields from "../elements/orderInputFields"
import SetAllowanceButton from "../elements/setAllowanceButton"
import ExchangeSelect from '../elements/exchangeSelect'
import * as abis from '../abi/index'


class ExchangeOrderCreator extends React.Component {

  constructor(props, context) {
    super(props, context)
    const KOVAN_NETWORK_ID = 42;
    const DECIMALS = 18;
    const ZeroExConfig = {
      networkId: KOVAN_NETWORK_ID,
      // exchangeContractAddress: this.state.fundProxyAddress
    }
    // Create a Web3 Provider Engine
    // const providerEngine = new Web3ProviderEngine();
    // providerEngine.addProvider(new InjectedWeb3Subprovider(web3.currentProvider));
    // providerEngine.addProvider(new RPCSubprovider({ rpcUrl: 'https://srv03.endpoint.network:8545' }));
    // providerEngine.start();
    var web3 = new Web3(window.web3.currentProvider)
    var zeroEx = new ZeroEx(web3.currentProvider, ZeroExConfig);
    const WETH_ADDRESS = '0xd0a1e359811322d97991e03f863a0c30c2cf029c'; // The wrapped ETH token contract
    const ZRX_ADDRESS = '0x6ff6c0ff1d68b964901f986d4c9fa3ac68346570'; // The ZRX token contract
    // const EXCHANGE_ADDRESS = zeroEx.exchange.getContractAddress();
    const EXCHANGE_ADDRESS = '0xf307de6528fa16473d8f6509b7b1d8851320dba5'
    // const order = {
    //   maker: ZeroEx.NULL_ADDRESS,
    //   // maker: '0x456c3C14aAe3A2d361E6B2879Bfc0Bae15E30c38'.toLowerCase(),
    //   taker: ZeroEx.NULL_ADDRESS,
    //   feeRecipient: ZeroEx.NULL_ADDRESS,
    //   makerTokenAddress: WETH_ADDRESS,
    //   takerTokenAddress: ZRX_ADDRESS,
    //   exchangeContractAddress: EXCHANGE_ADDRESS,
    //   salt: ZeroEx.generatePseudoRandomSalt(),
    //   makerFee: new BigNumber(0),
    //   takerFee: new BigNumber(0),
    //   makerTokenAmount: ZeroEx.toBaseUnitAmount(new BigNumber(0.001), DECIMALS), // Base 18 decimals
    //   takerTokenAmount: ZeroEx.toBaseUnitAmount(new BigNumber(0.01), DECIMALS), // Base 18 decimals
    //   expirationUnixTimestampSec: new BigNumber(Date.now() + 3600000), // Valid for up to an hour
    // };
    const order = JSON.parse(
      `
      {
        "maker": "0xc8dcd42e846466f2d2b89f3c54eba37bf738019b",
        "taker": "0x0000000000000000000000000000000000000000",
        "feeRecipient": "0x173a2467cece1f752eb8416e337d0f0b58cad795",
        "makerTokenAddress": "0xd0a1e359811322d97991e03f863a0c30c2cf029c",
        "takerTokenAddress": "0x6ff6c0ff1d68b964901f986d4c9fa3ac68346570",
        "exchangeContractAddress": "0x90fe2af704b34e0224bf2299c838e04d4dcf1364",
        "salt": "47645531054892401359967946945272893750943820141091654528528947855572347379873",
        "makerFee": "135",
        "takerFee": "400",
        "makerTokenAmount": "344000000000000000",
        "takerTokenAmount": "20000000000000000000",
        "expirationUnixTimestampSec": "1526065104396"
      }
    `
    )
    this.state = {
      zeroEx: zeroEx,
      json_object: {},
      order: order,
      orderHash: '',
      signedOrderStatus: 'succeed',
      exchangeSelected: 'rigoBlock',
      walletAddress: '',
      exchangeList: {
        zeroEx: {
          networkId: 42,
        },
        rigoBlock: {
          exchangeContractAddress: RB_EXCHANGE_ADDRESS,
          networkId: 42,
          tokenTransferProxyContractAddress: RB_TOKEN_TRANSFER_PROXY_ADDRESS,
        }
      },
    };
  }

  static contextTypes = { web3: PropTypes.object.isRequired };

  componentDidMount() {
    const { zeroEx } = this.state
    const { order } = this.state
    zeroEx._web3Wrapper._web3.eth.getAccounts((error, result) => {
      this.setState({
        order: { ...order, maker: result[0] },
        walletAddress: result[0]
      })
    })
  }

  onOrderChange = (order) => {
    this.setState({
      order: order
    })
  }

  async signOrder() {
    const { order, zeroEx } = this.state
    var ecSignatureError = false
    var hashError = false
    const getHash = () => {
      try {
        const hash = ZeroEx.getOrderHashHex(order)
        return hash
      }
      catch (error) {
        console.log(error)
        hashError = serializeError(error)
        return ''
      }
    }

    const orderHash = getHash()

    if (orderHash !== '') {
      const signerAddress = await zeroEx.getAvailableAddressesAsync()

      // Signing orderHash -> ecSignature
      const shouldAddPersonalMessagePrefix = true;

      const ecSignature = await zeroEx.signOrderHashAsync(orderHash, signerAddress[0], shouldAddPersonalMessagePrefix)
        .catch((error) => {
          console.log(error)
        }
        )
      // Append signature to order
      const signedOrder = {
        ...order,
        ecSignature,
      };
      this.setState({
        signedOrder: signedOrder,
        orderHash: orderHash,
        signedOrderStatus: 'succeed',
        hashError: false,
      })
    } else {
      this.setState({
        hashError: hashError,
      })
    }

  }

  onSignOrder = () => {
    this.signOrder()
  }

  onSetAllowance = async () => {
    const { order } = this.state
    const ZeroExConfig = { ...this.state.exchangeList[this.state.exchangeSelected] }
    console.log(ZeroExConfig)
    console.log(`Maker: ${order.maker}`)
    if (order.maker.toLowerCase() === this.state.walletAddress.toLowerCase()) {
      console.log('Setting allowance for MM account')
      let web3 = new Web3(window.web3.currentProvider)
      var zeroEx = new ZeroEx(web3.currentProvider, ZeroExConfig);
      const setMakerAllowTxHash = await zeroEx.token.setUnlimitedProxyAllowanceAsync(order.makerTokenAddress, order.maker);
      let txReceipt = await zeroEx.awaitTransactionMinedAsync(setMakerAllowTxHash);
      console.log(txReceipt)
      // const setMakerAllowTxHash2 = await zeroEx.token.setUnlimitedProxyAllowanceAsync(order.takerTokenAddress, order.maker);
      // const txReceipt2 = await zeroEx.awaitTransactionMinedAsync(setMakerAllowTxHash2);
      // console.log(txReceipt2)
    } else {
      console.log('Setting allowance for the fund')
      const options = {
        from: this.state.walletAddress
      }
      let web3 = new Web3(window.web3.currentProvider)
      const dragoContract = new web3.eth.Contract(abis.drago, order.maker.toLowerCase())
      console.log(`tokenTransferProxy: ${ZeroExConfig.tokenTransferProxyContractAddress}`)
      console.log(`TokenAddress: ${order.makerTokenAddress}`)
      console.log((`Manager: ${this.state.walletAddress}`))
      console.log((`Fund: ${order.maker}`))
      dragoContract.methods
      .setInfiniteAllowance(ZeroExConfig.tokenTransferProxyContractAddress, order.makerTokenAddress)
      .estimateGas(options)
      .then(gasEstimate => {
        console.log(gasEstimate)
        options.gas = gasEstimate
      })
      .then(() => {
        dragoContract.methods.setInfiniteAllowance(ZeroExConfig.tokenTransferProxyContractAddress, order.makerTokenAddress)
        .send(options)
        .then(result =>{
          console.log(result)
        })
      })
    }
  }

  onExchangeSelect = (exchangeSelected) => {
    this.setState({
      exchangeSelected
    })
  }

  render() {
    const paperStyle = {
      padding: 10,
    }
    return (
      <Grid container spacing={8}>
        <Grid item xs={12}>
          <br />
          <Typography variant="headline" >
            ORDER
          </Typography>
          <Paper style={paperStyle} elevation={2} >
            <OrderInputFields order={this.state.order} onOrderChange={this.onOrderChange} onSignOrder={this.onSignOrder} />
            <br />
            <br />
            <ExchangeSelect onExchangeSelect={this.onExchangeSelect} exchangesList={this.state.exchangeList} />
            <br />
            <br />
            <SetAllowanceButton onSetAllowance={this.onSetAllowance} />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="headline" >
            ORDER HASH
          </Typography>
          {(this.state.hashError)
            ? <ReactJson
              src={this.state.hashError}
              style={{ padding: "5px" }}
              theme="codeschool"
              indentWidth="2"
              collapsed="2"
            />
            : this.state.orderHash}
        </Grid>
        <Grid item xs={12}>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="headline" >
            ORDER OBJECT
          </Typography>
          <ReactJson
            src={this.state.signedOrder}
            style={{ padding: "5px" }}
            theme="codeschool"
            indentWidth="2"
            collapsed="2"
          />
        </Grid>
      </Grid>
    );
  }
}

export default ExchangeOrderCreator;