import {
  SchemaValidator,
  // ValidatorResult,
  schemas
} from '@0xproject/json-schemas'
import { ZeroEx } from '0x.js'
import Button from '@material-ui/core/Button'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import PropTypes from 'prop-types'
import React from 'react'
import ReactJson from 'react-json-view'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import green from '@material-ui/core/colors/green'
import red from '@material-ui/core/colors/red'
import serializeError from 'serialize-error'

class ExchangeOrderValidator extends React.Component {
  constructor(props, context) {
    super(props)

    // const KOVAN_NETWORK_ID = 42
    // const ZeroExConfig = {
    //   networkId: KOVAN_NETWORK_ID
    //   // exchangeContractAddress: this.state.fundProxyAddress
    // }
    // Create a Web3 Provider Engine
    // const providerEngine = new Web3ProviderEngine();
    // providerEngine.addProvider(new InjectedWeb3Subprovider(window.web3.currentProvider));
    // providerEngine.addProvider(new RPCSubprovider({ rpcUrl: 'https://srv03.endpoint.network:8545' }));
    // providerEngine.start();
    // this.state = {
    //   zeroEx: zeroEx,
    //   orderError: false,
    //   validation: {
    //     schema: { valid: false, errors: {} },
    //     hash: false,
    //     hashError: {
    //       error: {}
    //     },
    //     signature: false,
    //     signatureError: {
    //       error: {}
    //     }
    //   },
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
    //   order: ''
    // }
    this.state = {
      orderError: true,
      validation: {
        schema: { valid: false, errors: {} },
        hash: false,
        hashError: {
          error: {}
        },
        signature: false,
        signatureError: {
          error: {}
        }
      },
      order: '',
      signerAddress: context.accounts[0].toLowerCase(),
      signerAddressError: ''
    }
  }

  static contextTypes = {
    web3: PropTypes.object.isRequired,
    accounts: PropTypes.array.isRequired,
    networkInfo: PropTypes.object.isRequired
  }

  componentDidMount = async () => {
    // const web3 =
    //   this.context.networkInfo.id === 3
    //     ? new Web3(new Web3.providers.WebsocketProvider(EP_INFURA_KV_WS))
    //     : new Web3(new Web3.providers.WebsocketProvider(EP_INFURA_RP_WS))
    const ZeroExConfig = {
      networkId: this.context.networkInfo.id
      // exchangeContractAddress: this.state.fundProxyAddress
    }
    let zeroEx = new ZeroEx(this.context.web3.currentProvider, ZeroExConfig)
    const accounts = await this.context.web3.eth.getAccounts()
    this.setState({
      zeroEx: zeroEx,
      account: accounts[0]
    })
  }

  onValidateOrder = () => {
    const { order } = this.state
    const { orderSchema } = schemas
    let validation = {
      schema: { valid: false, errors: {} },
      hash: false,
      hashError: {
        error: {}
      },
      signature: false,
      signatureError: {
        error: {}
      },
      orderErrorMsg: ''
    }
    const getOrderObject = () => {
      try {
        return JSON.parse(order)
      } catch (error) {
        return {}
      }
    }
    const validator = new SchemaValidator()
    const orderObject = getOrderObject()
    validation.schema = validator.validate(orderObject, orderSchema)

    const getHash = () => {
      try {
        const hash = ZeroEx.getOrderHashHex(orderObject)
        validation.hash = false
        return hash
      } catch (err) {
        console.warn(err)
        return ''
      }
    }
    const orderHash = getHash()

    const checkHash = () => {
      try {
        return ZeroEx.isValidOrderHash(orderHash)
      } catch (error) {
        console.warn(error)
        validation.hashError = serializeError(error)
        return false
      }
    }

    const checkSignature = () => {
      try {
        return ZeroEx.isValidSignature(
          orderHash,
          orderObject.ecSignature,
          // orderObject.maker
          this.state.signerAddress
        )
      } catch (error) {
        console.warn(error)
        validation.signatureError = serializeError(error)
        return false
      }
    }

    validation.hash = checkHash()
    validation.signature = checkSignature()

    this.setState({
      validation: validation
    })
  }

  onTextFieldChange = event => {
    try {
      JSON.parse(event.target.value)
      this.setState({
        order: event.target.value,
        orderError: true,
        orderErrorMsg: ''
      })
    } catch (err) {
      this.setState({
        orderError: false,
        orderErrorMsg:
          'Error: the text does not seem to conform to json format.'
      })
    }
  }

  onSignerAddressFieldChange = async event => {
    const { web3 } = this.context
    const address = event.target.value.toLowerCase()
    if (web3.utils.isAddress(event.target.value)) {
      if (event.target.id === 'signerAddress') {
        this.setState({
          signerAddress: address,
          signerAddressError: ''
        })
      }
    } else {
      if (event.target.id === 'signerAddress') {
        this.setState({
          signerAddress: address,
          signerAddressError: 'Please enter a valid address.'
        })
      }
    }
  }

  render() {
    const paperStyle = {
      padding: 10
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
          <Typography variant="headline">VALIDATOR</Typography>
          <Paper style={paperStyle} elevation={2}>
            <div style={{ color: '#F44336' }}>
              <b>{this.state.orderErrorMsg}</b>
            </div>
            <FormControl fullWidth={true} error={this.signerAddressError}>
              <TextField
                id="signerAddress"
                label="Signer address"
                InputLabelProps={{
                  shrink: true
                }}
                placeholder="Address"
                fullWidth
                onChange={this.onSignerAddressFieldChange}
                margin="normal"
                value={this.state.signerAddress}
              />
              <FormHelperText>{this.state.signerAddressError}</FormHelperText>
              <TextField
                id="order"
                key="order"
                label="Order"
                InputLabelProps={{
                  shrink: true
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
              <Button
                variant="raised"
                color="primary"
                onClick={this.onValidateOrder}
                // disabled={
                //   this.state.signerAddressError !== '' ||
                //   this.state.orderError !== ''
                // }
              >
                Validate
              </Button>
            </FormControl>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={8}>
            <Grid item xs={6}>
              <Typography variant="headline">SCHEMA VALIDATION</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="headline">
                {this.state.validation.schema.valid ? (
                  <span style={validation.success}>PASS</span>
                ) : (
                  <span style={validation.error}>FAIL</span>
                )}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <ReactJson
                src={this.state.validation.schema.errors}
                style={{ padding: '5px' }}
                theme="codeschool"
                indentWidth="2"
                collapsed="2"
              />
            </Grid>
          </Grid>
          <Grid container spacing={8}>
            <Grid item xs={6}>
              <Typography variant="headline">HASH VALIDATION</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="headline">
                {this.state.validation.hash ? (
                  <span style={validation.success}>PASS</span>
                ) : (
                  <span style={validation.error}>FAIL</span>
                )}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <ReactJson
                src={this.state.validation.hashError}
                style={{ padding: '5px' }}
                theme="codeschool"
                indentWidth="2"
                collapsed="2"
              />
            </Grid>
          </Grid>
          <Grid container spacing={8}>
            <Grid item xs={6}>
              <Typography variant="headline">SIGNATURE VALIDATION</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="headline">
                {this.state.validation.signature ? (
                  <span style={validation.success}>PASS</span>
                ) : (
                  <span style={validation.error}>FAIL</span>
                )}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <ReactJson
                src={this.state.validation.signatureError}
                style={{ padding: '5px' }}
                theme="codeschool"
                indentWidth="2"
                collapsed="2"
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    )
  }
}

export default ExchangeOrderValidator
