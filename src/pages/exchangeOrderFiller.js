import * as CONST from '../_utils/const'
import Button from '@material-ui/core/Button'
import FormControl from '@material-ui/core/FormControl'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import PropTypes from 'prop-types'
import React from 'react'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Web3 from 'web3'
import * as abis from '../abi/index'
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
import { Web3Wrapper } from '@0x/web3-wrapper';
import ExchangeSelect from '../elements/exchangeSelect'
import FormHelperText from '@material-ui/core/FormHelperText'
import ReactJson from 'react-json-view'
import serializeError from 'serialize-error'

class ExchangeOrderFiller extends React.Component {
  constructor(props, context) {
    super(props)
    const exchangeSelected =
      context.networkInfo.id === 3 ? 'Ethfinex' : 'RigoBlockZeroX'
    const exchangeList = CONST.exchanges[context.networkInfo.id]
    this.state = {
      encodedABI: '',
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
        amount: '0'
      },
      submitDisabled: false,
      exchangeSelected,

      exchangeList,
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

      // order: JSON.parse(
      //   `
      //   {
      //     "1":
      //     {
      //               "maker": "0xd360bbb7378725eac80a474572feab371ce4b1af",
      //               "taker": "0xc8dcd42e846466f2d2b89f3c54eba37bf738019b",
      //               "feeRecipient": "0x0000000000000000000000000000000000000000",
      //               "makerTokenAddress": "0xacfb4c79259e3c2c1bf054f136e6d75f7cc2b07e",
      //               "takerTokenAddress": "0x06da2eb72279c1cec53c251bbff4a06fbfb93a5b",
      //               "exchangeContractAddress": "0x1d8643aae25841322ecde826862a9fa922770981",
      //               "salt": "78551182682082289430573751485157061720818368934730421220886586745741004890569",
      //               "makerFee": "0",
      //               "takerFee": "0",
      //               "makerTokenAmount": "1000000",
      //               "takerTokenAmount": "1000000",
      //               "expirationUnixTimestampSec": "1567770569594",
      //               "ecSignature": {
      //                   "v": 27,
      //                   "r": "0x6775d02f24d02d9a1840914fd0268d9aac6db32de9aa3ea545e623158256fc55",
      //                   "s": "0x563d12c99f4c2bf112d75d5a527dac1d2276c707835d971cef7eb5bb55aab1ea"
      //               }
      //           },
      //     "2":
      //     {
      //       "maker": "0x7a6fa54703f080acc2ad4d905cad50b8d3926f4a",
      //       "taker": "0xc8dcd42e846466f2d2b89f3c54eba37bf738019b",
      //       "feeRecipient": "0x0000000000000000000000000000000000000000",
      //       "makerTokenAddress": "0xacfb4c79259e3c2c1bf054f136e6d75f7cc2b07e",
      //       "takerTokenAddress": "0x06da2eb72279c1cec53c251bbff4a06fbfb93a5b",
      //       "exchangeContractAddress": "0x1d8643aae25841322ecde826862a9fa922770981",
      //       "salt": "44749246181515940832569813107143600212651671413056895996036477486520112609913",
      //       "makerFee": "0",
      //       "takerFee": "0",
      //       "makerTokenAmount": "1000000",
      //       "takerTokenAmount": "1000000",
      //       "expirationUnixTimestampSec": "1567772873360",
      //       "ecSignature": {
      //         "v": 27,
      //         "r": "0x489f1f63a4150f3e4e89edd776393eaf9102a821b7b20eddaff551e867f8e0e4",
      //         "s": "0x51f7293e72855a4a156cd9209a360c6d07573a79ee0d0bfcfba0b77c1b92d2f2"
      //       }
      //     }
      //     }
      //   `
      // ),
      filledAmount: '0'
      // order:
      // `
      // {"maker":"0xec4ee1bcf8107480815b08b530e0ead75b9f804f","taker":"0x0000000000000000000000000000000000000000","makerFee":"0","takerFee":"0","makerTokenAmount":"10000000000000000","takerTokenAmount":"10000000000000000","makerTokenAddress":"0xd0a1e359811322d97991e03f863a0c30c2cf029c","takerTokenAddress":"0x6ff6c0ff1d68b964901f986d4c9fa3ac68346570","expirationUnixTimestampSec":"2524608000","feeRecipient":"0x0000000000000000000000000000000000000000","salt":"42915409420279271885015915205547393322324115969244938610857696117752690836404","ecSignature":{"v":27,"r":"0xa28fb15b28bebdf29c89593fe2e1bd999d5ab416622a6f4157b041b27e7fcab0","s":"0x51ae5e4c276e60b429ecc31da788840e5e1f24a6e260d0fb62c952e4968496a9"},"exchangeContractAddress":"0x90fe2af704b34e0224bf2299c838e04d4dcf1364"}
      // `,
      // order: ''
    }
  }

  static contextTypes = {
    web3: PropTypes.object.isRequired,
    accounts: PropTypes.array.isRequired,
    networkInfo: PropTypes.object.isRequired
  }

  componentDidMount() {
    const KOVAN_NETWORK_ID = 42
    const ZeroExConfig = {
      ...this.state.exchangeList[this.state.exchangeSelected]
    }
    /*
    const ZeroExConfig = {
      networkId: KOVAN_NETWORK_ID
    }
    */
    const walletAddress = '0x0000000000000000000000000000000000000000' // mock address

    /*const contractWrappers = new ContractWrappers(window.web3.provider, ZeroExConfig, { networkId: KOVAN_NETWORK_ID }); // networkId: NETWORK_CONFIGS.networkId
    // Initialize the Web3Wrapper, this provides helper functions around fetching
    // account information, balances, general contract logs
    const web3Wrapper = new Web3Wrapper(window.web3.provider, ZeroExConfig);
    //const [maker, taker, sender] = await web3Wrapper.getAvailableAddressesAsync();
    const [maker, taker, sender] = await web3Wrapper.getAvailableAddressesAsync();
    this.setState({
      walletAddress: result[0]
    })
    */
  }

  onFillOrder = async () => {
    const DECIMALS = 18
    const { order } = this.state

    // 1
    //
    // 0x LIBRARY
    //

    // const shouldThrowOnInsufficientBalanceOrAllowance = true
    // const orderToFill = {
    //   maker: order.maker.toLowerCase(),
    //   taker: order.taker.toLowerCase(),
    //   feeRecipient: order.feeRecipient.toLowerCase(),
    //   makerTokenAddress: order.makerTokenAddress.toLowerCase(),
    //   takerTokenAddress: order.takerTokenAddress.toLowerCase(),
    //   exchangeContractAddress: order.exchangeContractAddress.toLowerCase(),
    //   salt: order.salt,
    //   makerFee: new BigNumber(order.makerFee),
    //   takerFee: new BigNumber(order.takerFee),
    //   makerTokenAmount: new BigNumber(order.makerTokenAmount),
    //   takerTokenAmount: new BigNumber(order.takerTokenAmount),
    //   expirationUnixTimestampSec: new BigNumber(
    //     order.expirationUnixTimestampSec
    //   ),
    //   ecSignature: order.ecSignature
    // }

    // console.log(orderToFill)
    // const takerAddress = this.context.accounts[0]
    // console.log(this.context.accounts[0])
    // const fillTakerTokenAmount = ZeroEx.toBaseUnitAmount(
    //   new BigNumber(this.state.filledAmount),
    //   DECIMALS
    // )
    // const ZeroExConfig = {
    //   networkId: 42
    // }
    // console.log(ZeroExConfig)
    // let web3 = new Web3(window.web3.currentProvider)
    // let zeroEx = new ZeroEx(web3.currentProvider, ZeroExConfig)
    // console.log(
    //   orderToFill,
    //   fillTakerTokenAmount,
    //   shouldThrowOnInsufficientBalanceOrAllowance,
    //   takerAddress
    // )
    // const txHash = await zeroEx.exchange
    //   .fillOrderAsync(
    //     orderToFill,
    //     fillTakerTokenAmount,
    //     shouldThrowOnInsufficientBalanceOrAllowance,
    //     takerAddress,
    //     {
    //       shouldValidate: true
    //     }
    //   )
    //   .catch(error => {
    //     this.setState({
    //       txReceipt: serializeError(error)
    //     })
    //     return serializeError(error)
    //   })
    // const txReceipt = await zeroEx.awaitTransactionMinedAsync(txHash)
    // this.setState({
    //   txReceipt: txReceipt
    // })
    // console.log('FillOrder transaction receipt: ', txReceipt)

    // 2
    //
    // WEB3
    //

    const ZeroExConfig = {
      ...this.state.exchangeList[this.state.exchangeSelected]
    }
    const options = {
      from: this.context.accounts[0]
    }
    let web3 = new Web3(window.web3.currentProvider)
    console.log(`Exchange address: ${ZeroExConfig.exchangeContractAddress}`)
    const exchangeContract = new web3.eth.Contract(
      abis.rigoBlockExchange,
      ZeroExConfig.exchangeContractAddress
    )
    console.log(exchangeContract)
    const orderAddresses = [
      order.maker,
      order.taker,
      order.makerTokenAddress,
      order.takerTokenAddress,
      order.feeRecipient
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
    const shouldThrowOnInsufficientBalanceOrAllowance = true
    console.log(
      orderAddresses,
      orderValues,
      Web3Wrapper.toBaseUnitAmount(
        new BigNumber(this.state.filledAmount),
        DECIMALS
      ).toString(),
      shouldThrowOnInsufficientBalanceOrAllowance,
      v,
      r,
      s
    )

    // 3
    //
    // WEB3 RAW
    //

    // console.log(
    //   ZeroEx.toBaseUnitAmount(
    //     new BigNumber(this.state.filledAmount),
    //     DECIMALS
    //   ).toString()
    // )
    // const encodedABI = exchangeContract.methods
    //   .fillOrder(
    //     orderAddresses,
    //     orderValues,
    //     1000000,
    //     shouldThrowOnInsufficientBalanceOrAllowance,
    //     v,
    //     r,
    //     s
    //   )
    //   .encodeABI()

    // this.setState({
    //   encodedABI
    // })

    // console.log(encodedABI)

    // const transactionObject = {
    //   from: this.state.walletAddress,
    //   to: ZeroExConfig.exchangeContractAddress,
    //   data: encodedABI
    // }
    // web3.eth
    //   .estimateGas(transactionObject)
    //   .then(gasEstimate => {
    //     console.log(gasEstimate)
    //     transactionObject.gas = gasEstimate
    //   })
    //   .then(() => {
    //     web3.eth.sendTransaction(transactionObject).then(result => {
    //       console.log(result)
    //     })
    //   })
    //   .catch(error => {
    //     console.warn(error)
    //     console.log('Error sending encoded transaction')
    //     this.setState({
    //       txReceipt: serializeError(error)
    //     })
    //   })

    // 4
    //
    // WEB3 NORMAL
    //

    exchangeContract.methods
      .fillOrder(
        orderAddresses,
        orderValues,
        Web3Wrapper.toBaseUnitAmount(
          new BigNumber(this.state.filledAmount),
          DECIMALS
        ),
        shouldThrowOnInsufficientBalanceOrAllowance,
        v,
        r,
        s
      )
      .estimateGas(options)
      .then(gasEstimate => {
        console.log(gasEstimate)
        // options.gas = '600000'
      })
      .then(() => {
        exchangeContract.methods
          .fillOrder(
            orderAddresses,
            orderValues,
            Web3Wrapper.toBaseUnitAmount(
              new BigNumber(this.state.filledAmount),
              DECIMALS
            ),
            shouldThrowOnInsufficientBalanceOrAllowance,
            v,
            r,
            s
          )
          .send(options)
          .then(result => {
            console.log(result)
          })
      })
      .catch(error => {
        console.warn(error)
        this.setState({
          txReceipt: serializeError(error)
        })
      })
  }

  onBatchFillOrder = async () => {
    const DECIMALS = 18
    const { order } = this.state
    console.log(order)
    const orderArray = Object.values(order)
    // 1
    //
    // 0x LIBRARY
    //

    // const shouldThrowOnInsufficientBalanceOrAllowance = true
    // const orderToFill = {
    //   maker: order.maker.toLowerCase(),
    //   taker: order.taker.toLowerCase(),
    //   feeRecipient: order.feeRecipient.toLowerCase(),
    //   makerTokenAddress: order.makerTokenAddress.toLowerCase(),
    //   takerTokenAddress: order.takerTokenAddress.toLowerCase(),
    //   exchangeContractAddress: order.exchangeContractAddress.toLowerCase(),
    //   salt: order.salt,
    //   makerFee: new BigNumber(order.makerFee),
    //   takerFee: new BigNumber(order.takerFee),
    //   makerTokenAmount: new BigNumber(order.makerTokenAmount),
    //   takerTokenAmount: new BigNumber(order.takerTokenAmount),
    //   expirationUnixTimestampSec: new BigNumber(
    //     order.expirationUnixTimestampSec
    //   ),
    //   ecSignature: order.ecSignature
    // }

    // console.log(orderToFill)
    // const takerAddress = this.context.accounts[0]
    // console.log(this.context.accounts[0])
    // const fillTakerTokenAmount = ZeroEx.toBaseUnitAmount(
    //   new BigNumber(this.state.filledAmount),
    //   DECIMALS
    // )
    // const ZeroExConfig = {
    //   networkId: 42
    // }
    // console.log(ZeroExConfig)
    // let web3 = new Web3(window.web3.currentProvider)
    // let zeroEx = new ZeroEx(web3.currentProvider, ZeroExConfig)
    // console.log(
    //   orderToFill,
    //   fillTakerTokenAmount,
    //   shouldThrowOnInsufficientBalanceOrAllowance,
    //   takerAddress
    // )
    // const txHash = await zeroEx.exchange
    //   .fillOrderAsync(
    //     orderToFill,
    //     fillTakerTokenAmount,
    //     shouldThrowOnInsufficientBalanceOrAllowance,
    //     takerAddress,
    //     {
    //       shouldValidate: true
    //     }
    //   )
    //   .catch(error => {
    //     this.setState({
    //       txReceipt: serializeError(error)
    //     })
    //     return serializeError(error)
    //   })
    // const txReceipt = await zeroEx.awaitTransactionMinedAsync(txHash)
    // this.setState({
    //   txReceipt: txReceipt
    // })
    // console.log('FillOrder transaction receipt: ', txReceipt)

    // 2
    //
    // WEB3
    //

    const ZeroExConfig = {
      ...this.state.exchangeList[this.state.exchangeSelected]
    }
    const options = {
      from: this.context.accounts[0]
    }
    let web3 = new Web3(window.web3.currentProvider)
    console.log(`Exchange address: ${ZeroExConfig.exchangeContractAddress}`)
    const exchangeContract = new web3.eth.Contract(
      abis.rigoBlockExchange,
      ZeroExConfig.exchangeContractAddress
    )

    const addresses = orderArray.map(order => {
      return [
        order.maker,
        order.taker,
        order.makerTokenAddress,
        order.takerTokenAddress,
        order.feeRecipient
      ]
    })

    const values = orderArray.map(order => {
      return [
        order.makerTokenAmount,
        order.takerTokenAmount,
        order.makerFee,
        order.takerFee,
        order.expirationUnixTimestampSec,
        order.salt
      ]
    })

    const vArray = orderArray.map(order => {
      return order.ecSignature.v
    })

    const rArray = orderArray.map(order => {
      return order.ecSignature.r
    })

    const sArray = orderArray.map(order => {
      return order.ecSignature.s
    })

    const amount = Web3Wrapper.toBaseUnitAmount(
      new BigNumber(this.state.filledAmount),
      DECIMALS
    ).toString()

    const fillTakerTokenAmounts = [amount, amount]

    const shouldThrowOnInsufficientBalanceOrAllowance = true

    console.log(exchangeContract)

    console.log(
      addresses,
      values,
      fillTakerTokenAmounts,
      shouldThrowOnInsufficientBalanceOrAllowance,
      vArray,
      rArray,
      sArray
    )

    // 3
    //
    // WEB3 RAW
    //

    // console.log(
    //   ZeroEx.toBaseUnitAmount(
    //     new BigNumber(this.state.filledAmount),
    //     DECIMALS
    //   ).toString()
    // )
    // const encodedABI = exchangeContract.methods
    //   .fillOrder(
    //     orderAddresses,
    //     orderValues,
    //     1000000,
    //     shouldThrowOnInsufficientBalanceOrAllowance,
    //     v,
    //     r,
    //     s
    //   )
    //   .encodeABI()

    // this.setState({
    //   encodedABI
    // })

    // console.log(encodedABI)

    // const transactionObject = {
    //   from: this.state.walletAddress,
    //   to: ZeroExConfig.exchangeContractAddress,
    //   data: encodedABI
    // }
    // web3.eth
    //   .estimateGas(transactionObject)
    //   .then(gasEstimate => {
    //     console.log(gasEstimate)
    //     transactionObject.gas = gasEstimate
    //   })
    //   .then(() => {
    //     web3.eth.sendTransaction(transactionObject).then(result => {
    //       console.log(result)
    //     })
    //   })
    //   .catch(error => {
    //     console.warn(error)
    //     console.log('Error sending encoded transaction')
    //     this.setState({
    //       txReceipt: serializeError(error)
    //     })
    //   })

    // 4
    //
    // WEB3 NORMAL
    //

    exchangeContract.methods
      .batchFillOrders(
        addresses,
        values,
        fillTakerTokenAmounts,
        shouldThrowOnInsufficientBalanceOrAllowance,
        vArray,
        rArray,
        sArray
      )
      .estimateGas(options)
      .then(gasEstimate => {
        console.log(gasEstimate)
        // options.gas = '600000'
      })
      .then(() => {
        exchangeContract.methods
          .batchFillOrders(
            addresses,
            values,
            fillTakerTokenAmounts,
            shouldThrowOnInsufficientBalanceOrAllowance,
            vArray,
            rArray,
            sArray
          )
          .send(options)
          .then(result => {
            console.log(result)
          })
      })
      .catch(error => {
        console.warn(error)
        this.setState({
          txReceipt: serializeError(error)
        })
      })
  }

  onAmountChange = event => {
    try {
      let amount = new BigNumber(event.target.value).greaterThan(0)
      this.setState({
        submitDisabled: !amount
      })
    } catch (error) {
      this.setState({
        submitDisabled: true
      })
    }
    this.setState({
      filledAmount: event.target.value
    })
  }

  onExchangeSelect = exchangeSelected => {
    this.setState({
      exchangeSelected
    })
  }

  onTextFieldChange = event => {
    try {
      const parsedOrder = JSON.parse(event.target.value)
      this.setState({
        order: parsedOrder,
        orderError: true
      })
    } catch (err) {
      this.setState({
        orderError: false
      })
    }
  }

  render() {
    const paperStyle = {
      padding: 10
    }
    return (
      <Grid container spacing={8}>
        <Grid item xs={12}>
          <br />
          <Typography variant="h5">FILLER</Typography>
          <Paper style={paperStyle} elevation={2}>
            <div>
              A single order or an array of orders. Input is parsed with&nbsp;
              <a
                href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse"
                target="_blank"
                rel="noopener noreferrer"
              >
                JSON.parse()
              </a>
            </div>
            <FormControl fullWidth={true} error={this.error}>
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
                  shrink: true
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
            <ExchangeSelect
              exchangeSelected={this.state.exchangeSelected}
              onExchangeSelect={this.onExchangeSelect}
              exchangesList={this.state.exchangeList}
            />
            <br />
            <br />
            <FormControl fullWidth={true}>
              <Button
                variant="contained"
                color="primary"
                onClick={this.onFillOrder}
                disabled={this.state.submitDisabled}
              >
                SUBMIT
              </Button>
              <br />
              <Button
                variant="contained"
                color="primary"
                onClick={this.onBatchFillOrder}
                disabled={this.state.submitDisabled}
              >
                SUBMIT BATCH
              </Button>
            </FormControl>
            <br />
            <br />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={8}>
            <Grid item xs={12}>
              <Typography variant="h5">ENCODED ABI</Typography>
            </Grid>
            <Grid item xs={12}>
              <div style={{ wordWrap: 'break-word' }}>
                {this.state.encodedABI}
              </div>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={8}>
            <Grid item xs={12}>
              <Typography variant="h5">RECEIPT</Typography>
            </Grid>
            <Grid item xs={12}>
              <ReactJson
                src={this.state.txReceipt}
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

export default ExchangeOrderFiller
