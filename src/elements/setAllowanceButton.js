import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormControl } from 'material-ui/Form';
import Button from 'material-ui/Button';

class SetAllowanceButton extends Component {

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
    onSetAllowance: PropTypes.func.isRequired,
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


  render() {
    return (
      <FormControl fullWidth={true}>
        <Button variant="raised" color="primary" onClick={this.props.onSetAllowance}>
          Set allowance
      </Button>
      </FormControl>
    );
  }
}

export default SetAllowanceButton