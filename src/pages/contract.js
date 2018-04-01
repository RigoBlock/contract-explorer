import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';

import ReactJson from 'react-json-view'
import { drago } from '../abi'
import MethodSelect from '../elements/methodSelect'
import InOutMethodValues from '../elements/inOutMethodValues'
import ContractInputFields from '../elements/contractInputFields'
import { List } from 'immutable';
import Paper from 'material-ui/Paper';
import UploadButton from '../elements/uploadButton'
import ContractInputAddress from '../elements/contractInputAddress'
// import Web3 from 'web3';


class ContractPage extends Component {

  constructor(props) {
    super(props)

    this.state = {
      abi: List(drago).sortBy(method => method.name).filter(method => method.type === 'function' ),
      methodSelected: {},
      txHash: '0x1a42f43c8f46e99faeb4a3c9e6d155d101da2106ef7dcc49ef2f874b058e3c5f',
      txError: '',
      json_object: {},
      contractAddress: '0x36c3057Ce3de417677cFDFE918F77Bf075cDBe22',
      gas: 0,
      uploadedAbi: {},
      enableContractAddressField: false,
      enableContractMethodsSelector: false,
    };
  }
  
  
  static contextTypes = {web3: PropTypes.object.isRequired};

  onSend = (inputs, value) => {
    const { contractAddress, methodSelected } = this.state
    const { web3 } = this.context
    const methodName = methodSelected.name
    var accountAddress

    // Getting the account address from MetaMask. [0] is the currently selected account in MetaMask.
    // Everything is async.

    web3.eth.getAccounts()
      .then((accounts) => {
        accountAddress = accounts[0]
      })
      .then(() => {
        // Initializing a contract instance.
        const contract = new web3.eth.Contract(drago, contractAddress)

        // Setting options.
        var options = {
          from: accountAddress,
          value: "100000000000000000"
        }
        if (inputs.length === 0) {
          // Calling estimateGas to calculate required gas for the transaction.
          contract.methods[methodName]().estimateGas(options)
            .then(gasEstimate => {
              options.gas = gasEstimate
              this.setState({
                gas: gasEstimate
              })
            }
            )
            .then(() => {
              // Sending the transaction
              contract.methods[methodName]()
                .send(options)
                .then(result => {
                  this.setState({
                    json_object: result
                  })
                })
                .catch(error => {
                  console.log(error)
                  this.setState({
                    json_object: { error: String(error) }
                  })
                })
            })
            .catch(error => {
              console.log(error)
              this.setState({
                json_object: { error: String(error) }
              })
            })
        } else {
          // Calling estimateGas to calculate required gas for the transaction.
          contract.methods[methodName](inputs).estimateGas(options)
            .then(gasEstimate => {
              console.log(gasEstimate)
              options.gas = gasEstimate
              this.setState({
                gas: gasEstimate
              })
            }
            )
            .then(() => {
              // Sending the transacation
              contract.methods[methodName](inputs)
                .send(options)
                .then(result => {
                  this.setState({
                    json_object: result
                  })
                })
                .catch(error => {
                  console.log(error)
                  this.setState({
                    json_object: { error: String(error) }
                  })
                })
            })
            .catch(error => {
              console.log(error)
              this.setState({
                json_object: { error: String(error) }
              })
            })
        }
      })
  }

  onMethodSelect = event => {
    console.log(event.target.value)
    const methodSelected = this.state.abi.find(method => {
      return method.name === event.target.value
    })
    console.log(methodSelected)
    this.setState({
      methodSelected: methodSelected
    });
  };

  onUpload = (file, text) =>{
    const uploadedAbi = JSON.parse(text)
    this.setState({
      uploadedAbi,
      enableContractAddressField: true,
      enableContractMethodsSelector: true,
    })
  }
  
  onChangeContractAddress = event => {
    this.setState({
      contractAddress: event.target.value,
    });
  };

  onNewBlockNumber = (_error, blockNumber) => {
    console.log(blockNumber)
  }

  render() {
    const containerWrapperStyle = {
      paddingRight: 5,
      paddingLeft: 5,
    }

    const containerGroupWrapperStyle = {
      paddingBottom: 15,
    }

    const paperStyle = {
      padding: 10,
      width: "100%"
    }

    return (
      <Grid container spacing={8} style={containerWrapperStyle}>
        <Grid item xs={4}>
          <Grid container spacing={8} style={containerGroupWrapperStyle}>
            <Grid item xs={12}>
              <Typography variant="headline" >
                CONTRACT
              </Typography>
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
                    enableContractAddressField={this.state.enableContractAddressField}
                  />
                </Grid>
                <Grid item xs={12}>
                  <MethodSelect
                    abi={this.state.abi}
                    onMethodSelect={this.onMethodSelect}
                    disabled={!this.state.enableContractMethodsSelector}
                  />
                </Grid>
              </Paper>
            </Grid>
          </Grid>
          <Grid container spacing={8} style={containerGroupWrapperStyle}>
            <Grid item xs={12}>
              <Typography variant="headline" >
                VARIABLES
            </Typography>
            </Grid>
            <Grid item xs={12}>
              <InOutMethodValues
                methodSelected={this.state.methodSelected}
              />
            </Grid>
          </Grid>
          <Grid container spacing={8} style={containerGroupWrapperStyle}>
            <Grid item xs={12}>
              <Typography variant="headline">
                CALL
            </Typography>
            </Grid>
            <Grid item xs={12}>
              <ContractInputFields
                methodSelected={this.state.methodSelected}
                onSend={this.onSend}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={8}>
          <Grid container spacing={8} style={containerGroupWrapperStyle}>
            <Grid item xs={12}>
              <Typography variant="headline">
                LOG
                </Typography>
            </Grid>
            <Grid item xs={12}>
              <Paper style={paperStyle} elevation={2}>
                <Typography variant="subheading">
                  Gas used: {this.state.gas}
                </Typography>
                <Typography variant="subheading">
                  Transaction receipt:
                  </Typography>
                <ReactJson
                  src={this.state.json_object}
                  style={{ padding: "5px" }}
                  theme="codeschool"
                  indentWidth="2"
                  collapsed="2"
                />
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export default ContractPage;