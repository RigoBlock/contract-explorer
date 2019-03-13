import { List } from 'immutable'
import ContractInputAddress from '../elements/contractInputAddress'
import ContractInputFields from '../elements/contractInputFields'
import Grid from '@material-ui/core/Grid'
import InOutMethodValues from '../elements/inOutMethodValues'
import JsonView from '../elements/jsonView'
import Loading from '../elements/loading'
import MethodSelect from '../elements/methodSelect'
import Paper from '@material-ui/core/Paper'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import Sticky from 'react-stickynode'
import Typography from '@material-ui/core/Typography'
import UploadButton from '../elements/uploadButton'
// import Web3 from 'web3';

class ContractPage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      abi: {},
      methodList: List([]),
      methodSelected: {},
      txError: '',
      json_object: {},
      // contractAddress: '0xE3B53367ab7F9a3A1F82A3dAAb20f78121d1BB12',
      contractAddress: '',
      gas: 0,
      enableContractAddressField: false,
      enableContractMethodsSelector: false,
      enableSubmit: false,
      loading: false,
      encodedABI: ''
    }
  }

  static contextTypes = { web3: PropTypes.object.isRequired }

  onSend = (inputs, value) => {
    const { contractAddress, methodSelected, abi } = this.state
    const { web3 } = this.context
    const methodName = methodSelected.name
    const constantMethod = methodSelected.constant ? 'call' : 'send'
    let accountAddress
    this.setState({
      loading: true
    })

    // Getting the account address from MetaMask. [0] is the currently selected account in MetaMask.
    // Everything is async.

    this.setState({
      loading: true
    })
    web3.eth
      .getAccounts()
      .then(accounts => {
        accountAddress = accounts[0]
      })
      .then(() => {
        // Initializing a contract instance.
        const contract = new web3.eth.Contract(abi, contractAddress)

        // Setting options.
        let options = {
          from: accountAddress,
          value: value
        }
        if (inputs.length === 0) {
          console.log('Without paramenters')
          // Calling estimateGas to calculate required gas for the transaction.
          contract.methods[methodName]()
            .estimateGas(options)
            .then(gasEstimate => {
              options.gas = gasEstimate
              this.setState({
                gas: gasEstimate
              })
            })
            .then(() => {
              // ******************************************************************
              //
              // Sending the transaction with:
              //
              // contract.myMethod.call(options) or contract.myMethod.send(options)
              //
              // ******************************************************************

              const encodedABI = () => {
                try {
                  const encodedABI = contract.methods[methodName]().encodeABI()
                  this.setState({
                    encodedABI
                  })
                } catch (error) {
                  console.warn(error)
                }
              }
              encodedABI()
              contract.methods[methodName]()[constantMethod](options)
                .then(result => {
                  this.setState({
                    json_object:
                      typeof result === 'object' ? result : { result },
                    loading: false
                  })
                })
                .catch(error => {
                  console.warn(error)
                  this.setState({
                    json_object: { error: String(error) },
                    loading: false
                  })
                })
            })
            .catch(error => {
              console.warn(error)
              this.setState({
                json_object: { error: String(error) },
                loading: false
              })
            })
        } else {
          // Calling estimateGas to calculate required gas for the transaction.
          console.log('With paramenters')
          contract.methods[methodName](...inputs)
            .estimateGas(options)
            .then(gasEstimate => {
              options.gas = gasEstimate
              this.setState({
                gas: gasEstimate
              })
            })
            .then(() => {
              // ******************************************************************
              //
              // Sending the transaction with:
              //
              // contract.myMethod.call(options) or contract.myMethod.send(options)
              //
              // ******************************************************************

              const encodedABI = () => {
                try {
                  const encodedABI = contract.methods[methodName](
                    ...inputs
                  ).encodeABI()
                  this.setState({
                    encodedABI
                  })
                } catch (error) {
                  console.warn(error)
                }
              }
              encodedABI()
              contract.methods[methodName](...inputs)[constantMethod](options)
                .then(result => {
                  this.setState({
                    json_object:
                      typeof result === 'object' ? result : { result },
                    loading: false
                  })
                })
                .catch(error => {
                  console.warn(error)
                  this.setState({
                    json_object: { error: String(error) },
                    loading: false
                  })
                })
            })
            .catch(error => {
              console.warn(error)
              this.setState({
                json_object: { error: String(error) },
                loading: false
              })
            })
        }
      })
  }

  onMethodSelect = event => {
    const { web3 } = this.context
    const methodSelected = this.state.abi.find(method => {
      return method.name === event.target.value
    })
    const methodSignature = web3.eth.abi.encodeFunctionSignature(methodSelected)
    this.setState({
      methodSelected: { ...methodSelected, methodSignature }
    })
  }

  onUpload = (file, text) => {
    const uploadedAbi = JSON.parse(text)
    this.setState({
      abi: uploadedAbi,
      methodList: List(uploadedAbi)
        .sortBy(method => method.name)
        .filter(method => method.type === 'function'),
      enableContractAddressField: true,
      enableContractMethodsSelector: true
    })
  }

  onChangeContractAddress = event => {
    const { web3 } = this.context
    const enableSubmit = web3.utils.isAddress(event.target.value)
    this.setState({
      contractAddress: event.target.value.toLowerCase(),
      enableSubmit
    })
  }

  onNewBlockNumber = (_error, blockNumber) => {}

  render() {
    const containerWrapperStyle = {
      paddingRight: 5,
      paddingLeft: 5
    }

    const containerGroupWrapperStyle = {
      paddingBottom: 15
    }

    const paperStyle = {
      padding: 10,
      width: '100%'
    }

    return (
      <Grid container spacing={8} style={containerWrapperStyle}>
        <Grid item xs={4}>
          <Grid container spacing={8} style={containerGroupWrapperStyle}>
            <Grid item xs={12}>
              <Typography variant="h5">CONTRACT</Typography>
            </Grid>
            <Grid item xs={12}>
              <Paper style={paperStyle} elevation={2}>
                <Grid item xs={12}>
                  <UploadButton onUpload={this.onUpload} />
                </Grid>
                <Grid item xs={12}>
                  <ContractInputAddress
                    onChangeContractAddress={this.onChangeContractAddress}
                    contractAddress={this.state.contractAddress}
                    enableContractAddressField={
                      this.state.enableContractAddressField
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <MethodSelect
                    methodList={this.state.methodList}
                    onMethodSelect={this.onMethodSelect}
                    disabled={!this.state.enableContractMethodsSelector}
                  />
                </Grid>
              </Paper>
            </Grid>
          </Grid>
          <Grid container spacing={8} style={containerGroupWrapperStyle}>
            <Grid item xs={12}>
              <Typography variant="h5">VARIABLES</Typography>
            </Grid>
            <Grid item xs={12}>
              <InOutMethodValues methodSelected={this.state.methodSelected} />
            </Grid>
          </Grid>
          <Grid container spacing={8} style={containerGroupWrapperStyle}>
            <Grid item xs={12}>
              <Typography variant="h5">CALL</Typography>
            </Grid>
            <Grid item xs={12}>
              <ContractInputFields
                methodSelected={this.state.methodSelected}
                onSend={this.onSend}
                enableSubmit={this.state.enableSubmit}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={8}>
          <Sticky>
            <Grid container spacing={8} style={containerGroupWrapperStyle}>
              <Grid item xs={12}>
                <Typography variant="h5">LOG</Typography>
              </Grid>
              <Grid item xs={12}>
                <Paper style={paperStyle} elevation={2}>
                  <Typography variant="subtitle1">
                    Encoded ABI: {this.state.encodedABI}
                  </Typography>
                  <Typography variant="subtitle1">
                    Function Signature: {this.state.encodedABI.substring(0, 10)}
                  </Typography>
                  <Typography variant="subtitle1">
                    Encoded Parameters: {this.state.encodedABI.substring(10)}
                  </Typography>
                  <Typography variant="subtitle1">
                    Gas used: {this.state.gas}
                  </Typography>
                  <Typography variant="subtitle1">
                    Transaction receipt:
                  </Typography>
                  {this.state.loading ? (
                    <Loading />
                  ) : (
                    <JsonView json_object={[this.state.json_object]} />
                  )}
                </Paper>
              </Grid>
            </Grid>
          </Sticky>
        </Grid>
      </Grid>
    )
  }
}

export default ContractPage
