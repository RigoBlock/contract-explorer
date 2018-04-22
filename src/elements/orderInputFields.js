import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormControl, FormHelperText } from 'material-ui/Form';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import Paper from 'material-ui/Paper';
import { BigNumber } from '@0xproject/utils';


class OrderInputFields extends Component {

  constructor(props) {
    super(props)
    this.state = {
      prevProps: this.props,
      error: false,
      errorMsg: ''
    };
  }

  static contextTypes = {web3: PropTypes.object.isRequired};

  static propTypes = {
    onSignOrder: PropTypes.func.isRequired,
    onOrderChange: PropTypes.func.isRequired,
    order: PropTypes.object.isRequired,
  };

  // static getDerivedStateFromProps(nextProps, prevState) {
  //   const { prevProps } = prevState
  //   if (nextProps.methodSelected.name !== prevProps.methodSelected.name) {
  //     return {
  //       inputs: Array.apply(null, Array(nextProps.methodSelected.inputs.length)).map(function () { return ""}),
  //       value: 0,
  //       prevProps: nextProps,
  //     };
  //   }
  //   // Return null to indicate no change to state.
  //   return null;
  // }

  // onSend = () => {
  //   const { inputs, value } = this.state
  //   this.props.onSend(inputs, value)
  // }

  onTextFieldChange = event => {
    const { order } = this.props
    const newOrder = { ...order, ...{[event.target.id]: event.target.value}}
    this.props.onOrderChange(newOrder)
  };
  
  renderInputFields = () => {
    const { order } = this.props
    var textFields =[]
    var fieldValue
    for (var key in order) {
      fieldValue = order[key]

      if ( typeof order[key] === 'string') {
        fieldValue = order[key].toLowerCase()
      } else {
        fieldValue = order[key]
      }
      if ( order[key] instanceof BigNumber) {
        fieldValue = order[key].toString().toLowerCase()
      } else {
        fieldValue = order[key]
      }
      textFields.push(
      <TextField
          id={key}
          key={key}
          label={key}
          InputLabelProps={{
            shrink: true,
          }}
          // placeholder={element.type}
          onChange={this.onTextFieldChange}
          fullWidth
          margin="normal"
          value={fieldValue}
      />
      )
    }
    return textFields
  }

  render() {
    const paperStyle = {
      padding: 10,
    }
    return (
      <Paper style={paperStyle} elevation={2} >
        <FormControl fullWidth={true} error={this.error}>
          {this.renderInputFields()}
          <FormHelperText>{this.state.errorMsg}</FormHelperText>
          <br />
          <Button variant="raised" color="primary" onClick={this.props.onSignOrder}>
          Sign
        </Button>
        </FormControl>
      </Paper>
    );
  }
}

export default OrderInputFields;