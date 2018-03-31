import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Typography from 'material-ui/Typography';
import TextField from 'material-ui/TextField';
import Grid from 'material-ui/Grid';
import TopBar from '../elements/topBar'
import ReactJson from 'react-json-view'
import { drago } from '../abi'
import MethodSelect from '../elements/methodSelect'
import InOutValues from '../elements/inOutValues'
import ContractInputFields from '../elements/contractInputFields'
import { List } from 'immutable';
import Paper from 'material-ui/Paper';
import UploadButton from '../elements/uploadButton'
import ContractInputAddress from '../elements/contractInputAddress'


class HomePage extends Component {

  constructor(props) {
    super(props)
    this.state = {
      abi: List(drago).sortBy(method => method.name).filterNot(method => typeof method.name === 'undefined' ),
      methodSelected: {},
      txHash: '0x1a42f43c8f46e99faeb4a3c9e6d155d101da2106ef7dcc49ef2f874b058e3c5f',
      txError: '',
      json_object: {},
      contractAddress: "0x36c3057Ce3de417677cFDFE918F77Bf075cDBe22",
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

    // Getting the account address from MetaMask. [0] is the currently selected account in MetaMask.
    const accountAddress = web3.eth.accounts[0]

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
    .then (() =>{
      // Sending the transacation
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
          json_object: {error: String(error)}
        })
    })
    })
    .catch(error => {
        console.log(error)
        this.setState({
          json_object: {error: String(error)}
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
    .then (() =>{
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
          json_object: {error: String(error)}
        })
    })
    })
    .catch(error => {
        console.log(error)
        this.setState({
          json_object: {error: String(error)}
        })
    })
  }
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
  
  handleClick = () => {
    console.log(this.context.web3)
    console.log(this.state.txHash)
    this.context.web3.eth.getTransactionReceipt(this.state.txHash)
    .then(receipt =>{
      console.log(receipt)
      this.setState({
        json_object: receipt
      })
    })
    .catch (error =>{
      console.log(error)
      this.setState({
        txError: "Error: Returned error"
      })
    })
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  onChangeContractAddress = event => {
    this.setState({
      contractAddress: event.target.value,
    });
  };

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

    console.log(this.state.abi)
    console.log(this.state.methodSelected)
    return (
      <div>
        <Grid container spacing={8} >
          <Grid item xs={12}>
            <TopBar></TopBar>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={8} style={containerWrapperStyle}>
              <Grid item xs={4}>
                {/* <Grid item xs={12}>
                  <Typography variant="headline" gutterBottom>
                    Get transaction
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    id="txHash"
                    label="Tx Hash"
                    value={this.state.txHash}
                    onChange={this.handleChange('txHash')}
                    margin="normal"
                    fullWidth={true}
                    helperText={this.state.txError}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button variant="raised" color="primary" onClick={this.handleClick}>
                    Get
                  </Button>
                </Grid> */}

                <Grid container spacing={8} style={containerGroupWrapperStyle}>
                  <Grid item xs={12}>
                    <Typography variant="headline" >
                      CONTRACT
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Paper style={paperStyle} elevation={2}>
                      <Grid item xs={12}>
                        <UploadButton onUpload={this.onUpload}/>
                      </Grid>
                      <Grid item xs={12}>
                        <ContractInputAddress 
                          onChangeContractAddress={this.onChangeContractAddress}
                          contractAddress={this.state.contractAddress}
                          enableContractAddressField={this.state.enableContractAddressField}
                        />
                        {/* <TextField
                            label="Contract address"
                            InputLabelProps={{
                              shrink: true,
                            }}
                            placeholder="Address"
                            onChange={this.onChangeContractAddress}
                            fullWidth
                            margin="normal"
                            value={this.state.contractAddress}
                            disabled={!this.state.enableContractAddressField}
                        /> */}
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
                    <InOutValues
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
                        style={{padding: "5px"}}
                        theme="codeschool"
                        indentWidth="2"
                        collapsed="2"
                        />
                    </Paper>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default HomePage;