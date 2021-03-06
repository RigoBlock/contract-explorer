import * as CONST from '../_utils/const'
import * as Drago from '../_utils/drago_utils'
import * as abis from '../abi'
// import { BigNumber } from '@0xproject/utils'
import { ZeroEx } from '0x.js'
import Divider from '@material-ui/core/Divider'
import EtherscanLink from '../elements/etherscanLink'
import ExchangeSelect from '../elements/exchangeSelect'
import FundSelect from '../elements/fundSelect'
import Grid from '@material-ui/core/Grid'
import LockUnlockActions from '../elements/lockUnlockActions'
import Paper from '@material-ui/core/Paper'
import PoweredMsg from '../elements/poweredMsg'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import ReactJson from 'react-json-view'
import ReactTimeout from 'react-timeout'
import RigoblockLink from '../elements/rigoblockLink'
import SetAllowanceButtons from '../elements/setAllowanceButtons'
import TokenAllowanceAddressFields from '../elements/tokenAllowanceAddressFields'
import TokenSelect from '../elements/tokenSelect'
import Typography from '@material-ui/core/Typography'
// import serializeError from 'serialize-error'

class ExchangeToolsPage extends Component {
  constructor(props, context) {
    super(props, context)
    const KOVAN_NETWORK_ID = 42
    const ZeroExConfig = {
      networkId: KOVAN_NETWORK_ID
      // exchangeContractAddress: this.state.fundProxyAddress
    }
    let zeroEx = new ZeroEx(context.web3.currentProvider, ZeroExConfig)
    const exchangeSelected =
      context.networkInfo.id === 3 ? 'Ethfinex' : 'RigoBlockZeroX'
    const tokensList =
      CONST.exchanges[context.networkInfo.id][exchangeSelected].tradedTokens[
        context.networkInfo.id
      ]
    let tokenSelected = typeof tokensList !== 'undefined' ? tokensList.GRG : {}
    tokenSelected.availableBalance = 0
    tokenSelected.wrappedBalance = 0
    const exchangeList = CONST.exchanges[context.networkInfo.id]
    this.state = {
      receipt: {},
      zeroEx: zeroEx,
      json_object: {},
      order: {},
      orderHash: '',
      signedOrderStatus: 'succeed',
      exchangeSelected,
      walletAddress: '',
      tokensList,
      tokenSelected: tokenSelected,
      tokenAllowanceAddress: '',
      tokenAllowanceAddressError: '',
      spenderAddress: '',
      spenderAddressAllowance: '',
      spenderAddressError: '',
      fundsList: [],
      fundSelected: {
        name: '',
        address: ''
      },
      exchangeList
    }
  }

  static contextTypes = {
    web3: PropTypes.object.isRequired,
    accounts: PropTypes.array.isRequired,
    networkInfo: PropTypes.object.isRequired
  }

  componentDidMount = async () => {
    const { accounts } = this.context
    const { fundSelected, tokenSelected } = this.state
    let fundSelectedUpdated = Object.assign(fundSelected)
    let address =
      fundSelectedUpdated.address === ''
        ? accounts[0]
        : fundSelectedUpdated.address
    await this.initFundSelect()
    let token = await this.getBalances(tokenSelected, address)
    this.setState(
      {
        tokenSelected: token
      },
      this.getBalancesTimer
    )
  }

  getBalancesTimer = () => {
    let that = this
    this._td = this.props.setTimeout(async function checkBalance() {
      const { tokenSelected, fundSelected } = that.state
      const { accounts } = that.context
      let fundSelectedUpdated = Object.assign(fundSelected)
      let address =
        fundSelectedUpdated.address === ''
          ? accounts[0]
          : fundSelectedUpdated.address
      let token = await that.getBalances(tokenSelected, address)
      that.setState({
        tokenSelected: token
      })
      that.props.setTimeout(checkBalance, 1000)
    }, 1000)
  }

  componentWillUnmount = () => {
    console.log(this._td)
  }

  getBalances = async (token, address) => {
    const { web3 } = this.context
    if (typeof token.wrappers !== 'undefined') {
      token.wrappedBalance = await Drago.getWrapperBalance(
        token.wrappers.Ethfinex.address,
        address,
        web3
      )
      token.availableBalance = await Drago.getTokenBalance(
        token.address,
        address,
        web3
      )
      token.lockTime = await Drago.getWrapperLockTime(
        token.wrappers.Ethfinex.address,
        address,
        web3
      )
      // console.log(token.address, token.availableBalance)
      // console.log(token.wrappers.Ethfinex.address, token.wrappedBalance)
      return token
    }
    return token
  }

  initFundSelect = async () => {
    const { accounts, networkInfo } = this.context
    const fundsAddresses = await Drago.getFundsAddresses(
      accounts[0],
      networkInfo.id
    )
    const fundsList = await Promise.all(
      fundsAddresses.map(fundAddress => {
        return Drago.getFundDetails(fundAddress, networkInfo.id)
      })
    )
    this.setState({
      fundsList
    })
  }

  onTokenAllowanceAddressFieldChange = async event => {
    const { web3 } = this.context
    const address = event.target.value.toLowerCase()
    if (web3.utils.isAddress(event.target.value)) {
      if (event.target.id === 'tokenAllowanceAddress') {
        this.setState(
          {
            tokenAllowanceAddress: address,
            tokenAllowanceAddressError: ''
          },
          this.checkAllowance
        )
      }
      if (event.target.id === 'spenderAddress') {
        this.setState(
          {
            spenderAddress: address,
            spenderAddressError: ''
          },
          this.checkAllowance
        )
      }
    } else {
      if (event.target.id === 'tokenAllowanceAddress') {
        this.setState(
          {
            tokenAllowanceAddress: address,
            tokenAllowanceAddressError: 'Please enter a valid address.'
          },
          this.checkAllowance
        )
      }
      if (event.target.id === 'spenderAddress') {
        this.setState(
          {
            spenderAddress: address,
            spenderAddressError: 'Please enter a valid address.'
          },
          this.checkAllowance
        )
      }
    }
  }

  checkAllowance = async () => {
    const { web3, accounts } = this.context
    const {
      tokenAllowanceAddress,
      spenderAddress,
      fundSelected,
      tokenSelected
    } = this.state
    const owner =
      fundSelected.address === '' ? accounts[0] : fundSelected.address
    console.log('check allowance')
    if (
      web3.utils.isAddress(tokenAllowanceAddress) &&
      web3.utils.isAddress(spenderAddress)
    ) {
      if (fundSelected.address === '') {
        const contractToken = await new web3.eth.Contract(
          abis.erc20,
          tokenAllowanceAddress
        )
        console.log(contractToken)
        let receipt = await contractToken.methods
          .allowance(owner, spenderAddress)
          .call()
        let decimals =
          typeof tokenSelected.decimals === 'undefined'
            ? await contractToken.methods.decimals().call()
            : tokenSelected.decimals
        console.log(receipt)
        console.log(Drago.toUnitAmount(receipt, decimals).toFixed())
        this.setState({
          spenderAddressAllowance: Drago.toUnitAmount(
            receipt,
            decimals
          ).toFixed()
        })
      }
    }
  }

  setAllowance = async () => {
    const { fundSelected, spenderAddress, tokenAllowanceAddress } = this.state
    const { web3 } = this.context
    console.log('setAllowance')
    if (fundSelected.address === '') {
      const contractToken = await new web3.eth.Contract(
        abis.erc20,
        tokenAllowanceAddress
      )
      console.log(contractToken)
      let options = {
        from: this.context.accounts[0]
      }
      this.showReceipt(
        await contractToken.methods
          .approve(
            spenderAddress,
            'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
          )
          .estimateGas(options)
          .then(gasEstimate => {
            console.log(gasEstimate)
            options.gas = gasEstimate
          })
          .then(() => {
            return contractToken.methods
              .approve(
                spenderAddress,
                'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
              )
              .send(options)
          })
      )
      this.checkAllowance()
    } else {
      // console.log('Setting allowance for the fund')
      // const options = {
      //   from: this.state.walletAddress
      // }
      // let web3 = new Web3(window.web3.currentProvider)
      // const dragoContract = new web3.eth.Contract(
      //   abis.drago,
      //   order.maker.toLowerCase()
      // )
      // console.log(
      //   `tokenTransferProxy: ${ZeroExConfig.tokenTransferProxyContractAddress}`
      // )
      // console.log(`TokenAddress: ${order.makerTokenAddress}`)
      // console.log(`Manager: ${this.state.walletAddress}`)
      // console.log(`Fund: ${order.maker}`)
      // dragoContract.methods
      //   .setInfiniteAllowance(
      //     ZeroExConfig.tokenTransferProxyContractAddress,
      //     order.makerTokenAddress
      //   )
      //   .estimateGas(options)
      //   .then(gasEstimate => {
      //     console.log(gasEstimate)
      //     options.gas = gasEstimate
      //   })
      //   .then(() => {
      //     dragoContract.methods
      //       .setInfiniteAllowance(
      //         ZeroExConfig.tokenTransferProxyContractAddress,
      //         order.makerTokenAddress
      //       )
      //       .send(options)
      //       .then(result => {
      //         console.log(result)
      //       })
      //   })
    }
  }

  removeAllowance = async () => {
    const { fundSelected, spenderAddress, tokenAllowanceAddress } = this.state
    const { web3 } = this.context
    if (fundSelected.address === '') {
      const contractToken = await new web3.eth.Contract(
        abis.erc20,
        tokenAllowanceAddress
      )
      console.log(contractToken)
      let options = {
        from: this.context.accounts[0]
      }
      this.showReceipt(
        await contractToken.methods
          .approve(spenderAddress, '0')
          .estimateGas(options)
          .then(gasEstimate => {
            console.log(gasEstimate)
            options.gas = gasEstimate
          })
          .then(() => {
            return contractToken.methods
              .approve(spenderAddress, '0')
              .send(options)
          })
      )
      this.checkAllowance()
    } else {
      // console.log('Setting allowance for the fund')
      // const options = {
      //   from: this.state.walletAddress
      // }
      // let web3 = new Web3(window.web3.currentProvider)
      // const dragoContract = new web3.eth.Contract(
      //   abis.drago,
      //   order.maker.toLowerCase()
      // )
      // console.log(
      //   `tokenTransferProxy: ${ZeroExConfig.tokenTransferProxyContractAddress}`
      // )
      // console.log(`TokenAddress: ${order.makerTokenAddress}`)
      // console.log(`Manager: ${this.state.walletAddress}`)
      // console.log(`Fund: ${order.maker}`)
      // dragoContract.methods
      //   .setInfiniteAllowance(
      //     ZeroExConfig.tokenTransferProxyContractAddress,
      //     order.makerTokenAddress
      //   )
      //   .estimateGas(options)
      //   .then(gasEstimate => {
      //     console.log(gasEstimate)
      //     options.gas = gasEstimate
      //   })
      //   .then(() => {
      //     dragoContract.methods
      //       .setInfiniteAllowance(
      //         ZeroExConfig.tokenTransferProxyContractAddress,
      //         order.makerTokenAddress
      //       )
      //       .send(options)
      //       .then(result => {
      //         console.log(result)
      //       })
      //   })
    }
  }

  onSetAllowance = async event => {
    if (event.target.id === 'setAllowance') {
      this.setAllowance()
    }
    if (event.target.id === 'removeAllowance') {
      this.removeAllowance()
    }
  }

  onExchangeSelect = exchangeSelected => {
    const exchange =
      CONST.exchanges[this.context.networkInfo.id][exchangeSelected]
    if (exchange.needAllowance) {
      this.setState({
        exchangeSelected
      })
    } else {
      const tokensList = exchange.tradedTokens[this.context.networkInfo.id]
      this.setState({
        exchangeSelected,
        tokensList,
        tokenSelected: tokensList.GRG
      })
    }
  }

  onTokenSelect = async event => {
    const { web3 } = this.context
    const { tokensList } = this.state
    const tokenSelected = Object.values(tokensList).find(token => {
      return token.symbol === event.target.value
    })

    // const contractWrapperToken = await new web3.eth.Contract(
    //   abis.wrapper,
    //   tokenSelected.wrappers.Ethfinex.address
    // )
    this.setState({
      tokenSelected,
      spenderAddress: '',
      spenderAddressError: ''
    })
    // this.getBalances({ ...tokenSelected }, fundSelected)
  }

  onFundSelect = async event => {
    const { fundsList } = this.state
    const fundSelected =
      event.target.value !== ''
        ? fundsList.find(fund => {
            return fund.address === event.target.value
          })
        : {
            name: '',
            address: ''
          }
    this.setState({
      fundSelected
    })
  }

  showReceipt = receipt => {
    console.log(receipt)
    this.setState({
      receipt
    })
  }

  render() {
    const paperStyle = {
      padding: 10
    }
    const { accounts } = this.context
    const {
      tokensList,
      tokenSelected,
      exchangeList,
      order,
      receipt,
      exchangeSelected,
      tokenAllowanceAddress,
      tokenAllowanceAddressError,
      fundsList,
      fundSelected,
      spenderAddress,
      spenderAddressError,
      spenderAddressAllowance
    } = this.state
    return (
      <Grid container spacing={8}>
        <Grid item xs={12}>
          <br />
          <Typography variant="h5">ALLOWANCE AND LOCK</Typography>
          <Paper style={paperStyle} elevation={2}>
            <Grid container spacing={8}>
              <Grid item xs={12}>
                <div className="text">
                  {fundsList.length === 0 &&
                    `You do not own any Rigoblock funds yet. Create your own at `}
                  {fundsList.length === 0 && <RigoblockLink />}

                  {fundsList.length !== 0 &&
                    `We have detected that you own ${
                      fundsList.length
                    } Rigoblock fund${(fundsList.length > 1 && 's') ||
                      ''}. Please select one if you want to manage it on this page.`}
                </div>
                <div className="text">Your Rigoblock funds:</div>
                <Paper style={paperStyle} elevation={2}>
                  <FundSelect
                    fundsList={fundsList}
                    onFundSelect={this.onFundSelect}
                    fundSelected={fundSelected}
                  />
                  <PoweredMsg />
                </Paper>
                <Grid item xs={12}>
                  <div className="text">Select an exchange:</div>
                  <Paper style={paperStyle} elevation={2}>
                    <ExchangeSelect
                      exchangeSelected={exchangeSelected}
                      onExchangeSelect={this.onExchangeSelect}
                      exchangesList={exchangeList}
                    />
                  </Paper>
                </Grid>
              </Grid>
            </Grid>
            <br />

            <Grid container spacing={8}>
              <Grid item xs={12} className="subheading">
                <Typography variant="subtitle1">
                  <span className="subheading-text">SET ALLOWANCE</span>
                </Typography>
                <Divider />
              </Grid>
              <Grid item xs={12}>
                {fundSelected.address === '' && (
                  <div>
                    Metamask Account: <EtherscanLink address={accounts[0]} />
                  </div>
                )}
                {fundSelected.address !== '' && (
                  <div>
                    Fund Account:{' '}
                    <EtherscanLink address={fundSelected.address} />
                  </div>
                )}
                <div>
                  Spender allowance: {spenderAddressAllowance}{' '}
                  {fundSelected.symbol}
                </div>
              </Grid>
              {fundSelected.address !== '' && (
                <Grid item xs={12}>
                  <div>Not available for funds.</div>
                </Grid>
              )}
              {fundSelected.address === '' && (
                <Grid container spacing={8}>
                  <Grid item xs={12}>
                    <Paper style={paperStyle} elevation={2}>
                      <TokenAllowanceAddressFields
                        tokenAllowanceAddress={tokenAllowanceAddress}
                        onTokenAllowanceAddressFieldChange={
                          this.onTokenAllowanceAddressFieldChange
                        }
                        disabled={false}
                        spenderAddress={spenderAddress}
                        spenderAddressError={spenderAddressError}
                        tokenAllowanceAddressError={tokenAllowanceAddressError}
                      />
                    </Paper>
                  </Grid>
                  <Grid item xs={12}>
                    <SetAllowanceButtons
                      onSetAllowance={this.onSetAllowance}
                      order={order}
                      disabled={
                        tokenAllowanceAddressError === '' &&
                        spenderAddressAllowance === ''
                      }
                    />
                  </Grid>
                </Grid>
              )}
            </Grid>

            <br />
            <br />
            <Grid item xs={12}>
              <Grid item xs={12} className="subheading">
                <Typography variant="subtitle1">
                  <span className="subheading-text">LOCK TOKENS</span>
                </Typography>
                <Divider />
              </Grid>
              {typeof tokensList !== 'undefined' && (
                <div>
                  <Grid item xs={12}>
                    <div className="text">
                      Make sure you have approve an allowance for the wrapper
                      token address.
                    </div>
                    <div className="text">Select a token.</div>
                    <TokenSelect
                      tokensList={Object.values(tokensList)}
                      onTokenSelect={this.onTokenSelect}
                      tokenSelected={tokenSelected}
                      disabled={exchangeList[exchangeSelected].needAllowance}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <LockUnlockActions
                      token={tokenSelected}
                      fund={fundSelected}
                      managerAddress={accounts[0]}
                      exchange={exchangeList[exchangeSelected]}
                      showReceipt={this.showReceipt}
                    />
                  </Grid>
                </div>
              )}

              <ReactJson
                src={receipt}
                style={{ padding: '5px' }}
                theme="codeschool"
                indentWidth="2"
                collapsed="2"
              />
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    )
  }
}

export default ReactTimeout(ExchangeToolsPage)
