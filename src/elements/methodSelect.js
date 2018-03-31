import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Input, { InputLabel } from 'material-ui/Input';
import { MenuItem } from 'material-ui/Menu';
import { FormControl } from 'material-ui/Form';
import Select from 'material-ui/Select';

class MethodSelect extends Component {

  state = {
    methodSelected: '',
  };

  static propTypes = {
    abi: PropTypes.object.isRequired,
    onMethodSelect: PropTypes.func.isRequired,
    disabled: PropTypes.bool.isRequired,
  };

  onMethodSelect = event => {
    console.log(event.target.value)
    this.props.onMethodSelect(event)
    this.setState({ methodSelected: event.target.value });
  };
  

  renderMenuItems = () => {
    const { abi } = this.props
    return abi.map((element, index) => {
        return <MenuItem key={element.name + index} value={element.name}>{element.name}</MenuItem>
    }
    )
  }

  render() {
    return (
      <FormControl fullWidth={true} disabled={this.props.disabled}>
        <InputLabel htmlFor="method-select">Method</InputLabel>
        <Select
          value={this.state.methodSelected}
          onChange={this.onMethodSelect}
          input={<Input name="method" id="method-select" />}
        >
          {this.renderMenuItems()}
        </Select>
      </FormControl>
    );
  }
}

export default MethodSelect;