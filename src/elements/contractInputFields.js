import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormControl, FormHelperText } from 'material-ui/Form';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import Paper from 'material-ui/Paper';


class ContractInputFields extends Component {

  constructor(props) {
    super(props)
    this.state = {
      value: 0,
      prevProps: this.props,
      error: false,
      errorMsg: ''
    };
  }

  static contextTypes = {web3: PropTypes.object.isRequired};

  static propTypes = {
    methodSelected: PropTypes.object.isRequired,
    onSend: PropTypes.func.isRequired,
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    const { prevProps } = prevState
    if (nextProps.methodSelected.name !== prevProps.methodSelected.name) {
      return {
        inputs: Array.apply(null, Array(nextProps.methodSelected.inputs.length)).map(function () { return ""}),
        value: 0,
        prevProps: nextProps,
      };
    }
    // Return null to indicate no change to state.
    return null;
  }

  onSend = () => {
    const { inputs, value } = this.state
    this.props.onSend(inputs, value)
  }

  onTextFieldChange = event => {
    const { methodSelected } = this.props
    const { inputs } = this.state
    var newInputs = [...inputs]
    if (event.target.id === 'value' ){
      this.setState({
        value: event.target.value
      })
      return true
    }
    methodSelected.inputs.map((element, index) => {
      if (element.name === event.target.id) {
        if (event.target.value !== '') {
          newInputs[index] = event.target.value
        } else {
          newInputs.splice(index, 1);
        }
        this.setState({
          inputs: newInputs
        })
      }
      return true
    }
    )
    return true
  };
  
  renderInputFields = () => {
    const { methodSelected } = this.props
    return methodSelected.inputs.map((element, index) => {
      return (
        <TextField
          id={element.name}
          key={element.name}
          label={element.name}
          InputLabelProps={{
            shrink: true,
          }}
          placeholder={element.type}
          onChange={this.onTextFieldChange}
          fullWidth
          margin="normal"
          value={this.state.inputs[index]}
      />
      )
    }
    )
  }

  renderInputFieldValue = () => {
    const { methodSelected } = this.props
    
    if (methodSelected.payable){
      return (
        <TextField
          id='value'
          key={methodSelected.name}
          label='value'
          InputLabelProps={{
            shrink: true,
          }}
          placeholder="uint256"
          fullWidth
          onChange={this.onTextFieldChange}
          margin="normal"
          // value={this.state.value}
      />
      )
    }
  }

  render() {
    const paperStyle = {
      padding: 10,
    }
    if (typeof this.props.methodSelected.inputs === 'undefined') {
      return null
    }
    return (
      <Paper style={paperStyle} elevation={2} >
        <FormControl fullWidth={true} error={this.error}>
          {this.renderInputFieldValue()}
          {this.renderInputFields()}
          <FormHelperText>{this.state.errorMsg}</FormHelperText>
          <br />
          <Button variant="raised" color="primary" onClick={this.onSend}>
          Send
        </Button>
        </FormControl>

      </Paper>
    );
  }
}

export default ContractInputFields;