import React from 'react';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';
import PropTypes from 'prop-types';
import { FormControl, FormHelperText } from 'material-ui/Form';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import Paper from 'material-ui/Paper';
import Web3 from 'web3';
import { BigNumber } from '@0xproject/utils';

// 0x stuff
// import * as Web3ProviderEngine from 'web3-provider-engine/dist/es5';
// import * as RPCSubprovider from 'web3-provider-engine/dist/es5/subproviders/rpc';
// import { InjectedWeb3Subprovider } from '@0xproject/subproviders';
import {ZeroEx} from '0x.js';
import red from 'material-ui/colors/red';
import green from 'material-ui/colors/green';
import {SchemaValidator, ValidatorResult, schemas} from '@0xproject/json-schemas';
import ReactJson from 'react-json-view'
import serializeError  from 'serialize-error';


class ExchangeOrderFiller extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      orderError: false,
      validation: {
        schema: {valid: false, errors: {}},
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
      // order: 
      //   `
      //   {
      //     "maker": "0x65d5994ab851c5c0f31be953060394cfc171e7c7",
      //     "taker": "0x0000000000000000000000000000000000000000",
      //     "feeRecipient": "0x0000000000000000000000000000000000000000",
      //     "makerTokenAddress": "0x6ff6c0ff1d68b964901f986d4c9fa3ac68346570",
      //     "takerTokenAddress": "0x653e49e301e508a13237c0ddc98ae7d4cd2667a1",
      //     "exchangeContractAddress": "0x90fe2af704b34e0224bf2299c838e04d4dcf1364",
      //     "salt": "48356371335730049766120964308515640518073031323479806394559131209349802548215",
      //     "makerFee": "0",
      //     "takerFee": "0",
      //     "makerTokenAmount": "0",
      //     "takerTokenAmount": "0",
      //     "expirationUnixTimestampSec": "1524424722806",
      //     "ecSignature": {
      //       "v": 27,
      //       "r": "0x25765d00fce19598fe4afcc9452ae0aed41c9f39fd59993cdde91112fde2ce50",
      //       "s": "0x6014e7200d8a55d4fd1b0f54ffb159c0d03d0e5ebc2b6f0988ab8cf113ce3878"
      //     }
      //   }
      //   `
      // order: 
      // `
      // {"maker":"0xec4ee1bcf8107480815b08b530e0ead75b9f804f","taker":"0x0000000000000000000000000000000000000000","makerFee":"0","takerFee":"0","makerTokenAmount":"10000000000000000","takerTokenAmount":"10000000000000000","makerTokenAddress":"0xd0a1e359811322d97991e03f863a0c30c2cf029c","takerTokenAddress":"0x6ff6c0ff1d68b964901f986d4c9fa3ac68346570","expirationUnixTimestampSec":"2524608000","feeRecipient":"0x0000000000000000000000000000000000000000","salt":"42915409420279271885015915205547393322324115969244938610857696117752690836404","ecSignature":{"v":27,"r":"0xa28fb15b28bebdf29c89593fe2e1bd999d5ab416622a6f4157b041b27e7fcab0","s":"0x51ae5e4c276e60b429ecc31da788840e5e1f24a6e260d0fb62c952e4968496a9"},"exchangeContractAddress":"0x90fe2af704b34e0224bf2299c838e04d4dcf1364"}
      // `,
      order: ''
      
    };
  }

  static contextTypes = {web3: PropTypes.object.isRequired};

  componentDidMount() {
    const KOVAN_NETWORK_ID = 42;
    const ZeroExConfig = {
      networkId: KOVAN_NETWORK_ID,
    }
    var web3 = new Web3(window.web3.currentProvider)
    var zeroEx = new ZeroEx(web3.currentProvider, ZeroExConfig);
    zeroEx._web3Wrapper._web3.eth.getAccounts((error, result) => {
      this.setState({
        metaMaskAccount: result[0]
      })
    })
  }

  onFillOrder = async () => {
    const DECIMALS = 18;
    const { order } = this.state
    const shouldThrowOnInsufficientBalanceOrAllowance = true;
    const getOrderObject = () => {
      try {
        return JSON.parse(order)
      }
      catch (error) {
        return {}
      }
    }
    const orderObject = getOrderObject()
    const orderToFill = {
      maker: orderObject.maker,
      taker: orderObject.taker,
      feeRecipient: orderObject.feeRecipient,
      makerTokenAddress: orderObject.makerTokenAddress,
      takerTokenAddress: orderObject.takerTokenAddress,
      exchangeContractAddress: orderObject.exchangeContractAddress,
      salt: orderObject.salt,
      makerFee: new BigNumber(orderObject.makerFee),
      takerFee: new BigNumber(orderObject.makerFee),
      makerTokenAmount: new BigNumber(orderObject.makerTokenAmount),
      takerTokenAmount: new BigNumber(orderObject.takerTokenAmount),
      expirationUnixTimestampSec: new BigNumber(orderObject.expirationUnixTimestampSec),
      ecSignature: orderObject.ecSignature
    };
    const takerAddress = this.state.metaMaskAccount
    const fillTakerTokenAmount = ZeroEx.toBaseUnitAmount(new BigNumber(this.state.amount), DECIMALS);
    const KOVAN_NETWORK_ID = 42;
    const ZeroExConfig = {
      networkId: KOVAN_NETWORK_ID,
      exchangeContractAddress: orderToFill.exchangeContractAddress
    }
    var web3 = new Web3(window.web3.currentProvider)
    var zeroEx = new ZeroEx(web3.currentProvider, ZeroExConfig);
    const txHash = await zeroEx.exchange.fillOrderAsync(
      orderToFill,
      fillTakerTokenAmount,
      shouldThrowOnInsufficientBalanceOrAllowance,
      takerAddress,
    )
    .catch(error => {
      this.setState({
        txReceipt: serializeError(error)
      })
      // return serializeError(error)
    })
    const txReceipt = await zeroEx.awaitTransactionMinedAsync(txHash);
    this.setState({
      txReceipt: txReceipt
    })
    console.log('FillOrder transaction receipt: ', txReceipt);
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
      amount: event.target.value,
    }) 
}

  onTextFieldChange = (event) => {
      try {
        JSON.parse(event.target.value)
        this.setState({
          order: event.target.value,
          orderError: true
        }) 
      }
      catch (err) {
        this.setState({
          orderError: false
        }) 
      }
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
                value={this.state.order}
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
                // value={this.state.amount}
              />
              <FormHelperText>{this.state.errorMsg}</FormHelperText>
              <br />
            </FormControl>
            <FormControl fullWidth={true} >
            <Button variant="raised" color="primary" onClick={this.onFillOrder} disabled={this.state.submitDisabled}>
                SUBMIT
              </Button>
            </FormControl>
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