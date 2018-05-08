import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Input, { InputLabel } from 'material-ui/Input';
import { MenuItem } from 'material-ui/Menu';
import { FormControl } from 'material-ui/Form';
import Select from 'material-ui/Select';

class ExchangeSelect extends Component {

  state = {
    echangeSelected: 'rigoBlock',
  };

  static propTypes = {
    exchangesList: PropTypes.object.isRequired,
    onExchangeSelect: PropTypes.func.isRequired,
  };

  onExchangeSelect = event => {
    this.props.onExchangeSelect(event.target.value)
    this.setState({ echangeSelected: event.target.value });
  };
  

  renderMenuItems = () => {
    const { exchangesList } = this.props
    var menuItems = Array()

    Object.keys(exchangesList).forEach(function(key,index) {
      menuItems.push(<MenuItem key={key + index} value={key}>{key}</MenuItem>)
  })
    return menuItems
  }

  render() {
    return (
      <FormControl fullWidth={true} >
        <InputLabel htmlFor="exchange-select">Exchange</InputLabel>
        <Select
          value={this.state.echangeSelected}
          onChange={this.onExchangeSelect}
          input={<Input name="exchange" id="exchange-select" />}
        >
          {this.renderMenuItems()}
        </Select>
      </FormControl>
    );
  }
}

export default ExchangeSelect 