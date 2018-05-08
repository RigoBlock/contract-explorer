import React from 'react';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';
import PropTypes from 'prop-types';
import { FormControl, FormHelperText } from 'material-ui/Form';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import Paper from 'material-ui/Paper';
import Web3 from 'web3';
// import { BigNumber } from '@0xproject/utils';
import BigNumber from 'bignumber.js';
// 0x stuff
// import * as Web3ProviderEngine from 'web3-provider-engine/dist/es5';
// import * as RPCSubprovider from 'web3-provider-engine/dist/es5/subproviders/rpc';
// import { InjectedWeb3Subprovider } from '@0xproject/subproviders';
import { ZeroEx } from '0x.js';
import ReactJson from 'react-json-view'
import serializeError from 'serialize-error';
import ExchangeSelect from '../elements/exchangeSelect'
import SetAllowanceButton from "../elements/setAllowanceButton"
import * as abis from '../abi/index'
import {
  FUND_PROXY_ADDRESS,
  RB_EXCHANGE_ADDRESS,
  RB_TOKEN_TRANSFER_PROXY_ADDRESS
} from '../_utils/const'




class ExchangeOrderFiller extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      orderError: false,
      validation: {
        schema: { valid: false, errors: {} },
        hash: false,
        hashError: {
          error: {}
        },
        signature: false,
        signatureError: {
          error: {}
        },
        txReceipt: {},
        amount: '0',
      },
      submitDisabled: true,
      exchangeSelected: 'rigoBlock',

      exchangeList: {
        zeroEx: {
          networkId: 42,
          exchangeContractAddress: '0x90fe2af704b34e0224bf2299c838e04d4dcf1364'
        },
        rigoBlock: {
          exchangeContractAddress: RB_EXCHANGE_ADDRESS.toLowerCase(),
          networkId: 42,
          tokenTransferProxyContractAddress: RB_TOKEN_TRANSFER_PROXY_ADDRESS.toLowerCase(),
        }
      },
      // DRAGO ORDER
      // order: JSON.parse(
      //   `
      //   {
      //     "maker": "0x456c3c14aae3a2d361e6b2879bfc0bae15e30c38",
      //     "taker": "0x0000000000000000000000000000000000000000",
      //     "feeRecipient": "0x0000000000000000000000000000000000000000",
      //     "makerTokenAddress": "0x653e49e301e508a13237c0ddc98ae7d4cd2667a1",
      //     "takerTokenAddress": "0x6ff6c0ff1d68b964901f986d4c9fa3ac68346570",
      //     "exchangeContractAddress": "0x2014966a0a31d5e1044ccde8292c89adee91a2b4",
      //     "salt": "26881661112988904996117684607800586900024442447157860318541607443929926645972",
      //     "makerFee": "0",
      //     "takerFee": "0",
      //     "makerTokenAmount": "10000000000000000",
      //     "takerTokenAmount": "10000000000000000",
      //     "expirationUnixTimestampSec": "1525451700538",
      //     "ecSignature": {
      //       "v": 28,
      //       "r": "0x43c80491d4b2a15218459de4518f96827cba4ae820cc1caeaeac354406da509b",
      //       "s": "0x73eaf84f7bacbcc4ca9a9c64db33cf05511d76646891421710bca29fed5e40aa"
      //     }
      //   }
      // `
      // ),

      order: JSON.parse(
        `
        {
          "maker": "0x456c3c14aae3a2d361e6b2879bfc0bae15e30c38",
          "taker": "0x0000000000000000000000000000000000000000",
          "feeRecipient": "0x0000000000000000000000000000000000000000",
          "makerTokenAddress": "0xd0a1e359811322d97991e03f863a0c30c2cf029c",
          "takerTokenAddress": "0x6ff6c0ff1d68b964901f986d4c9fa3ac68346570",
          "exchangeContractAddress": "0xf307de6528fa16473d8f6509b7b1d8851320dba5",
          "salt": "93037647869698799259209030903686390931465280197212055172913091010649704452677",
          "makerFee": "0",
          "takerFee": "0",
          "makerTokenAmount": "10000000000000000",
          "takerTokenAmount": "10000000000000000",
          "expirationUnixTimestampSec": "1525779511291",
          "ecSignature": {
            "v": 27,
            "r": "0xe548eeb49318dc7431b5bff23232e2dc3063c369931e49f5b3a918f5d7385cdb",
            "s": "0x7e22e4f3c1711e2ff504bd3ba0eeb05a748d6fb68b791e9dc0c30e92b4c1a265"
          }
        }
        `
      ),
      filledAmount: '0.001'
      // order: 
      // `
      // {"maker":"0xec4ee1bcf8107480815b08b530e0ead75b9f804f","taker":"0x0000000000000000000000000000000000000000","makerFee":"0","takerFee":"0","makerTokenAmount":"10000000000000000","takerTokenAmount":"10000000000000000","makerTokenAddress":"0xd0a1e359811322d97991e03f863a0c30c2cf029c","takerTokenAddress":"0x6ff6c0ff1d68b964901f986d4c9fa3ac68346570","expirationUnixTimestampSec":"2524608000","feeRecipient":"0x0000000000000000000000000000000000000000","salt":"42915409420279271885015915205547393322324115969244938610857696117752690836404","ecSignature":{"v":27,"r":"0xa28fb15b28bebdf29c89593fe2e1bd999d5ab416622a6f4157b041b27e7fcab0","s":"0x51ae5e4c276e60b429ecc31da788840e5e1f24a6e260d0fb62c952e4968496a9"},"exchangeContractAddress":"0x90fe2af704b34e0224bf2299c838e04d4dcf1364"}
      // `,
      // order: ''

    };
  }

  static contextTypes = { web3: PropTypes.object.isRequired };

  componentDidMount() {
    const KOVAN_NETWORK_ID = 42;
    const ZeroExConfig = {
      networkId: KOVAN_NETWORK_ID,
    }
    var web3 = new Web3(window.web3.currentProvider)
    var zeroEx = new ZeroEx(web3.currentProvider, ZeroExConfig);
    zeroEx._web3Wrapper._web3.eth.getAccounts((error, result) => {
      this.setState({
        walletAddress: result[0]
      })
    })
  }

  onFillOrder = async () => {
    const DECIMALS = 18;
    const { order } = this.state

    // 1
    //
    // 0x LIBRARY
    //

    // const shouldThrowOnInsufficientBalanceOrAllowance = true;
    // const orderToFill = {
    //   maker: order.maker,
    //   taker: order.taker,
    //   feeRecipient: order.feeRecipient,
    //   makerTokenAddress: order.makerTokenAddress,
    //   takerTokenAddress: order.takerTokenAddress,
    //   exchangeContractAddress: order.exchangeContractAddress,
    //   salt: order.salt,
    //   makerFee: new BigNumber(order.makerFee),
    //   takerFee: new BigNumber(order.makerFee),
    //   makerTokenAmount: new BigNumber(order.makerTokenAmount),
    //   takerTokenAmount: new BigNumber(order.takerTokenAmount),
    //   expirationUnixTimestampSec: new BigNumber(order.expirationUnixTimestampSec),
    //   ecSignature: order.ecSignature
    // };
    // console.log(order)
    // const takerAddress = this.state.walletAddress
    // console.log(this.state.walletAddress)
    // const fillTakerTokenAmount = ZeroEx.toBaseUnitAmount(new BigNumber(this.state.filledAmount), DECIMALS);
    // const ZeroExConfig = { ...this.state.exchangeList[this.state.exchangeSelected] }
    // console.log(ZeroExConfig)
    // var web3 = new Web3(window.web3.currentProvider)
    // var zeroEx = new ZeroEx(web3.currentProvider, ZeroExConfig);
    // const txHash = await zeroEx.exchange.fillOrderAsync(
    //   orderToFill,
    //   fillTakerTokenAmount,
    //   shouldThrowOnInsufficientBalanceOrAllowance,
    //   takerAddress,
    //   {
    //     shouldValidate: false
    //   }
    // )
    //   .catch(error => {
    //     this.setState({
    //       txReceipt: serializeError(error)
    //     })
    //     return serializeError(error)
    //   })
    // const txReceipt = await zeroEx.awaitTransactionMinedAsync(txHash);
    // this.setState({
    //   txReceipt: txReceipt
    // })
    // console.log('FillOrder transaction receipt: ', txReceipt);

    // 2
    //
    // WEB3 RAW TRANSACTION
    //

    const ZeroExConfig = { ...this.state.exchangeList[this.state.exchangeSelected] }
    const options = {
      from: this.state.walletAddress
    }
    let web3 = new Web3(window.web3.currentProvider)
    console.log(`Exchange address: ${ZeroExConfig.exchangeContractAddress}`)
    const exchangeContract = new web3.eth.Contract(abis.zeroExExchange, ZeroExConfig.exchangeContractAddress)
    console.log(exchangeContract)
    const orderAddresses = [
      order.maker,
      order.taker,
      order.makerTokenAddress,
      order.takerTokenAddress,
      order.feeRecipient,
    ]
    const orderValues = [
      order.makerTokenAmount,
      order.takerTokenAmount,
      order.makerFee,
      order.takerFee,
      order.expirationUnixTimestampSec,
      order.salt
    ]
    const v = order.ecSignature.v
    const r = order.ecSignature.r
    const s = order.ecSignature.s
    const shouldThrowOnInsufficientBalanceOrAllowance = true;
    console.log(
      orderAddresses,
      orderValues,
      ZeroEx.toBaseUnitAmount(new BigNumber(this.state.filledAmount), DECIMALS).toString(),
      shouldThrowOnInsufficientBalanceOrAllowance,
      v,
      r,
      s
    )

    // 3
    //
    // WEB3 NORMAL
    //

    const encodedABI = exchangeContract.methods
      .fillOrder(
        orderAddresses,
        orderValues,
        '1000',
        shouldThrowOnInsufficientBalanceOrAllowance,
        v,
        r,
        s
      )
      .encodeABI()

    console.log(encodedABI)

    const transactionObject = {
      from: this.state.walletAddress,
      to: ZeroExConfig.exchangeContractAddress,
      data: encodedABI
    }
    web3.eth.estimateGas(transactionObject)
      .then(gasEstimate => {
        console.log(gasEstimate)
        transactionObject.gas = gasEstimate
      })
      .then(() =>{
        web3.eth.sendTransaction(transactionObject)
        .then(result => {
          console.log(result)

        })
      })
      .catch(error => {
        console.log(error)
        console.log('Error sending encoded transaction')
        this.setState({
          txReceipt: serializeError(error)
        })
      })

    //
    // WEB3 NORMAL
    //

    // exchangeContract.methods
    //   .fillOrder(
    //     orderAddresses,
    //     orderValues,
    //     ZeroEx.toBaseUnitAmount(new BigNumber(this.state.filledAmount), DECIMALS),
    //     shouldThrowOnInsufficientBalanceOrAllowance,
    //     v,
    //     r,
    //     s
    //   )
    //   .estimateGas(options)
    //   .then(gasEstimate => {
    //     console.log(gasEstimate)
    //     options.gas = '600000'
    //   })
    //   .then(() => {
    //     exchangeContract.methods
    //       .fillOrder(orderAddresses,
    //         orderValues,
    //         ZeroEx.toBaseUnitAmount(new BigNumber(this.state.filledAmount), DECIMALS),
    //         shouldThrowOnInsufficientBalanceOrAllowance,
    //         v,
    //         r,
    //         s)
    //       .send(options)
    //       .then(result => {
    //         console.log(result)
    //       })
    //   })
    //   .catch(error => {
    //     console.log(error)
    //     this.setState({
    //       txReceipt: serializeError(error)
    //     })
    //   })
  }

  onAmountChange = (event) => {
    try {
      new BigNumber(event.target.value)
      this.setState({
        submitDisabled: false,
      })
    }
    catch (error) {
      this.setState({
        submitDisabled: true,
      })
    }
    this.setState({
      filledAmount: event.target.value,
    })
  }

  onExchangeSelect = (exchangeSelected) => {
    this.setState({
      exchangeSelected
    })
  }

  onTextFieldChange = (event) => {
    try {
      const parsedOrder = JSON.parse(event.target.value)
      this.setState({
        order: parsedOrder,
        orderError: true
      })
    }
    catch (err) {
      this.setState({
        orderError: false
      })
    }
  }


  onSetAllowance = async () => {
    const { order } = this.state
    const ZeroExConfig = { ...this.state.exchangeList[this.state.exchangeSelected] }
    console.log(ZeroExConfig)
    console.log('Setting allowance for MM account')
    let web3 = new Web3(window.web3.currentProvider)
    var zeroEx = new ZeroEx(web3.currentProvider, ZeroExConfig);
    const setTakerAllowTxHash = await zeroEx.token.setUnlimitedProxyAllowanceAsync(order.takerTokenAddress, this.state.walletAddress.toLowerCase());
    let txReceipt = await zeroEx.awaitTransactionMinedAsync(setTakerAllowTxHash);
    console.log(txReceipt)
    // const setMakerAllowTxHash2 = await zeroEx.token.setUnlimitedProxyAllowanceAsync(order.takerTokenAddress, order.maker);
    // const txReceipt2 = await zeroEx.awaitTransactionMinedAsync(setMakerAllowTxHash2);
    // console.log(txReceipt2)

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
            FILLER
          </Typography>
          <Paper style={paperStyle} elevation={2} >
            <FormControl fullWidth={true} error={this.error}>
              <TextField
                id="order"
                key="order"
                label="Order"
                InputLabelProps={{
                  shrink: true,
                }}
                // placeholder={element.type}
                onChange={this.onTextFieldChange}
                multiline={true}
                rows={20}
                fullWidth
                margin="normal"
                value={JSON.stringify(this.state.order, null, 4)}
              />
              <FormHelperText>{this.state.errorMsg}</FormHelperText>
            </FormControl>
            <FormControl fullWidth={true}>
              <TextField
                id="amount"
                key="amount"
                label="Amount"
                InputLabelProps={{
                  shrink: true,
                }}
                // placeholder={element.type}
                onChange={this.onAmountChange}
                fullWidth
                margin="normal"
                value={this.state.filledAmount}
              />
              <FormHelperText>{this.state.errorMsg}</FormHelperText>
              <br />
            </FormControl>
            <ExchangeSelect onExchangeSelect={this.onExchangeSelect} exchangesList={this.state.exchangeList} />
            <br />
            < br />
            <FormControl fullWidth={true} >
              <Button variant="raised" color="primary" onClick={this.onFillOrder} disabled={!this.state.submitDisabled}>
                SUBMIT
              </Button>
            </FormControl>
            < br />
            < br />

            <SetAllowanceButton onSetAllowance={this.onSetAllowance} />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={8}>
            <Grid item xs={6}>
              <Typography variant="headline" >
                RECEIPT
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <ReactJson
                src={this.state.txReceipt}
                style={{ padding: "5px" }}
                theme="codeschool"
                indentWidth="2"
                collapsed="2"
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export default ExchangeOrderFiller;