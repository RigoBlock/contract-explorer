import FormControl from '@material-ui/core/FormControl'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import Select from '@material-ui/core/Select'

class TokenSelect extends Component {
  static propTypes = {
    tokensList: PropTypes.array.isRequired,
    onTokenSelect: PropTypes.func.isRequired,
    tokenSelected: PropTypes.object,
    disabled: PropTypes.bool
  }

  static defaultProps = {
    tokenSelected: {
      address: ''
    },
    disabled: true
  }

  onTokenSelect = event => {
    this.props.onTokenSelect(event)
  }

  renderSelectItems = () => {
    const { tokensList } = this.props
    return tokensList.map(element => {
      return (
        <MenuItem key={element.symbol} value={element.symbol}>
          {element.symbol} / {element.name}
        </MenuItem>
      )
    })
  }

  render() {
    const { tokenSelected, disabled } = this.props
    return (
      <FormControl fullWidth={true} disabled={disabled}>
        <InputLabel htmlFor="token-select">Tokens</InputLabel>
        <Select
          value={tokenSelected.symbol}
          onChange={this.onTokenSelect}
          input={<Input name="token" id="token-select" />}
        >
          {this.renderSelectItems()}
        </Select>
      </FormControl>
    )
  }
}

export default TokenSelect
