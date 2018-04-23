import React from 'react';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';
import PropTypes from 'prop-types';
import { FormControl, FormHelperText } from 'material-ui/Form';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import Paper from 'material-ui/Paper';
import Web3 from 'web3';

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


class ExchangeOrderValidator extends React.Component {

  constructor(props) {
    super(props)
    const KOVAN_NETWORK_ID = 42;
    const ZeroExConfig = {
      networkId: KOVAN_NETWORK_ID,
      // exchangeContractAddress: this.state.fundProxyAddress
    }
    // Create a Web3 Provider Engine
    // const providerEngine = new Web3ProviderEngine();
    // providerEngine.addProvider(new InjectedWeb3Subprovider(window.web3.currentProvider));
    // providerEngine.addProvider(new RPCSubprovider({ rpcUrl: 'https://srv03.endpoint.network:8545' }));
    // providerEngine.start();
    var web3 = new Web3(window.web3.currentProvider)
    var zeroEx = new ZeroEx(web3.currentProvider, ZeroExConfig);
    this.state = {
      zeroEx: zeroEx,
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
        }
      },
      // order: 
      //   `{
      //     "maker": "0xc8dcd42e846466f2d2b89f3c54eba37bf738019b",
      //     "taker": "0x0000000000000000000000000000000000000000",
      //     "feeRecipient": "0x0000000000000000000000000000000000000000",
      //     "makerTokenAddress": "0x6ff6c0ff1d68b964901f986d4c9fa3ac68346570",
      //     "takerTokenAddress": "0x653e49e301e508a13237c0ddc98ae7d4cd2667a1",
      //     "exchangeContractAddress": "0x90fe2af704b34e0224bf2299c838e04d4dcf1364",
      //     "salt": "56565891822800224983939090003039772469175867842717407358037642829940228233709",
      //     "makerFee": "0",
      //     "takerFee": "0",
      //     "makerTokenAmount": "0",
      //     "takerTokenAmount": "0",
      //     "expirationUnixTimestampSec": "1524401337851",
      //     "ecSignature": {
      //       "v": 27,
      //       "r": "0x2e20c911d0afe910a3ead88c8bbabe4e7000b21c870d2e6c47a1d5268d13ff8e",
      //       "s": "0x4030aa8626addd1e619d3109c7eed30e3ccfa3e5408173d701e66a7cc109d9e0"
      //     }
      //   }`
      // order: 
      // `
      // {
      //   "maker": "0x65d5994ab851c5c0f31be953060394cfc171e7c7",
      //   "taker": "0x0000000000000000000000000000000000000000",
      //   "feeRecipient": "0x0000000000000000000000000000000000000000",
      //   "makerTokenAddress": "0x6ff6c0ff1d68b964901f986d4c9fa3ac68346570",
      //   "takerTokenAddress": "0x653e49e301e508a13237c0ddc98ae7d4cd2667a1",
      //   "exchangeContractAddress": "0x90fe2af704b34e0224bf2299c838e04d4dcf1364",
      //   "salt": "48356371335730049766120964308515640518073031323479806394559131209349802548215",
      //   "makerFee": "0",
      //   "takerFee": "0",
      //   "makerTokenAmount": "0",
      //   "takerTokenAmount": "0",
      //   "expirationUnixTimestampSec": "1524424722806",
      //   "ecSignature": {
      //     "v": 27,
      //     "r": "0x25765d00fce19598fe4afcc9452ae0aed41c9f39fd59993cdde91112fde2ce50",
      //     "s": "0x6014e7200d8a55d4fd1b0f54ffb159c0d03d0e5ebc2b6f0988ab8cf113ce3878"
      //   }
      // }
      // `,
      order: ''
      
    };
  }

  static contextTypes = {web3: PropTypes.object.isRequired};


  onValidateOrder = () => {
    const { order } = this.state
    const {orderSchema} = schemas;
    var validation = {
      schema: {valid: false, errors: {}},
      hash: false,
      hashError: {
        error: {}
      },
      signature: false,
      signatureError: {
        error: {}
      }
    }
    const getOrderObject = () =>{
      try {
        return JSON.parse(order)
      }
      catch (error) {
        return {}
      }
    }
    const validator = new SchemaValidator();
    const orderObject = getOrderObject()
    validation.schema = validator.validate(orderObject, orderSchema)

    const getHash = () => {
      try {
        const hash = ZeroEx.getOrderHashHex(orderObject)
        validation.hash = false
        return hash
      }
      catch (err) {
        console.log(err)
        return ''
      }
    }
    const orderHash = getHash()

    const checkHash = () => {
      try {
        return ZeroEx.isValidOrderHash(orderHash)
      }
      catch (error) {
        console.log(error)
        validation.hashError = serializeError(error)
        return false
      }
    }
    
    const checkSignature = () => {
      try {
        return ZeroEx.isValidSignature(
          orderHash,
          orderObject.ecSignature,
          orderObject.maker
        )
      }
      catch (error) {
        console.log(error)
        validation.signatureError = serializeError(error)
        return false
      }
    }
    
    validation.hash = checkHash()
    validation.signature = checkSignature()

    this.setState({
      validation: validation})
  
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
    const validation = {
      error: {
        color: red[500]
      },
      success: {
        color: green[500]
      }
    }
    return (
      <Grid container spacing={8}>
        <Grid item xs={12}>
          <br />
          <Typography variant="headline" >
            VALIDATOR
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
              <br />
              <Button variant="raised" color="primary" onClick={this.onValidateOrder}>
                Validate
        </Button>
            </FormControl>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={8}>
            <Grid item xs={6}>
              <Typography variant="headline" >
                SCHEMA VALIDATION
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="headline" >
                {this.state.validation.schema.valid ? <span style={validation.success}>PASS</span> : <span style={validation.error}>FAIL</span> }
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <ReactJson
              src={this.state.validation.schema.errors}
              style={{ padding: "5px" }}
              theme="codeschool"
              indentWidth="2"
              collapsed="2"
              />
            </Grid>
          </Grid>
          <Grid container spacing={8}>
            <Grid item xs={6}>
              <Typography variant="headline" >
                HASH VALIDATION
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="headline" >
                {this.state.validation.hash ? <span style={validation.success}>PASS</span> : <span style={validation.error}>FAIL</span>}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <ReactJson
              src={this.state.validation.hashError}
              style={{ padding: "5px" }}
              theme="codeschool"
              indentWidth="2"
              collapsed="2"
              />
            </Grid>
          </Grid>
          <Grid container spacing={8}>
            <Grid item xs={6}>
              <Typography variant="headline" >
                SIGNATURE VALIDATION
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="headline" >
                {this.state.validation.signature? <span style={validation.success}>PASS</span> : <span style={validation.error}>FAIL</span> }
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <ReactJson
              src={this.state.validation.signatureError }
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

export default ExchangeOrderValidator;