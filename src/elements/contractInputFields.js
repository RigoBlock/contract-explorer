import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormControl } from 'material-ui/Form';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import Paper from 'material-ui/Paper';


class ContractInputFields extends Component {

  static contextTypes = {web3: PropTypes.object.isRequired};

  static propTypes = {
    methodSelected: PropTypes.object.isRequired,
    onSend: PropTypes.func.isRequired,
  };

  state = {
    inputs: [],
    value: 0
  };

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
        newInputs[index] = event.target.value
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
    return methodSelected.inputs.map((element) => {
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
          // value={inputs[index]}
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
    console.log(this.props.methodSelected)
    if (typeof this.props.methodSelected.inputs === 'undefined') {
      return null
    }
    console.log(this.state)
    return (
      <Paper style={paperStyle} elevation={2}>
        <FormControl fullWidth={true}>
          {this.renderInputFieldValue()}
          {this.renderInputFields()}
        </FormControl>
        <Button variant="raised" color="primary" onClick={this.onSend}>
          Send
        </Button>
      </Paper>
    );
  }
}

export default ContractInputFields;