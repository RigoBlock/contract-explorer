import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'

class ContractInputAddress extends Component {

  static contextTypes = {web3: PropTypes.object.isRequired};

  state = {
    error: false,
    errorMsg: ''
  }

  static propTypes = {
    contractAddress: PropTypes.string.isRequired,
    enableContractAddressField: PropTypes.bool.isRequired,
    onChangeContractAddress:PropTypes.func.isRequired,
  };

  onChangeContractAddress = event => {
    const { web3 } = this.context
    if (web3.utils.isAddress(event.target.value)) {
      this.setState({
        error: false,
        errorMsg: ''
      })
    } else {
      this.setState({
        error: true,
        errorMsg: 'Invalid address'
      })
    }
    this.props.onChangeContractAddress(event)
  };

  render() {
    return (
      <FormControl error={this.state.error} fullWidth={true}>
        <TextField
          label="Contract address"
          InputLabelProps={{
            shrink: true,
          }}
          placeholder="Address"
          onChange={this.onChangeContractAddress}
          fullWidth
          margin="normal"
          value={this.props.contractAddress}
          disabled={!this.props.enableContractAddressField}
        />
        <FormHelperText>{this.state.errorMsg}</FormHelperText>
      </FormControl>
    );
  }
}

export default ContractInputAddress;